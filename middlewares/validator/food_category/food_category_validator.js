exports.validateFoodCategory = (req, res, next) => {
  if (typeof req.body.categoryName !== 'string' || !req.body.categoryName.trim() || req.body.categoryName.trim().length > 45) return res.status(400).json({ message: 'Category name must contain 1–45 characters' });
  req.body.categoryName = req.body.categoryName.trim();
  if (req.body.description !== undefined && typeof req.body.description !== 'string') return res.status(400).json({ message: 'Description must be text' });
  next();
};
