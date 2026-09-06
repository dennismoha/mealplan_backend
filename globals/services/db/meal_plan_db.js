const prisma = require('../../../models/prisma');
const BadRequest = require('../../../middlewares/custom_errors/bad_request');
const ConflictError = require('../../../middlewares/custom_errors/conflict_error');
const slots = { breakfast: 'breakfast', morning_break: 'morning_break', lunch: 'Lunch', evening_break: 'evening_break', supper: 'supper' };
async function planData(data) {
  if (!['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].includes(data.day_of_week)) throw new BadRequest('Choose a valid day');
  const result = { day_of_week: data.day_of_week, mealplan_key: data.mealplan_key };
  if (data.portions !== undefined && (!data.portions || typeof data.portions !== "object" || Array.isArray(data.portions) || Object.keys(data.portions).some(key => !Object.hasOwn(slots, key)))) throw new BadRequest("Invalid plan portions");
  if (data.portions !== undefined) result.portions = {};
  for (const [slot, old] of Object.entries(slots)) {
    const value = data[old];
    if (value == null || value === '') { result[`${slot}_id`] = null; result[old] = null; continue; }
    if (typeof value !== 'string') throw new BadRequest('Invalid meal');
    const dish = await prisma.mealtype.findFirst({ where: { OR: [{ mealTypesID: value }, { meal_name: value }] }, include: { combination_items: true } });
    if (!dish) throw new BadRequest(`Meal not found for ${slot}; choose a catalogue meal`);
    if (result.portions) {
      const portion = data.portions[slot] ?? { servings: 1 };
      if (!portion || typeof portion !== 'object' || Array.isArray(portion) || typeof portion.servings !== 'number' || !Number.isFinite(portion.servings) || portion.servings < 0.01 || portion.servings > 1000) throw new BadRequest('Servings must be between 0.01 and 1000');
      if (portion.instructions != null && (typeof portion.instructions !== 'string' || portion.instructions.length > 500)) throw new BadRequest('Portion instructions must be at most 500 characters');
      const components = portion.components ?? {};
      if (!components || typeof components !== 'object' || Array.isArray(components)) throw new BadRequest('Invalid component portions');
      for (const [id, count] of Object.entries(components)) {
        if (!(dish.combination_items || []).some(item => item.dish_id === id) || typeof count !== 'number' || !Number.isFinite(count) || count < 0.01 || count > 1000) throw new BadRequest('Choose valid component servings between 0.01 and 1000');
      }
      result.portions[slot] = { servings: portion.servings, instructions: portion.instructions?.trim() || '', components };
    }
    result[`${slot}_id`] = dish.mealTypesID;
    result[old] = dish.meal_name; // Compatibility snapshot; IDs are authoritative.
  }
  return result;
}
class MealPlanDB {
  async addMealPlanToDB(data) {
    const values = await planData(data);
    if (await prisma.mealplan.findFirst({ where: { day_of_week: values.day_of_week, mealplan_key: values.mealplan_key } })) throw new ConflictError('That day already exists');
    return prisma.mealplan.create({ data: values });
  }
  async fetchMealPlansFromDb() { return (await prisma.mealplantime.findMany({ include: { mealplan: true }, orderBy: { idmealPlanWeek: 'asc' } })).map(row => this.serialize(row)); }
  async fetchMealPlansForOwner(ownerUserId) { return (await prisma.mealplantime.findMany({ where: { owner_user_id: ownerUserId }, include: { mealplan: true }, orderBy: { idmealPlanWeek: 'desc' } })).map(row => this.serialize(row)); }
  serialize(row) { return { mealplankey: row.meal_plan_name, idmealPlanWeek: row.idmealPlanWeek, ownerUserId: row.owner_user_id, planGoal: row.plan_goal, description: row.description, budgetLevel: row.budget_level, estimatedCost: row.estimated_cost, currency: row.currency, imageUrl: row.image_url, data: { daysOfWeek: Object.fromEntries(row.mealplan.map(day => [day.day_of_week, { ...Object.fromEntries(Object.entries(slots).map(([slot, old]) => [slot, day[`${slot}_id`] || day[old] || ''])), portions: day.portions || {} }])) } }; }
  async fetchSingleMealPlanFromDb(id) { return prisma.mealplan.findFirst({ where: { idMealPlan: id } }); }
  async updateMealPlanInDB(data) {
    const values = await planData(data);
    const where = { day_of_week: data.day_of_week, mealplan_key: data.mealplan_key };
    // Older clients omit portions. Keep them only when the selected dish is unchanged.
    if (data.portions === undefined) {
      const existing = await prisma.mealplan.findFirst({ where });
      values.portions = Object.fromEntries(Object.keys(slots)
        .filter(slot => values[`${slot}_id`] && values[`${slot}_id`] === existing?.[`${slot}_id`] && existing?.portions?.[slot])
        .map(slot => [slot, existing.portions[slot]]));
    }
    return prisma.mealplan.updateMany({ data: values, where });
  }
  async deleteMealPlanInDb(mealplankey, day) { return prisma.mealplan.deleteMany({ where: { mealplan_key: mealplankey, day_of_week: day } }); }
}
module.exports = MealPlanDB;
