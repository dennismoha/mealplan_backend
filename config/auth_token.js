/*
    THIS IS CONSISTS OF  JWT AUTHENTICATION TOKEN
*/
const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma');
const { accessTokenSecret } = require('./token_secrets');

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Not Authenticated' });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, accessTokenSecret);
  } catch (err) {
    err.status = 403;
    return res.status(403).json({ error: err.message });
  }
  if (!decodedToken) {
    return res.status(401).json({ message: 'Not Authenticated' });
  }
  req.userId = decodedToken.userId;
  req.userEmail = decodedToken.email || decodedToken.userId;
  req.roles = decodedToken.role || decodedToken.roles;
  const user = await prisma.users.findUnique({ where: { idusers: Number(req.userId) }, select: { idusers: true, role: true, userscol: true } });
  if (!user || user.userscol === 'revoked') return res.status(403).json({ message: 'This account is revoked' });
  req.roles = user.role;
  console.log('decoded token is ', req.userId);
  next();
};
