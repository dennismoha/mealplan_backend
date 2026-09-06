const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
test('planner stores canonical IDs from UUID or legacy name and serializes IDs', async () => {
  let created;
  const prisma = { mealtype: { findFirst: async ({ where }) => where.OR.some(x => Object.values(x)[0] === 'dish-id' || Object.values(x)[0] === 'Ugali') ? { mealTypesID: 'dish-id', meal_name: 'Ugali' } : null }, mealplan: { findFirst: async () => null, create: async ({ data }) => { created = data; } } };
  const sandbox = { module: { exports: {} }, require: name => name.includes('models/prisma') ? prisma : Error };
  vm.runInNewContext(fs.readFileSync(require.resolve('../globals/services/db/meal_plan_db'), 'utf8'), sandbox);
  const db = new sandbox.module.exports();
  await db.addMealPlanToDB({ day_of_week: 'Monday', mealplan_key: 'Week', breakfast: 'Ugali', Lunch: 'dish-id' });
  assert.equal(created.breakfast_id, 'dish-id'); assert.equal(created.lunch_id, 'dish-id');
  assert.equal(created.breakfast, 'Ugali');
  const serialized = db.serialize({ mealplan: [{ ...created, breakfast: 'Old name' }] });
  assert.equal(serialized.data.daysOfWeek.Monday.breakfast, 'dish-id');
  await assert.rejects(db.addMealPlanToDB({ day_of_week: 'Monday', breakfast: 'Unknown' }), /Meal not found/);
});

test('plan portions round-trip and reject invalid counts and unrelated component overrides', async () => {
  let created;
  const prisma = { mealtype: { findFirst: async () => ({ mealTypesID: 'combo', meal_name: 'Breakfast', combination_items: [{ dish_id: 'eggs' }] }) }, mealplan: { findFirst: async () => null, create: async ({ data }) => { created = data; } } };
  const sandbox = { module: { exports: {} }, require: name => name.includes('models/prisma') ? prisma : Error };
  vm.runInNewContext(fs.readFileSync(require.resolve('../globals/services/db/meal_plan_db'), 'utf8'), sandbox);
  const db = new sandbox.module.exports();
  const input = { day_of_week: 'Monday', mealplan_key: 'Gain', breakfast: 'combo', portions: { breakfast: { servings: 1.5, instructions: 'Eggs and toast', components: { eggs: 6 } } } };
  await db.addMealPlanToDB(input);
  const day = db.serialize({ mealplan: [created] }).data.daysOfWeek.Monday;
  assert.equal(day.portions.breakfast.servings, 1.5);
  assert.equal(day.portions.breakfast.components.eggs, 6);
  assert.equal(day.portions.breakfast.instructions, 'Eggs and toast');
  for (const servings of [0, -1, Infinity, '6', true, 1001]) {
    await assert.rejects(db.addMealPlanToDB({ ...input, portions: { breakfast: { servings } } }), /Servings/);
  }
  await assert.rejects(db.addMealPlanToDB({ ...input, portions: { breakfast: { servings: 1, components: { unrelated: 6 } } } }), /component/);
  await assert.rejects(db.addMealPlanToDB({ ...input, portions: { breakfast: { servings: 1, instructions: 'x'.repeat(501) } } }), /instructions/);
});
