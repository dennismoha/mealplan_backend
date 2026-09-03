const { MealPlanTime } = require('../../models/orm');

const requireMealPlanOwnership = source => async (req, res, next) => {
  if (req.roles === 'admin') return next();
  if (req.roles !== 'professional') return res.status(403).json({ message: 'Only professionals and administrators can manage meal plans' });

  const where = source === 'interval-id'
    ? { idmealPlanWeek: req.params.id }
    : { meal_plan_name: req.body.mealplan_key || req.params.mealplankey };
  const interval = await MealPlanTime.findOne({ where, attributes: ['idmealPlanWeek', 'owner_user_id'], raw: true });
  if (!interval) return res.status(404).json({ message: 'Meal plan not found' });
  if (interval.owner_user_id !== req.userId) return res.status(403).json({ message: 'You can only change meal plans that you created' });
  req.mealPlanInterval = interval;
  return next();
};

module.exports = { requireMealPlanOwnership };
