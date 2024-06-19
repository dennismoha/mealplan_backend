const { param } = require('express-validator/check');
// Validator for creating a new food item
exports.createFoodItemValidator = (req, res, next) => {
  req.check('food_name', 'Food name is required').notEmpty();
  req.check('category_id', 'Category ID is required').notEmpty();
  // Add more validation rules as needed
  const errors = req.validationErrors();

  if (errors) {
    console.error('updateFoodVariationValidator errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

// Validator for updating a food item
exports.updateFoodItemValidator = (req, res, next) => {
  req.check('food_name', 'Food name is required').optional().notEmpty();
  req.check('category_id', 'Category ID is required').optional().notEmpty();
  // Add more validation rules as needed
  const errors = req.validationErrors();

  if (errors) {
    console.error('updateFoodVariationValidator errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

// Validator for getting a specific food item by ID
exports.getFoodItemByIdValidator = (req, res, next) => {
  param('id', 'Invalid ID format').trim().isInt();
  const errors = req.validationErrors();

  if (errors) {
    console.error('updateFoodVariationValidator errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

// Validator for deleting a food item by ID
exports.deleteFoodItemByIdValidator = (req, res, next) => {
  param('id', 'Invalid ID format').isInt();
  const errors = req.validationErrors();

  if (errors) {
    console.error('updateFoodVariationValidator errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

// Validator for creating a new food option
exports.createFoodOptionValidator = (req, res, next) => {
  req.param('foodItemName', 'Food item name cannot be empty').notEmpty().trim();
  // Add more validation rules as needed
  const errors = req.validationErrors();

  if (errors) {
    console.error('updateFoodVariationValidator errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};
