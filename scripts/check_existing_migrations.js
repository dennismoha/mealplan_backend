require('dotenv').config();
const assert = require('node:assert/strict');
const prisma = require('../models/prisma');
(async () => {
  const constraints = await prisma.$queryRaw`SELECT CONSTRAINT_NAME, DELETE_RULE FROM information_schema.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE()`;
  for (const name of ['meal_food_items_to_fooditems_restrict', 'meal_type_food_items_to_fooditems_restrict', 'meal_combination_items_dish_id_fkey', 'food_item_local_names_country_id_fkey', ...['breakfast', 'morning_break', 'lunch', 'evening_break', 'supper'].map(s => `plan_${s}_dish`)]) assert.ok(constraints.some(c => c.CONSTRAINT_NAME === name && ['RESTRICT', 'NO ACTION'].includes(c.DELETE_RULE)), `Missing restrictive constraint ${name}`);
  for (const name of ['meal_combination_items_combination_id_fkey', 'food_item_local_names_food_item_id_fkey']) assert.ok(constraints.some(c => c.CONSTRAINT_NAME === name && c.DELETE_RULE === 'CASCADE'), `Missing cascade ${name}`);
  const indexes = await prisma.$queryRaw`SELECT DISTINCT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND NON_UNIQUE = 0`;
  for (const name of ['EnglishName_UNIQUE','unique_food_local_name','recipe_meal_type_unique','meal_combination_items_combination_id_dish_id_key']) assert.ok(indexes.some(i => i.INDEX_NAME === name), `Missing index ${name}`);
  const triggers = await prisma.$queryRaw`SELECT ACTION_STATEMENT FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = DATABASE() AND TRIGGER_NAME = 'mealtype_BEFORE_INSERT'`;
  assert.match(triggers[0]?.ACTION_STATEMENT || '', /COALESCE\s*\(NULLIF/i);
  const missing = await prisma.$queryRaw`SELECT COUNT(*) AS total FROM mealplan WHERE (NULLIF(TRIM(breakfast), '') IS NOT NULL AND breakfast_id IS NULL) OR (NULLIF(TRIM(morning_break), '') IS NOT NULL AND morning_break_id IS NULL) OR (NULLIF(TRIM(Lunch), '') IS NOT NULL AND lunch_id IS NULL) OR (NULLIF(TRIM(evening_break), '') IS NOT NULL AND evening_break_id IS NULL) OR (NULLIF(TRIM(supper), '') IS NOT NULL AND supper_id IS NULL)`;
  assert.equal(Number(missing[0].total), 0);
  const aliases = await prisma.$queryRaw`SELECT COUNT(*) AS total FROM meals m LEFT JOIN legacy_meal_alias a ON a.legacy_id = m.mealID WHERE a.legacy_id IS NULL`;
  assert.equal(Number(aliases[0].total), 0);
  console.log('Existing migration indexes, restrictive/cascade relations, ID-preserving trigger, canonical plan links and legacy aliases verified.');
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
