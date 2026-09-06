const BadRequestError = require("#mealplan/middlewares/custom_errors/bad_request.js");

// Validation middleware for create and update operations
exports.validateMealPlanFields = (req, res, next) => {
  // Express Validator checks for missing data
  req.check('day_of_week', 'Day of week cannot be empty').notEmpty().trim();
  req.check('breakfast', 'Breakfast cannot be empty').notEmpty().trim();
  req.check('morning_break', 'Morning break cannot be empty').notEmpty().trim();
  req.check('Lunch', 'Lunch cannot be empty').notEmpty().trim();
  req.check('evening_break', 'Evening break cannot be empty').notEmpty().trim();
  req.check('supper', 'Supper cannot be empty').notEmpty().trim();
  req.check('mealplan_key', 'Mealplan key cannot be empty').notEmpty().trim();

  const errors = req.validationErrors();

  if (errors) {   
    const firstError = errors.map((error) => error.msg)[0];
    throw new BadRequestError(firstError) 
  }

  next();
};
