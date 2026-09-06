const test = require('node:test');
const assert = require('node:assert/strict');
const { deleteUnusedFoodItem } = require('../globals/services/db/delete_food_item');

function database(counts = [0, 0, 0], exists = true) {
  const operations = [];
  const food = { food_itemID: 'food-id', fooditem_cacheID: 'cache-id', local_names: [] };
  const tx = {
    fooditems: { findFirst: async () => exists ? food : null, delete: async args => operations.push(['food', args]) },
    meal_food_items: { count: async () => counts[0] },
    meal_type_food_items: { count: async () => counts[1] },
    recipe_food_items: { count: async () => counts[2] },
  };
  for (const table of ['fooditemsimages', 'food_item_countries', 'food_nutrition']) tx[table] = { deleteMany: async args => operations.push([table, args]) };
  return { operations, prisma: { $transaction: async (fn, options) => { assert.equal(options.isolationLevel, 'Serializable'); return fn(tx); } } };
}

test('a reference from either meal table or a recipe blocks deletion without writes', async () => {
  for (const counts of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
    const { prisma, operations } = database(counts);
    assert.equal((await deleteUnusedFoodItem(prisma, 'food-id')).status, 409);
    assert.deepEqual(operations, []);
  }
});
test('missing food returns 404 without writes', async () => {
  const { prisma, operations } = database(undefined, false);
  assert.equal((await deleteUnusedFoodItem(prisma, 'missing')).status, 404);
  assert.deepEqual(operations, []);
});
test('unused food deletes auxiliary rows then the food within the transaction', async () => {
  const { prisma, operations } = database();
  assert.equal((await deleteUnusedFoodItem(prisma, 'cache-id')).status, 200);
  assert.deepEqual(operations.map(([name]) => name), ['fooditemsimages', 'food_item_countries', 'food_nutrition', 'food']);
  assert.deepEqual(operations.at(-1)[1], { where: { food_itemID: 'food-id' } });
});
