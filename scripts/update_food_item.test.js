const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { validateLocalNames } = require('../globals/helpers/food_local_names');

function controller() {
  const writes = [];
  const food = { food_itemID: 'food', fooditem_cacheID: 'cache', category_id: 'cat', foodsubcategory_id: 'sub', local_names: [{ id: 7, pronunciation_public_id: 'keep-recording' }] };
  const prisma = {
    fooditems: { findFirst: async () => food, update: async args => { writes.push(args); return food; } },
    countries: { count: async () => 1 },
    foodsubcategory: { findFirst: async () => ({}) },
  };
  const sandbox = { exports: {}, require: name => {
    if (name.includes('food_local_names')) return { validateLocalNames };
    if (name.includes('models/prisma')) return prisma;
    if (name.includes('food_item_cache')) return { foodItemRedis: { deleteSingleFoodItemFromCache: async () => {} } };
    if (name === 'cloudinary') return { v2: { uploader: { destroy: async () => { throw new Error('Unchanged recording must not be deleted'); } } } };
    return {};
  }, console, Buffer };
  vm.runInNewContext(fs.readFileSync(require.resolve('../controller/food_items/food_items'), 'utf8'), sandbox);
  const response = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
  return { update: sandbox.exports.updateFoodItemById, writes, response, prisma };
}
test('editing a name retains its recording and ignores client-supplied recording URLs', async () => {
  const { update, writes, response } = controller();
  await update({ params: { id: 'food' }, body: { english_name: ' Maize ', local_names: [{ id: 7, country_id: 1, scope: 'countrywide', name: 'Mahindi', pronunciation_url: 'untrusted' }] } }, response);
  assert.equal(response.statusCode, 200);
  assert.equal(writes[0].data.food_name, 'Maize');
  assert.equal(writes[0].data.english_name, 'Maize');
  assert.equal(writes[0].data.local_names.update[0].where.id, 7);
  assert.equal(writes[0].data.local_names.update[0].data.pronunciation_url, undefined);
  assert.equal(writes[0].data.local_names.update[0].data.pronunciation_public_id, undefined);
});
test('invalid names, foreign name IDs, and mismatched categories do not write', async () => {
  for (const body of [{ english_name: ' ' }, { local_names: [{ id: 99, country_id: 1, scope: 'countrywide', name: 'Name' }] }, { category_id: '' }]) {
    const { update, writes, response } = controller();
    await update({ params: { id: 'food' }, body }, response);
    assert.equal(response.statusCode, 400);
    assert.equal(writes.length, 0);
  }
});
test('omitted local names are left unchanged', async () => {
  const { update, writes, response } = controller();
  await update({ params: { id: 'food' }, body: { descriptionl: 'Updated description' } }, response);
  assert.equal(response.statusCode, 200);
  assert.equal(writes[0].data.local_names, undefined);
});
