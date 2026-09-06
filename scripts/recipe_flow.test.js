const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup(duplicate = null) {
  const writes = [];
  const tx = {
    mealtype: { findUnique: async () => ({ meal_type_food_items: [{ food_item_id: 'food', quantity: '2', unit: 'cups', preparation_notes: 'Rinsed' }] }) },
    recipe: { findFirst: async () => duplicate, create: async ({ data }) => { writes.push(data); return { ...data, idrecipe: 1 }; }, update: async args => { writes.push(args); return { recipe_ID: 'recipe' }; } },
    fooditems: { count: async () => 1 },
    recipe_food_items: { createMany: async args => writes.push(args), deleteMany: async () => {} },
  };
  const sandbox = { exports: {}, require: name => name === 'uuid' ? { v4: () => 'recipe' } : name.includes('meal_totals') ? require('../globals/helpers/meal_totals') : {} };
  vm.runInNewContext(fs.readFileSync(require.resolve('../controller/recipes/recipes'), 'utf8') + '\nexports.saveForTest = saveRecipe;', sandbox);
  return { save: sandbox.exports.saveForTest, tx, writes };
}
const body = { meal_typeID: 'meal', title: 'Dish', ingredients: '2 cups rice', instructions: 'Cook rice' };
test('a second recipe for a meal is rejected without writes', async () => {
  const { save, tx, writes } = setup({ idrecipe: 1 });
  await assert.rejects(save(tx, body, 4), error => error.status === 409);
  assert.equal(writes.length, 0);
});
test('new recipe inherits meal food links when omitted and ignores ownership overrides', async () => {
  const { save, tx, writes } = setup();
  await save(tx, { ...body, owner_user_id: 999, recipe_ID: 'override' }, 4);
  assert.equal(writes[0].owner_user_id, 4);
  assert.equal(writes[0].recipe_ID, 'recipe');
  assert.equal(writes[1].data[0].food_item_id, 'food');
  assert.equal(writes[1].data[0].quantity, '2 cups');
});
test('recipe cannot move to another meal and blank methods are rejected', async () => {
  const { save, tx, writes } = setup();
  await assert.rejects(save(tx, body, 4, { meal_typeID: 'other' }), error => error.status === 400);
  await assert.rejects(save(tx, { ...body, instructions: ' ' }, 4), error => error.status === 400);
  assert.equal(writes.length, 0);
});
