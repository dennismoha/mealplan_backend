exports.createFoodVariationValidator = (req, res, next) => {
  // Express Validator checks for missing data
  req.check('variation_name', 'Variation name is required').notEmpty().trim();
  req.check('foodItemsID', 'Food Items ID is required').notEmpty().trim();
  req.check('foodVariationsID', 'Food Variations ID is required').notEmpty().trim();

  const errors = req.validationErrors();

  if (errors) {
    console.error('createFoodVariationValidator errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

// update food variations

exports.updateFoodVariationValidator = (req, res, next) => {
  // Express Validator checks for missing data
  req.check('variation_name', 'Variation name is required').notEmpty().trim();
  req.check('foodItemsID', 'Food Items ID is required').notEmpty().trim();
  req.check('foodVariationsID', 'Food Variations ID is required').notEmpty().trim();

  const errors = req.validationErrors();

  if (errors) {
    console.error('updateFoodVariationValidator errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

// get food variation by id

exports.getFoodVariationByIdValidator = (req, res, next) => {
  // Express Validator checks for invalid ID format
  req.check('id', 'Invalid ID format').isInt();

  const errors = req.validationErrors();

  if (errors) {
    console.error('getFoodVariationByIdValidator errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

// delete food variation by id
exports.deleteFoodVariationByIdValidator = (req, res, next) => {
  // Express Validator checks for invalid ID format
  req.check('id', 'Invalid ID format').isInt();

  const errors = req.validationErrors();

  if (errors) {
    console.error('deleteFoodVariationByIdValidator errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};
