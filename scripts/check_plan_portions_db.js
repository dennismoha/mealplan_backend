// Integration verification against local MySQL. All fixture changes roll back.
require('dotenv').config();
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');
const prisma = require('../models/prisma');
const { calculateMeals } = require('../globals/helpers/meal_totals');
const rollback = new Error('ROLLBACK_FIXTURES');
(async () => {
  try {
    await prisma.$transaction(async tx => {
      const food = await tx.fooditems.findFirst();
      assert.ok(food, 'At least one existing food is needed for this integration check');
      const id = randomUUID();
      await tx.mealtype.create({ data: { mealTypesID: id, meal_name: `Portion check ${id}`, servings: 1, meal_type_food_items: { create: { food_item_id: food.food_itemID, grams: 50 } } } });
      const prices = { exports: {}, require: () => tx };
      vm.runInNewContext(fs.readFileSync(require.resolve('../controller/food_items/nutrition'), 'utf8'), prices);
      const response = { json: () => {}, status: code => { throw new Error(`Unexpected response ${code}`); } };
      await prices.exports.save({ params: { id: food.food_itemID }, body: { price_per_100g: 20, currency: 'KES', price_checked_at: '2026-01-01', price_source: 'Integration fixture', price_location: 'Nairobi', serving_size_g: 100, energy_kcal: 100 } }, response);
      await prices.exports.save({ params: { id: food.food_itemID }, body: { protein_g: 10 } }, response);
      const price = await tx.food_nutrition.findUnique({ where: { food_item_id: food.food_itemID } });
      assert.equal(price.price_checked_at.toISOString().slice(0, 10), '2026-01-01');
      assert.equal(price.price_per_100g.toNumber(), 20);
      const dbModule = { module: { exports: {} }, require: name => name.includes('models/prisma') ? tx : Error };
      vm.runInNewContext(fs.readFileSync(require.resolve('../globals/services/db/meal_plan_db'), 'utf8'), dbModule);
      const db = new dbModule.module.exports();
      const controller = { exports: {}, require: name => name.includes('models/prisma') ? tx : { calculateMeals } };
      vm.runInNewContext(fs.readFileSync(require.resolve('../controller/meal_type/totals'), 'utf8'), controller);
      for (const servings of [1, 6]) {
        const plan = await tx.mealplantime.create({ data: { meal_plan_name: `check-${randomUUID()}` } });
        const input = { day_of_week: 'Monday', mealplan_key: plan.meal_plan_name, breakfast: id, portions: { breakfast: { servings, instructions: `${servings} portions` } } };
        await db.addMealPlanToDB(input);
        let summary;
        await controller.exports.plan({ params: { id: String(plan.idmealPlanWeek) } }, { json: value => { summary = value; } });
        assert.equal(summary.total.shopping[0].grams, 50 * servings);
        assert.equal(summary.total.costs.KES, 10 * servings);
        assert.equal(summary.days.Monday.nutrients.energy_kcal, 50 * servings);
        const { portions, ...legacyInput } = input;
        await db.updateMealPlanInDB(legacyInput);
        const stored = await tx.mealplantime.findUnique({ where: { idmealPlanWeek: plan.idmealPlanWeek }, include: { mealplan: true } });
        assert.equal(db.serialize(stored).data.daysOfWeek.Monday.portions.breakfast.servings, servings);
      }
      throw rollback;
    }, { timeout: 20000 });
  } catch (e) { if (e !== rollback) throw e; }
  console.log('Verified one/six servings, daily/weekly nutrition, cost scaling, plan round-trips, legacy updates and price-date preservation. All fixtures rolled back.');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
