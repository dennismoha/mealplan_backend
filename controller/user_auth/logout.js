/*
    THIS IS FILE CONSISTS OF THE USER REFRESH TOKEN LOGIC
*/

const db = require('../../config/db');

// @RULE: handle logout
exports.handleLogout = async (req, res) => {
  const cookies = req.cookies;
  const sql = 'select Email, refresh_token from householditems.users_auth where refresh_token  = ? ';
  const sql2 = "UPDATE `householditems`.`users_auth` SET `refresh_token` = '' WHERE (`Email` = ?);";
  if (!cookies?.jwt) {
    return res.status(204);
  } // request was well handled but no return message
  console.log('cookie is ', cookies);
  console.log('jwt cookies are', cookies.jwt);
  const refreshToken = cookies.jwt;

  try {
    // check if the refresh token is on db
    let checkUserRefreshToken = await db.execute(sql, [refreshToken]);
    checkUserRefreshToken = checkUserRefreshToken[0][0];
    const userID = checkUserRefreshToken.Email;
    if (!checkUserRefreshToken) {
      res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.sendStatus(204);
    }

    // delete the token in the database
    await db.execute(sql2, [userID]);
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.sendStatus(204);
  } catch (error) {
    console.log(' logout errors ', error);
    res.status(400).json({ message: 'error logging out' });
  }
};
