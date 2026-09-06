const jwt = require('jsonwebtoken');
const prisma = require('../../models/prisma');
const { accessTokenSecret, refreshTokenSecret } = require('../../config/token_secrets');

exports.handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) return res.sendStatus(401);
  const user = await prisma.users.findFirst({ where: { refresh_token: refreshToken } });
  if (!user || user.userscol === 'revoked') return res.sendStatus(403);
  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    if (decoded.userId !== user.idusers) return res.sendStatus(403);
    const token = jwt.sign({ userId: user.idusers, email: user.email, role: user.role }, accessTokenSecret, { expiresIn: '1h' });
    return res.json({ token, user: { id: user.idusers, email: user.email, role: user.role, status: user.userscol || 'active' } });
  } catch (error) { return res.status(403).json({ message: 'Refresh token is invalid or expired' }); }
};
