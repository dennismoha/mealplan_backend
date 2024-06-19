// validators/mealmealTypeValidator.js

exports.createMealInsertionValidator = (req, res, next) => {
  // Express Validator checks for missing data
  req.check('mealsId', 'Meals ID is required').notEmpty().trim();
  req.check('mealTypeId', 'Meal Type ID is required').notEmpty().trim();

  const errors = req.validationErrors();

  if (errors) {
    console.error('createMealInsertion errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

exports.updateSingleItemValidator = (req, res, next) => {
  // Express Validator checks for missing data
  req.check('mealsId', 'Meals ID is required').notEmpty().trim();

  const errors = req.validationErrors();

  if (errors) {
    console.error('updateSingleItem errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};
