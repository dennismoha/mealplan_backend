const crypto = require('crypto');
require('dotenv').config();

const derive = purpose => crypto.createHmac('sha256', process.env.COOKIE_PASSWORD).update(`mealplan:${purpose}`).digest('hex');

module.exports = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || derive('access-token'),
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || derive('refresh-token'),
};
