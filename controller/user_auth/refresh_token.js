/* eslint-disable max-statements */
/*
    THIS IS FILE CONSISTS OF THE USER REFRESH TOKEN LOGIC
*/

const db = require('../../config/db');
const JWT = require('jsonwebtoken');

// @RULE: REFRESH TOKEN
exports.handleRefreshToken = async (req, res) => {
  try {
    console.log('reached here to the refresh token handler');
    const cookies = req.cookies;
    console.log('cookies are ', cookies);
    const sql = 'select Email,role, refresh_token from users where refresh_token  = ? ';
    console.log('sql is ', sql);
    if (!cookies?.jwt) {
      return res.sendStatus(401);
    }
    console.log('cookie is ', cookies);
    console.log('jwt cookies are', cookies.jwt);
    const refreshToken = cookies.jwt;
    let checkUserRefreshToken = await db.execute(sql, [refreshToken]);
    console.log('check user refresh token ', checkUserRefreshToken);
    checkUserRefreshToken = checkUserRefreshToken[0][0];
    const userID = checkUserRefreshToken.Email;
    ///const role = checkUserRefreshToken.role;
    if (!checkUserRefreshToken) {
      return res.sendStatus(403);
    }
    console.log('refeshtoken is ', refreshToken);
    console.log('user Id is ', userID);
    const decodedToken = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log('decodeeeeeeed token ', decodedToken);
    if (!decodedToken) {
      return res.status(403).json({ message: 'Not Authenticated' });
    }
    req.userId = decodedToken.userId;
    if (userID !== decodedToken.userId) {
      return res.sendStatus(403);
    }
    let roles = decodedToken.roles;
    // if (userID === 'me@mail.com') {
    //   roles = [2001, 2002];
    // } else {
    //   roles = [2003];
    // }
    const token = JWT.sign({ userID, roles }, `${process.env.ACCESS_TOKEN_SECRET}`, {
      expiresIn: '30000s',
    });
    return res.json({ userEmail: userID, token, roles });
  } catch (error) {
    console.log(' handle refresh token error is ', error);
    return res.status(400).json({ message: 'error handle refresh' });
  }
};
