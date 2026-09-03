const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, Role } = require('../../models/orm');
const { accessTokenSecret, refreshTokenSecret } = require('../../config/token_secrets');

const publicUser = user => ({ id: user.idusers, email: user.email, role: user.role, status: user.status || 'active', createdAt: user.created_at });
const makeAccessToken = user => jwt.sign({ userId: user.idusers, email: user.email, role: user.role }, accessTokenSecret, { expiresIn: '1h' });
const makeRefreshToken = user => jwt.sign({ userId: user.idusers, email: user.email, role: user.role }, refreshTokenSecret, { expiresIn: '7d' });
const setRefreshCookie = (res, token) => res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

exports.createUser = async (req, res) => {
  const email = req.body.userEmail.toLowerCase();
  if (await User.findOne({ where: { email } })) return res.status(409).json({ message: 'An account with this email already exists' });
  const user = await User.create({ email, password: await bcrypt.hash(req.body.password, 10), role: 'user', status: 'active' });
  const token = makeAccessToken(user); const refresh = makeRefreshToken(user); await user.update({ refresh_token: refresh }); setRefreshCookie(res, refresh);
  return res.status(201).json({ token, user: publicUser(user) });
};
exports.userLogin = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.userEmail.toLowerCase() } });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: 'Email or password is incorrect' });
  if (user.status === 'revoked') return res.status(403).json({ message: 'This account has been revoked' });
  const token = makeAccessToken(user); const refresh = makeRefreshToken(user); await user.update({ refresh_token: refresh }); setRefreshCookie(res, refresh);
  return res.json({ token, user: publicUser(user) });
};
exports.getCurrentUser = async (req, res) => { const user = await User.findByPk(req.userId); return user ? res.json({ user: publicUser(user) }) : res.sendStatus(404); };
exports.listUsers = async (req, res) => res.json({ users: (await User.findAll({ order: [['created_at', 'DESC']] })).map(publicUser) });
exports.adminCreateUser = async (req, res) => {
  const { email, password, role = 'user' } = req.body;
  if (!email || !password || !['user', 'professional', 'admin'].includes(role)) return res.status(400).json({ message: 'Email, password and a valid role are required' });
  await Role.findOrCreate({ where: { role_type: role } });
  if (await User.findOne({ where: { email: email.toLowerCase() } })) return res.status(409).json({ message: 'User already exists' });
  const user = await User.create({ email: email.toLowerCase(), password: await bcrypt.hash(password, 10), role, status: 'active' });
  return res.status(201).json({ user: publicUser(user) });
};
exports.updateUserAccess = async (req, res) => {
  const user = await User.findByPk(req.params.id); if (!user) return res.sendStatus(404);
  const { role, status } = req.body;
  if (role && !['user', 'professional', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  if (status && !['active', 'revoked'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  if (role) await Role.findOrCreate({ where: { role_type: role } });
  await user.update({ ...(role && { role }), ...(status && { status }), ...(status === 'revoked' && { refresh_token: null }) });
  return res.json({ user: publicUser(user) });
};
exports.handleLogout = async (req, res) => { const token = req.cookies?.jwt; if (token) await User.update({ refresh_token: null }, { where: { refresh_token: token } }); res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax' }); return res.sendStatus(204); };
exports.sendMail = (req, res) => res.status(501).json({ message: 'Email test endpoint is disabled' });
exports.sendEmailVerification = (req, res) => res.status(501).json({ message: 'Password email flow is pending migration' });
exports.ResetPassword = async (req, res) => { const user = await User.findOne({ where: { reset_token: req.params.token, reset_token_expiration: { [Op.gt]: String(Date.now()) } } }); return user ? res.json({ message: 'success', user: user.idusers, token: req.params.token }) : res.status(400).json({ message: 'Token is invalid or expired' }); };
exports.updatePassword = async (req, res) => { const user = await User.findOne({ where: { idusers: req.body.userId, reset_token: req.body.token } }); if (!user) return res.status(400).json({ message: 'Token is invalid' }); await user.update({ password: await bcrypt.hash(req.body.password, 10), reset_token: null, reset_token_expiration: null }); return res.json({ message: 'Password updated successfully' }); };
