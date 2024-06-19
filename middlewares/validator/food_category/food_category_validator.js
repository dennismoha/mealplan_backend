// Validation middleware for create and update operations
exports.validateFoodCategory = (req, res, next) => {
  // Express Validator checks for missing data
  req.check('categoryName', 'Category name cannot be empty').notEmpty().trim();
  req.check('description', 'description name cannot be empty').notEmpty().trim();

  const errors = req.validationErrors();

  if (errors) {
    console.error('Category name errors', errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};
