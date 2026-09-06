const prisma = require('../../models/prisma');
const { calculateMeals } = require('../../globals/helpers/meal_totals');
async function dataset() { return Promise.all([prisma.mealtype.findMany({ include: { combination_items: true, meal_type_food_items: true } }), prisma.fooditems.findMany(), prisma.food_nutrition.findMany(), prisma.recipe.findMany(), prisma.recipe_food_items.findMany()]); }
exports.dish = async (req, res) => {
  const data = await dataset();
  if (!data[0].some(d => d.mealTypesID === req.params.id)) return res.status(404).json({ message: 'Dish not found' });
  res.json(calculateMeals([{ id: req.params.id, servings: 1 }], ...data));
};
exports.plan = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ message: 'Invalid plan ID' });
  const plan = await prisma.mealplantime.findUnique({ where: { idmealPlanWeek: id }, include: { mealplan: true } });
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  const data = await dataset(); const all = []; const days = {};
  for (const day of plan.mealplan) {
    const selections = ['breakfast','morning_break','lunch','evening_break','supper'].map(slot => ({ id: day[`${slot}_id`] || day[slot === 'lunch' ? 'Lunch' : slot], servings: day.portions?.[slot]?.servings ?? 1, components: day.portions?.[slot]?.components }));
    all.push(...selections); days[day.day_of_week] = calculateMeals(selections, ...data);
  }
  res.json({ days, total: calculateMeals(all, ...data), basis: 'Uses the servings saved for each scheduled meal (one for older plans). Component portions multiply the scheduled servings. Prices are recorded food-item estimates; check their dates and locations.' });
};
