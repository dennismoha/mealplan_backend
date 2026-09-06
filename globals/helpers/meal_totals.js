const nutrients = ['energy_kcal','protein_g','carbohydrates_g','fat_g','fiber_g'];
const positive = value => value != null && Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : null;
function weight(link) {
  if (positive(link.grams)) return Number(link.grams);
  const quantity = positive(link.quantity);
  const unit = (link.unit || '').trim().toLowerCase();
  return quantity && ['g','gram','grams','kg','kilogram','kilograms'].includes(unit) ? quantity * (unit.startsWith('k') ? 1000 : 1) : null;
}
function calculateMeals(selections, dishes, foods, nutrition, recipes, recipeLinks) {
  const rows = new Map(); const warnings = new Set(); const weightGaps = new Map();
  function addDish(id, count, visited = new Set(), components = {}) {
    const dish = dishes.find(d => d.mealTypesID === id || d.meal_name === id);
    if (!dish) { warnings.add(`Unknown meal: ${id}`); return; }
    if (visited.has(dish.mealTypesID)) { warnings.add(`Circular combination: ${dish.meal_name}`); return; }
    const seen = new Set(visited); seen.add(dish.mealTypesID);
    if (dish.meal_kind === 'combination') {
      for (const item of dish.combination_items || []) addDish(item.dish_id, count * (positive(components[item.dish_id]) || positive(item.portion_multiplier) || 1), seen);
      return;
    }
    const recipe = recipes.find(r => r.meal_typeID === dish.mealTypesID);
    const links = recipe ? recipeLinks.filter(l => l.recipe_id === recipe.recipe_ID) : dish.meal_type_food_items || [];
    const servings = positive(recipe?.servings) || positive(dish.servings) || 1;
    if (!links.length) warnings.add(`${dish.meal_name}: no linked ingredient quantities`);
    for (const link of links) {
      const food = foods.find(f => f.food_itemID === link.food_item_id);
      const row = rows.get(link.food_item_id) || { food_item_id: link.food_item_id, name: food?.english_name || food?.food_name || link.food_item_id, grams: 0, missing_quantity: false };
      const grams = weight(link);
      if (grams === null) { weightGaps.set(`${dish.mealTypesID}:${link.food_item_id}`, { dish_id: dish.mealTypesID, dish_name: dish.meal_name, food_item_id: link.food_item_id, food_name: row.name, recipe_id: recipe?.recipe_ID || null }); row.missing_quantity = true; warnings.add(`${dish.meal_name} / ${row.name}: add a gram weight`); }
      else row.grams += grams * count / servings;
      rows.set(link.food_item_id, row);
    }
  }
  for (const selection of selections) if (selection.id) addDish(selection.id, positive(selection.servings) || 1, new Set(), selection.components);
  const totals = Object.fromEntries(nutrients.map(key => [key, 0]));
  const missing = Object.fromEntries(nutrients.map(key => [key, []]));
  const costs = {}; const missingPrices = []; const priceWarnings = [];
  const shopping = [...rows.values()].map(row => {
    const n = nutrition.find(n => n.food_item_id === row.food_item_id);
    for (const key of nutrients) {
      if (row.missing_quantity || !n || !positive(n.serving_size_g) || n[key] == null) missing[key].push(row.name);
      if (n && positive(n.serving_size_g) && n[key] != null) totals[key] += Number(n[key]) * row.grams / Number(n.serving_size_g);
    }
    let cost = null;
    if (n?.price_per_100g != null) { cost = Number(n.price_per_100g) * row.grams / 100; costs[n.currency] = (costs[n.currency] || 0) + cost; }
    if (cost !== null) {
      const checked = n.price_checked_at && new Date(n.price_checked_at);
      if (!checked || !Number.isFinite(checked.getTime())) priceWarnings.push(`${row.name}: price check date unknown`);
      else if (Date.now() - checked.getTime() > 30 * 86400000) priceWarnings.push(`${row.name}: price checked over 30 days ago`);
      if (!n.price_location) priceWarnings.push(`${row.name}: price location unknown`);
    }
    if (row.missing_quantity || cost === null) missingPrices.push(row.name);
    return { ...row, grams: Math.round(row.grams * 100) / 100, estimated_cost: cost === null ? null : Math.round(cost * 100) / 100, currency: n?.currency || null, price_checked_at: n?.price_checked_at || null, price_source: n?.price_source || null, price_location: n?.price_location || null };
  }).sort((a, b) => a.name.localeCompare(b.name));
  return { price_warnings: priceWarnings, missing_weights: [...weightGaps.values()], nutrients: Object.fromEntries(Object.entries(totals).map(([k,v]) => [k, Math.round(v * 100) / 100])), missing_nutrition: missing, costs: Object.fromEntries(Object.entries(costs).map(([k,v]) => [k, Math.round(v * 100) / 100])), missing_prices: missingPrices, shopping, warnings: [...warnings], complete: warnings.size === 0 && !missingPrices.length && Object.values(missing).every(values => !values.length) };
}
module.exports = { calculateMeals, weight };
