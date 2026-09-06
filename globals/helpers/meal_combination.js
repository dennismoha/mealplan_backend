function validateCombination(body) {
  const invalid = message => { throw Object.assign(new Error(message), { status: 400 }); };
  const text = (key, max = 65535) => {
    if (body[key] == null) return null;
    if (typeof body[key] !== 'string' || body[key].trim().length > max) invalid(`Invalid ${key}`);
    return body[key].trim() || null;
  };
  const meal_name = text('meal_name', 255);
  if (!meal_name) invalid('Combination name is required');
  if (!Array.isArray(body.dishes) || body.dishes.length < 2) invalid('Choose at least two different dishes');
  const ids = new Set();
  const dishes = body.dishes.map((dish, display_order) => {
    if (!dish || typeof dish.dish_id !== 'string' || !dish.dish_id || ids.has(dish.dish_id)) invalid('Choose distinct dishes');
    ids.add(dish.dish_id);
    if (dish.portion_multiplier != null && (!Number.isFinite(Number(dish.portion_multiplier)) || Number(dish.portion_multiplier) <= 0)) invalid('Dish servings must be positive');
    for (const key of ['portions', 'notes']) if (dish[key] != null && (typeof dish[key] !== 'string' || dish[key].length > (key === 'portions' ? 100 : 65535))) invalid(`Invalid dish ${key}`);
    return { dish_id: dish.dish_id, portion_multiplier: dish.portion_multiplier == null ? 1 : Number(dish.portion_multiplier), portions: dish.portions?.trim() || null, notes: dish.notes?.trim() || null, display_order };
  });
  return { meal_name, description: text('description'), image_url: text('image_url'), serving_instructions: text('serving_instructions'), dishes };
}
module.exports = { validateCombination };
