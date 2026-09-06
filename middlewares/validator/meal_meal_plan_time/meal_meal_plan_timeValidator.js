// mealplantimeValidation.js

const BadRequestError = require("#mealplan/middlewares/custom_errors/bad_request.js");

// Validation middleware for create and update operations
exports.validateMealplanTime = (req, res, next) => {
  // Express Validator checks for missing data
  req.check('mealPlanName', 'Meal plan name cannot be empty').notEmpty().trim();

  const errors = req.validationErrors();


  if (errors) {   
    const firstError = errors.map((error) => error.msg)[0];
    throw new BadRequestError(firstError) 
  }

  next();
};
