// Integration check: all temporary rows are rolled back, including on failure.
require('dotenv').config();
const assert = require('node:assert/strict');
const { v4: uuid } = require('uuid');
const prisma = require('../models/prisma');
const rollback = new Error('ROLLBACK_TEST');
(async () => {
  try {
    await prisma.$transaction(async tx => {
      const ids = [uuid(), uuid(), uuid()];
      for (const id of ids.slice(0, 2)) await tx.mealtype.create({ data: { mealTypesID: id, meal_name: `Combination test ${id}`, meal_kind: 'dish' } });
      const dishes = ids.slice(0, 2).map((dish_id, display_order) => ({ dish_id, display_order }));
      await tx.mealtype.create({ data: { mealTypesID: ids[2], meal_name: `Combination test ${ids[2]}`, meal_kind: 'combination', combination_items: { create: dishes } } });
      const changed = await tx.mealtype.update({ where: { mealTypesID: ids[2] }, data: { combination_items: { deleteMany: {}, create: dishes.reverse().map((d, display_order) => ({ ...d, display_order, portions: '2 servings' })) } }, include: { combination_items: { orderBy: { display_order: 'asc' } } } });
      assert.equal(changed.combination_items[0].dish_id, ids[1]);
      assert.equal(changed.combination_items.length, 2);
      await assert.rejects(tx.mealtype.delete({ where: { mealTypesID: ids[0] } }), error => error.code === 'P2003');
      throw rollback;
    });
  } catch (error) { if (error !== rollback) throw error; }
  console.log('Combination creation, editing, order, and dish deletion protection verified; test rows rolled back.');
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
