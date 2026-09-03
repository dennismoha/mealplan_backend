const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../models/prisma');
const { accessTokenSecret, refreshTokenSecret } = require('../../config/token_secrets');

const publicUser = user => ({ id: user.idusers, email: user.email, role: user.role, status: user.userscol || 'active', createdAt: user.created_at });
const makeAccessToken = user => jwt.sign({ userId: user.idusers, email: user.email, role: user.role }, accessTokenSecret, { expiresIn: '1h' });
const makeRefreshToken = user => jwt.sign({ userId: user.idusers, email: user.email, role: user.role }, refreshTokenSecret, { expiresIn: '7d' });
const setRefreshCookie = (res, token) => res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

exports.createUser = async (req, res) => {
  const email = req.body.userEmail.toLowerCase();
  if (await prisma.users.findUnique({ where: { email } })) return res.status(409).json({ message: 'An account with this email already exists' });
  const user = await prisma.users.create({ data: { email, password: await bcrypt.hash(req.body.password, 10), role: 'user', userscol: 'active' } });
  const token = makeAccessToken(user); const refresh = makeRefreshToken(user); await prisma.users.update({ data: { refresh_token: refresh }, where: { idusers: user.idusers } }); setRefreshCookie(res, refresh);
  return res.status(201).json({ token, user: publicUser(user) });
};
exports.userLogin = async (req, res) => {
  const user = await prisma.users.findUnique({ where: { email: req.body.userEmail.toLowerCase() } });
  console.log('user is ', user);
  const k = await bcrypt.compare(req.body.password, user?.password);

  console.log('k is ', k);
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: 'Email or password is incorrect' });
  if (user.userscol === 'revoked') return res.status(403).json({ message: 'This account has been revoked' });
  const token = makeAccessToken(user); const refresh = makeRefreshToken(user); await prisma.users.update({ data: { refresh_token: refresh }, where: { idusers: user.idusers } }); setRefreshCookie(res, refresh);
  return res.json({ token, user: publicUser(user) });
};
exports.getCurrentUser = async (req, res) => { const user = await prisma.users.findUnique({ where: { idusers: Number(req.userId) } }); return user ? res.json({ user: publicUser(user) }) : res.sendStatus(404); };
exports.listUsers = async (req, res) => res.json({ users: (await prisma.users.findMany({ orderBy: { created_at: 'desc' } })).map(publicUser) });
exports.adminCreateUser = async (req, res) => {
  const { email, password, role = 'user' } = req.body;
  if (!email || !password || !['user', 'professional', 'admin'].includes(role)) return res.status(400).json({ message: 'Email, password and a valid role are required' });
  await prisma.roles.upsert({ where: { role_type: role }, update: {}, create: { role_type: role } });
  if (await prisma.users.findUnique({ where: { email: email.toLowerCase() } })) return res.status(409).json({ message: 'User already exists' });
  const user = await prisma.users.create({ data: { email: email.toLowerCase(), password: await bcrypt.hash(password, 10), role, userscol: 'active' } });
  return res.status(201).json({ user: publicUser(user) });
};
exports.updateUserAccess = async (req, res) => {
  const id = Number(req.params.id); const user = await prisma.users.findUnique({ where: { idusers: id } }); if (!user) return res.sendStatus(404);
  const { role, status } = req.body;
  if (role && !['user', 'professional', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  if (status && !['active', 'revoked'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  if (role) await prisma.roles.upsert({ where: { role_type: role }, update: {}, create: { role_type: role } });
  const updated = await prisma.users.update({ where: { idusers: id }, data: { ...(role && { role }), ...(status && { userscol: status }), ...(status === 'revoked' && { refresh_token: null }) } });
  return res.json({ user: publicUser(updated) });
};
exports.handleLogout = async (req, res) => { const token = req.cookies?.jwt; if (token) await prisma.users.updateMany({ data: { refresh_token: null }, where: { refresh_token: token } }); res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax' }); return res.sendStatus(204); };
exports.sendMail = (req, res) => res.status(501).json({ message: 'Email test endpoint is disabled' });
exports.sendEmailVerification = (req, res) => res.status(501).json({ message: 'Password email flow is pending migration' });
exports.ResetPassword = async (req, res) => { const user = await prisma.users.findFirst({ where: { reset_token: req.params.token, reset_token_expiration: { gt: String(Date.now()) } } }); return user ? res.json({ message: 'success', user: user.idusers, token: req.params.token }) : res.status(400).json({ message: 'Token is invalid or expired' }); };
exports.updatePassword = async (req, res) => { const id = Number(req.body.userId); const user = await prisma.users.findFirst({ where: { idusers: id, reset_token: req.body.token } }); if (!user) return res.status(400).json({ message: 'Token is invalid' }); await prisma.users.update({ where: { idusers: id }, data: { password: await bcrypt.hash(req.body.password, 10), reset_token: null, reset_token_expiration: null } }); return res.json({ message: 'Password updated successfully' }); };
