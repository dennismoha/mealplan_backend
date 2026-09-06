const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

function setup({ exists = true, linked = true } = {}) {
  const writes = [];
  const tx = {
    countries: { findUnique: async () => exists ? { id: 2 } : null },
    food_item_countries: { deleteMany: async args => { writes.push(['foodLink', args]); return { count: linked ? 1 : 0 }; } },
    meal_type_countries: { deleteMany: async args => { writes.push(['mealLink', args]); return { count: linked ? 1 : 0 }; } },
    mealtype: { updateMany: async args => { writes.push(['directCountry', args]); return { count: 0 }; } },
  };
  const prisma = { $transaction: async fn => fn(tx) };
  const sandbox = { exports: {}, require: () => prisma };
  vm.runInNewContext(fs.readFileSync(require.resolve('../controller/countries/countries'), 'utf8'), sandbox);
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
  return { handlers: sandbox.exports, writes, res };
}

test('food removal deletes only the selected country association', async () => {
  const { handlers, writes, res } = setup();
  await handlers.unlinkFood({ params: { id: '2', itemId: 'food-id' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(JSON.stringify(writes), JSON.stringify([['foodLink', { where: { country_id: 2, food_item_id: 'food-id' } }]]));
});
test('meal removal clears only matching country links, retaining the meal and recipes', async () => {
  const { handlers, writes, res } = setup();
  await handlers.unlinkMeal({ params: { id: '2', itemId: 'meal-id' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(JSON.stringify(writes), JSON.stringify([
    ['mealLink', { where: { country_id: 2, meal_type_id: 'meal-id' } }],
    ['directCountry', { where: { mealTypesID: 'meal-id', country_id: 2 }, data: { country_id: null } }],
  ]));
});
test('invalid or missing countries do not write; missing associations return 404', async () => {
  const invalid = setup();
  await invalid.handlers.unlinkFood({ params: { id: 'bad', itemId: 'food-id' } }, invalid.res);
  assert.equal(invalid.res.statusCode, 400);
  assert.equal(invalid.writes.length, 0);
  const missing = setup({ exists: false });
  await missing.handlers.unlinkMeal({ params: { id: '2', itemId: 'meal-id' } }, missing.res);
  assert.equal(missing.res.statusCode, 404);
  assert.equal(missing.writes.length, 0);
  const unlinked = setup({ linked: false });
  await unlinked.handlers.unlinkFood({ params: { id: '2', itemId: 'food-id' } }, unlinked.res);
  assert.equal(unlinked.res.statusCode, 404);
});
