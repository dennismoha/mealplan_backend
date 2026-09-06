const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateMeals, weight } = require('../globals/helpers/meal_totals');
const foods = [{ food_itemID: 'rice', food_name: 'Rice' }];
const nutrition = [{ food_item_id: 'rice', serving_size_g: 100, energy_kcal: 100, protein_g: 2, carbohydrates_g: 20, fat_g: 0, fiber_g: 0, price_per_100g: 10, currency: 'KES' }];
const dishes = [{ mealTypesID: 'dish', meal_name: 'Rice dish', servings: 2, meal_type_food_items: [{ food_item_id: 'rice', grams: 200 }] }, { mealTypesID: 'combo', meal_kind: 'combination', combination_items: [{ dish_id: 'dish', portion_multiplier: 2 }] }];
test('totals scale by yield and component servings; shopping combines duplicates', () => {
  const result = calculateMeals([{ id: 'combo' }, { id: 'dish' }], dishes, foods, nutrition, [], []);
  assert.equal(result.shopping.length, 1); assert.equal(result.shopping[0].grams, 300);
  assert.equal(result.nutrients.energy_kcal, 300); assert.equal(result.nutrients.fat_g, 0);
  assert.equal(result.costs.KES, 30); assert.equal(result.complete, true);
});
test('recipe weights override base dish weights and currencies stay separate', () => {
  const result = calculateMeals([{ id: 'dish' }], dishes, foods, nutrition, [{ recipe_ID: 'r', meal_typeID: 'dish', servings: 4 }], [{ recipe_id: 'r', food_item_id: 'rice', grams: 200 }]);
  assert.equal(result.shopping[0].grams, 50); assert.equal(result.costs.KES, 5);
});
test('unknown quantities and absent nutrients/prices are explicitly incomplete', () => {
  assert.equal(weight({ quantity: '2', unit: 'cups' }), null);
  assert.equal(weight({ quantity: '0.5', unit: 'kg' }), 500);
  const result = calculateMeals([{ id: 'dish' }], [{ ...dishes[0], meal_type_food_items: [{ food_item_id: 'rice', quantity: '2', unit: 'cups' }] }], foods, [], [], []);
  assert.equal(result.complete, false); assert.equal(result.shopping[0].missing_quantity, true);
  assert.equal(result.missing_prices.length, 1); assert.equal(result.missing_nutrition.energy_kcal.length, 1);
});
test('two currencies are never silently added together', () => {
  const result = calculateMeals([{ id: 'x' }], [{ mealTypesID: 'x', servings: 1, meal_type_food_items: [{ food_item_id: 'rice', grams: 100 }, { food_item_id: 'beans', grams: 100 }] }], [...foods, { food_itemID: 'beans', food_name: 'Beans' }], [...nutrition, { ...nutrition[0], food_item_id: 'beans', currency: 'USD', price_per_100g: 2 }], [], []);
  assert.deepEqual(result.costs, { KES: 10, USD: 2 });
});

test('missing weights identify the exact dish and recipe to edit and deduplicate repeated slots', () => {
  const result = calculateMeals([{ id: 'dish' }, { id: 'dish' }], dishes, foods, nutrition, [{ recipe_ID: 'recipe-id', meal_typeID: 'dish', servings: 1 }], [{ recipe_id: 'recipe-id', food_item_id: 'rice' }]);
  assert.deepEqual(result.missing_weights, [{ dish_id: 'dish', dish_name: 'Rice dish', food_item_id: 'rice', food_name: 'Rice', recipe_id: 'recipe-id' }]);
  const base = calculateMeals([{ id: 'dish' }], [{ ...dishes[0], meal_type_food_items: [{ food_item_id: 'rice' }] }], foods, nutrition, [], []);
  assert.equal(base.missing_weights[0].recipe_id, null);
});

test('plan portions scale one egg versus six eggs without changing the dish', () => {
  const egg = [{ mealTypesID: 'eggs', meal_name: 'Eggs', servings: 1, meal_type_food_items: [{ food_item_id: 'egg', grams: 50 }] }];
  const eggFoods = [{ food_itemID: 'egg', food_name: 'Egg' }];
  const eggNutrition = [{ ...nutrition[0], food_item_id: 'egg' }];
  const one = calculateMeals([{ id: 'eggs', servings: 1 }], egg, eggFoods, eggNutrition, [], []);
  const six = calculateMeals([{ id: 'eggs', servings: 6 }], egg, eggFoods, eggNutrition, [], []);
  assert.equal(one.shopping[0].grams, 50);
  assert.equal(six.shopping[0].grams, 300);
  assert.equal(six.nutrients.energy_kcal, one.nutrients.energy_kcal * 6);
  assert.equal(six.costs.KES, one.costs.KES * 6);
  assert.equal(egg[0].servings, 1);
});

test('a plan overrides one combination component and scales the whole portion', () => {
  const result = calculateMeals([{ id: 'combo', servings: 0.5, components: { dish: 6 } }], dishes, foods, nutrition, [], []);
  assert.equal(result.shopping[0].grams, 300);
  assert.equal(result.costs.KES, 30);
  assert.equal(dishes[1].combination_items[0].portion_multiplier, 2);
});

test('price estimates retain source, date and location and flag older prices', () => {
  const result = calculateMeals([{ id: 'dish' }], dishes, foods, [{ ...nutrition[0], price_checked_at: '2020-01-01', price_location: 'Nairobi', price_source: 'Market' }], [], []);
  assert.equal(result.shopping[0].price_location, 'Nairobi');
  assert.equal(result.shopping[0].price_source, 'Market');
  assert.equal(result.shopping[0].price_checked_at, '2020-01-01');
  assert.match(result.price_warnings[0], /over 30 days/);
});
