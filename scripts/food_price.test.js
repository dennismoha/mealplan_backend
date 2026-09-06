const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup() {
  let saved;
  const prisma = { fooditems: { findUnique: async () => ({ food_itemID: 'egg' }) }, food_nutrition: { upsert: async ({ update }) => { saved = update; return update; } } };
  const sandbox = { exports: {}, require: () => prisma };
  vm.runInNewContext(fs.readFileSync(require.resolve('../controller/food_items/nutrition'), 'utf8'), sandbox);
  return { save: async body => { let status = 200; let payload; await sandbox.exports.save({ params: { id: 'egg' }, body }, { status: value => { status = value; return { json: data => { payload = data; } }; }, json: data => { payload = data; } }); return { status, payload, saved }; } };
}
test('price writes require provenance and reject invalid dates and amounts', async () => {
  const body = { price_per_100g: 25, currency: 'KES', price_source: 'Market', price_location: 'Nairobi', price_checked_at: '2026-01-01' };
  assert.equal((await setup().save(body)).status, 200);
  for (const patch of [{ price_checked_at: '2026-02-30' }, { price_checked_at: '2999-01-01' }, { price_checked_at: '' }, { price_location: '' }, { price_source: '' }, { price_per_100g: -1 }, { price_per_100g: true }, { currency: 'not currency' }]) {
    assert.equal((await setup().save({ ...body, ...patch })).status, 400);
  }
});
test('nutrition-only edits preserve price metadata; zero and unknown prices remain distinct', async () => {
  const result = await setup().save({ energy_kcal: 100, source: 'Nutrition reference' });
  assert.equal(result.status, 200);
  assert.equal(Object.hasOwn(result.saved, 'price_checked_at'), false);
  assert.equal(Object.hasOwn(result.saved, 'price_per_100g'), false);
  const zero = await setup().save({ price_per_100g: 0, price_checked_at: '2026-01-01', price_source: 'Farm', price_location: 'Nairobi' });
  assert.equal(zero.saved.price_per_100g, 0);
  const unknown = await setup().save({ price_per_100g: null });
  assert.equal(unknown.saved.price_per_100g, null);
});
