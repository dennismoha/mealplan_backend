exports.checkRole = (req, res, next) => {
  console.log('req session role is ', req.session.user_role);
  if (req.roles !== 'admin') {
    return res.status(403).json({ message: 'forbidden!!' });
  }
  return next();
};
