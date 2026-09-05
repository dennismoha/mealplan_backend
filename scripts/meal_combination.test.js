const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { validateCombination } = require('../globals/helpers/meal_combination');
const body = { meal_name: ' Ugali and greens ', dishes: [{ dish_id: 'ugali', portions: ' 2 servings ' }, { dish_id: 'greens' }] };
test('combination validation preserves references, portions, and ordering', () => {
  const result = validateCombination(body);
  assert.equal(result.meal_name, 'Ugali and greens');
  assert.equal(result.dishes[0].portions, '2 servings');
  assert.equal(result.dishes[1].display_order, 1);
});
test('rejects missing names, fewer than two dishes, duplicates, and invalid notes', () => {
  for (const patch of [{ meal_name: '' }, { dishes: [] }, { dishes: [{ dish_id: 'ugali' }] }, { dishes: [{ dish_id: 'ugali' }, { dish_id: 'ugali' }] }, { dishes: [{ dish_id: 'ugali', notes: 2 }, { dish_id: 'greens' }] }]) assert.throws(() => validateCombination({ ...body, ...patch }));
});
test('API rejects nested or missing dishes without persisting a combination', async () => {
  let written = false;
  const tx = { mealtype: { findMany: async () => [{ mealTypesID: 'ugali' }], create: async () => { written = true; } } };
  const sandbox = { exports: {}, require: name => name.includes('models/prisma') ? { $transaction: fn => fn(tx) } : name.includes('meal_combination') ? { validateCombination } : { v4: () => 'uuid' } };
  vm.runInNewContext(fs.readFileSync(require.resolve('../controller/meal_type/combinations'), 'utf8'), sandbox);
  const res = { status(code) { this.code = code; return this; }, json() {} };
  await sandbox.exports.save({ body, params: {} }, res);
  assert.equal(res.code, 400);
  assert.equal(written, false);
});
