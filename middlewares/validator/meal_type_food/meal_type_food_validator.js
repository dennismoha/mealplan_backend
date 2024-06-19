exports.createMealTypeFoodValidator = (req, res, next) => {
  // Express Validator checks for missing data
  req.check('meal_type_foodsID', 'Meal Type Foods ID is required').notEmpty().trim();
  req.check('meal_type_ID', 'Meal Type ID is required').notEmpty().trim();
  req.check('food_variations_ID', 'Food Variations ID is required').notEmpty().trim();

  const errors = req.validationErrors();

  if (errors) {
    console.error('createMealTypeFood errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

exports.updateMealTypeFoodValidator = (req, res, next) => {
  // Express Validator checks for missing data
  req.check('meal_type_ID', 'Meal Type ID is required').optional().notEmpty().trim();
  req.check('food_variations_ID', 'Food Variations ID is required').optional().notEmpty().trim();

  const errors = req.validationErrors();

  if (errors) {
    console.error('updateMealTypeFood errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

exports.getMealTypeFoodByIdValidator = (req, res, next) => {
  // Express Validator checks for invalid ID format
  req.check('id', 'Invalid ID format').isInt();

  const errors = req.validationErrors();

  if (errors) {
    console.error('getMealTypeFoodById errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

exports.deleteMealTypeFoodByIdValidator = (req, res, next) => {
  // Express Validator checks for invalid ID format
  req.check('id', 'Invalid ID format').isInt();

  const errors = req.validationErrors();

  if (errors) {
    console.error('deleteMealTypeFoodById errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};
