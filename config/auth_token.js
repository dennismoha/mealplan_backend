/*
    THIS IS CONSISTS OF  JWT AUTHENTICATION TOKEN
*/
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Not Authenticated' });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    err.status = 403;
    return res.status(403).json({ error: err.message });
  }
  if (!decodedToken) {
    return res.status(401).json({ message: 'Not Authenticated' });
  }
  req.userId = decodedToken.userId;
  req.roles = decodedToken.roles;
  console.log('decoded token is ', req.userId);
  next();
};
