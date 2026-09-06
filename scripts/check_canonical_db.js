// Focused migration verification; fixture writes are always rolled back.
require('dotenv').config();
const assert = require('node:assert/strict');
const { v4: uuid } = require('uuid');
const prisma = require('../models/prisma');
const done = new Error('ROLLBACK');
(async () => {
  try { await prisma.$transaction(async tx => {
    const id = uuid();
    await tx.mealtype.create({ data: { mealTypesID: id, meal_name: `Reference check ${id}`, servings: 2 } });
    const day = await tx.mealplan.create({ data: { day_of_week: 'Monday', breakfast_id: id } });
    await tx.mealtype.update({ where: { mealTypesID: id }, data: { meal_name: `Renamed ${id}` } });
    const stored = await tx.mealplan.findFirst({ where: { idMealPlan: day.idMealPlan }, include: { breakfast_dish: true } });
    assert.equal(stored.breakfast_id, id); assert.equal(stored.breakfast_dish.meal_name, `Renamed ${id}`);
    await assert.rejects(tx.mealtype.delete({ where: { mealTypesID: id } }), e => e.code === 'P2003');
    await tx.food_nutrition.findMany({ take: 1, select: { price_per_100g: true, currency: true } });
    await tx.meal_type_food_items.findMany({ take: 1, select: { grams: true } });
    throw done;
  }); } catch (e) { if (e !== done) throw e; }
  console.log('Planner references survive renaming; deletion protection and nutrition fields verified. All fixtures rolled back.');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
