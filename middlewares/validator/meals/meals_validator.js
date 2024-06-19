exports.validateAddMeal = (req, res, next) => {
  req.check('mealName', 'meal name is required').notEmpty().trim().escape();
  const errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.validateUpdateMeal = (req, res, next) => {
  req.check('mealName', 'meal name is required').notEmpty().trim().escape();
  // req.check('mealTypeID', 'Invalid meal type id');
  const errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
