const requireRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.roles || !allowedRoles.includes(req.roles)) {
    return res.status(403).json({ message: 'You do not have permission to perform this action' });
  }
  return next();
};

const checkRole = requireRoles('admin');
module.exports = { checkRole, requireRoles };
