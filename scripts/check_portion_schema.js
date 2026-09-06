require('dotenv').config();
const prisma = require('../models/prisma');
(async () => {
  const columns = await prisma.$queryRaw`SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('fooditems', 'food_item_local_names', 'mealtype', 'mealplan', 'food_nutrition', 'meal_type_food_items', 'recipe_food_items', 'meal_combination_items', 'legacy_meal_alias')`;
  console.log(JSON.stringify(columns));
  const migrations = await prisma.$queryRaw`SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations ORDER BY started_at`;
  console.log(JSON.stringify(migrations));
})().catch(e => { console.error(e.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
