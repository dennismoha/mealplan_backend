const { Op } = require('sequelize');
const { MealPlan, MealPlanTime } = require('../../../models/orm');
const ConflictError = require('../../../middlewares/custom_errors/conflict_error');

class MealPlanDB {
  async addMealPlanToDB(data) {
    const where = { day_of_week: data.day_of_week, mealplan_key: data.mealplan_key };
    if (await MealPlan.count({ where: { mealplan_key: data.mealplan_key } }) >= 7) throw new ConflictError('Meal plan has all seven days');
    if (await MealPlan.findOne({ where })) throw new ConflictError('That day exists in the current meal plan');
    return MealPlan.create(data);
  }
  async fetchMealPlansFromDb() {
    const intervals = await MealPlanTime.findAll({ include: [{ model: MealPlan, as: 'days', required: true }], order: [['idmealPlanWeek', 'ASC']] });
    return intervals.map(interval => ({ mealplankey: interval.meal_plan_name, idmealPlanWeek: interval.idmealPlanWeek, ownerUserId: interval.owner_user_id, planGoal: interval.plan_goal, description: interval.description, data: { daysOfWeek: Object.fromEntries(interval.days.map(day => [day.day_of_week, { breakfast: day.breakfast, morning_break: day.morning_break, lunch: day.Lunch, evening_break: day.evening_break, supper: day.supper }])) } }));
  }
  async fetchMealPlansForOwner(ownerUserId) {
    const intervals = await MealPlanTime.findAll({ where: { owner_user_id: ownerUserId }, include: [{ model: MealPlan, as: 'days', required: false }], order: [['idmealPlanWeek', 'DESC']] });
    return intervals.map(interval => ({ mealplankey: interval.meal_plan_name, idmealPlanWeek: interval.idmealPlanWeek, ownerUserId: interval.owner_user_id, planGoal: interval.plan_goal, description: interval.description, data: { daysOfWeek: Object.fromEntries(interval.days.map(day => [day.day_of_week, { breakfast: day.breakfast, morning_break: day.morning_break, lunch: day.Lunch, evening_break: day.evening_break, supper: day.supper }])) } }));
  }
  async fetchSingleMealPlanFromDb(id) { return MealPlan.findOne({ where: { idMealPlan: id }, raw: true }); }
  async updateMealPlanInDB(data) { return MealPlan.update(data, { where: { day_of_week: data.day_of_week, mealplan_key: data.mealplan_key } }); }
  async deleteMealPlanInDb(mealplankey, day) { return MealPlan.destroy({ where: { mealplan_key: mealplankey, day_of_week: { [Op.eq]: day } } }); }
}
module.exports = MealPlanDB;
