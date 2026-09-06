const prisma = require('../../models/prisma');
const BadRequestError = require('../../middlewares/custom_errors/bad_request');
const ConflictError = require('../../middlewares/custom_errors/conflict_error');
const { getSuccessMessage } = require('../../middlewares/custom_success/sucess_message');

const GOALS = new Set(['weight_loss', 'weight_gain', 'balanced', 'performance', 'medical']);
const BUDGET_LEVELS = new Set(['budget', 'standard', 'premium']);

function mealPlanTimeData(body, partial = false) {
  const data = {};
  const name = body.mealPlanName?.trim();
  if (!partial || body.mealPlanName !== undefined) {
    if (!name || name.length < 3) throw new BadRequestError('Meal plan name must contain at least 3 characters');
    data.meal_plan_name = name;
  }
  if (!partial || body.planGoal !== undefined) {
    const goal = body.planGoal || 'balanced';
    if (!GOALS.has(goal)) throw new BadRequestError('Invalid meal plan goal');
    data.plan_goal = goal;
  }
  if (!partial || body.budgetLevel !== undefined) {
    const budget = body.budgetLevel || 'standard';
    if (!BUDGET_LEVELS.has(budget)) throw new BadRequestError('Invalid budget level');
    data.budget_level = budget;
  }
  if (!partial || body.description !== undefined) data.description = body.description?.trim() || null;
  if (!partial || body.estimatedCost !== undefined) {
    const cost = body.estimatedCost === '' || body.estimatedCost == null ? null : Number(body.estimatedCost);
    if (cost !== null && (!Number.isFinite(cost) || cost < 0)) throw new BadRequestError('Estimated cost must be a non-negative number');
    data.estimated_cost = cost;
  }
  if (!partial || body.currency !== undefined) {
    const currency = (body.currency || 'KES').trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) throw new BadRequestError('Currency must be a three-letter code');
    data.currency = currency;
  }
  if (!partial || body.imageUrl !== undefined) data.image_url = body.imageUrl?.trim() || null;
  return data;
}

exports.getAllMealplanTimes = async (req, res) => res.status(200).send(
  getSuccessMessage(200, await prisma.mealplantime.findMany({ orderBy: { idmealPlanWeek: 'asc' } }), 'Successfully retrieved')
);

exports.getMealplanTime = async (req, res) => {
  const row = await prisma.mealplantime.findUnique({ where: { idmealPlanWeek: Number(req.params.id) } });
  return row ? res.json(row) : res.status(404).json({ message: 'Meal plan time resource does not exist' });
};

exports.createMealplanTime = async (req, res) => {
  const data = mealPlanTimeData(req.body);
  if (await prisma.mealplantime.findUnique({ where: { meal_plan_name: data.meal_plan_name } })) throw new ConflictError('Meal plan with the same name already exists');
  const created = await prisma.mealplantime.create({ data: { ...data, owner_user_id: req.userId } });
  return res.status(201).send(getSuccessMessage(201, created, 'Successfully created a meal plan'));
};

exports.updateMealplanTime = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new BadRequestError('Invalid meal plan id');
  const data = mealPlanTimeData(req.body, true);
  if (data.meal_plan_name && await prisma.mealplantime.findFirst({ where: { meal_plan_name: data.meal_plan_name, idmealPlanWeek: { not: id } } })) throw new ConflictError('Meal plan with the same name already exists');
  const updated = await prisma.mealplantime.update({ data, where: { idmealPlanWeek: id } });
  return res.status(200).send(getSuccessMessage(200, updated, 'Successfully updated'));
};

exports.deleteMealplanTime = async (req, res) => {
  await prisma.mealplantime.delete({ where: { idmealPlanWeek: Number(req.params.id) } });
  return res.status(200).send(getSuccessMessage(200, null, 'Deleted successfully'));
};
