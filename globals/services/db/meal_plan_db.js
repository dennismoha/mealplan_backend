const prisma = require('../../../models/prisma');
const ConflictError = require('../../../middlewares/custom_errors/conflict_error');

class MealPlanDB {
  async addMealPlanToDB(data) {
    const where = { day_of_week: data.day_of_week, mealplan_key: data.mealplan_key };
    if (await prisma.mealplan.count({ where: { mealplan_key: data.mealplan_key } }) >= 7) throw new ConflictError('Meal plan has all seven days');
    if (await prisma.mealplan.findFirst({ where })) throw new ConflictError('That day exists in the current meal plan');
    return prisma.mealplan.create({ data });
  }
  async fetchMealPlansFromDb() {
    const intervals = await prisma.mealplantime.findMany({ where: { mealplan: { some: {} } }, include: { mealplan: true }, orderBy: { idmealPlanWeek: 'asc' } });
    return intervals.map(interval => this.serialize(interval));
  }
  async fetchMealPlansForOwner(ownerUserId) {
    const intervals = await prisma.mealplantime.findMany({ where: { owner_user_id: ownerUserId }, include: { mealplan: true }, orderBy: { idmealPlanWeek: 'desc' } });
    return intervals.map(interval => this.serialize(interval));
  }
  serialize(interval) { return { mealplankey: interval.meal_plan_name, idmealPlanWeek: interval.idmealPlanWeek, ownerUserId: interval.owner_user_id, planGoal: interval.plan_goal, description: interval.description, budgetLevel: interval.budget_level, estimatedCost: interval.estimated_cost, currency: interval.currency, imageUrl: interval.image_url, data: { daysOfWeek: Object.fromEntries(interval.mealplan.map(day => [day.day_of_week, { breakfast: day.breakfast, morning_break: day.morning_break, lunch: day.Lunch, evening_break: day.evening_break, supper: day.supper }])) } }; }
  async fetchSingleMealPlanFromDb(id) { return prisma.mealplan.findFirst({ where: { idMealPlan: id } }); }
  async updateMealPlanInDB(data) { return prisma.mealplan.updateMany({ data, where: { day_of_week: data.day_of_week, mealplan_key: data.mealplan_key } }); }
  async deleteMealPlanInDb(mealplankey, day) { return prisma.mealplan.deleteMany({ where: { mealplan_key: mealplankey, day_of_week: day } }); }
}
module.exports = MealPlanDB;
