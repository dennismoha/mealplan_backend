const prisma = require('../../models/prisma');
exports.handleLogout = async (req, res) => { const token = req.cookies?.jwt; if (token) await prisma.users.updateMany({ data: { refresh_token: null }, where: { refresh_token: token } }); res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax' }); return res.sendStatus(204); };
