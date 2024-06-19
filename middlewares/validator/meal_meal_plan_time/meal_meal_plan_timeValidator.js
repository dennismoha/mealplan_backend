// mealplantimeValidation.js

// Validation middleware for create and update operations
exports.validateMealplanTime = (req, res, next) => {
  // Express Validator checks for missing data
  req.check('mealPlanName', 'Meal plan name cannot be empty').notEmpty().trim();

  const errors = req.validationErrors();

  if (errors) {
    console.error('validateMealplanTime', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};
