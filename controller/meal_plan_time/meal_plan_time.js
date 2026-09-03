const { Op } = require('sequelize');
const { MealPlanTime } = require('../../models/orm');
const ConflictError = require('../../middlewares/custom_errors/conflict_error');
const { getSuccessMessage } = require('../../middlewares/custom_success/sucess_message');

exports.getAllMealplanTimes = async (req, res) => res.status(200).send(getSuccessMessage(200, await MealPlanTime.findAll({ order: [['idmealPlanWeek', 'ASC']], raw: true }), 'Successfully retrieved'));
exports.getMealplanTime = async (req, res) => { const row = await MealPlanTime.findByPk(req.params.id, { raw: true }); return row ? res.json(row) : res.status(404).json({ message: 'Meal plan time resource does not exist' }); };
exports.createMealplanTime = async (req, res) => { const name = req.body.mealPlanName; if (await MealPlanTime.findOne({ where: { meal_plan_name: name } })) throw new ConflictError('Meal plan with the same name already exists'); await MealPlanTime.create({ meal_plan_name: name, owner_user_id: req.userId, plan_goal: req.body.planGoal || 'balanced', description: req.body.description || null }); res.status(201).send(getSuccessMessage(201, [], 'Successfully created a meal plan time interval')); };
exports.updateMealplanTime = async (req, res) => { const name = req.body.mealPlanName; if (await MealPlanTime.findOne({ where: { meal_plan_name: name, idmealPlanWeek: { [Op.ne]: req.params.id } } })) throw new ConflictError('Meal plan time with the same name already exists'); await MealPlanTime.update({ meal_plan_name: name }, { where: { idmealPlanWeek: req.params.id } }); res.status(200).send(getSuccessMessage(200, [], 'Successfully updated')); };
exports.deleteMealplanTime = async (req, res) => { await MealPlanTime.destroy({ where: { idmealPlanWeek: req.params.id } }); res.status(200).send(getSuccessMessage(200, [], 'Deleted successfully')); };
