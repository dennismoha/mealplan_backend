/*
    THIS IS FILE CONSISTS OF USER SIGNUP AND LOGIN LOGIC.
*/
/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const db = require('../../config/db');
const AuthQuery = require('../query_utiltity/auth_utility');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

// @RULE: REGISTER USERS

exports.createUser = async (req, res, next) => {
  delete req.body.confirm_password;
  let role = 'user';
  const sql = {
    checkUser: 'SELECT email FROM meal_plan.users where email = ?',
    registerUser: 'INSERT INTO `meal_plan`.`users` (`email`, `password`, `role`) VALUES ( ?,?,?)',
    querBody: req.body,
    role: 'user',
  };
  const AuthQueryClass = new AuthQuery();
  try {
    console.log('sql 1 is ', sql);
    const results = await AuthQueryClass.signUp(sql);
    console.log('results are ', results);
    return res.status(200).json({ message: 'successfully igned up' });
  } catch (error) {
    console.log('error is ', error);
    return res.status(400).json({ message: ` ${error}` });
  }
  // return auth.signUp(req, res, sql);
};

// @LOGIN
exports.userLogin = async (req, res, next) => {
  const AuthQueryClass = new AuthQuery();
  const queryBody = req.body;
  const sql = {
    checkUser: 'select Email, password, role from meal_plan.users where  email = ?',
    saveRefreshToken: 'UPDATE `meal_plan`.`users` SET `refresh_token` = ? WHERE email = ?',
    queryBody,
  };

  try {
    const results = await AuthQueryClass.login(sql);
    const { refreshToken } = results;
    console.log('refresh token is ', refreshToken);
    console.log('results are ', results);
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).send(results);
  } catch (error) {
    if (error?.response?.data?.error) {
      return res.status(400).json({ error });
    }
    console.log('error is:::: ', error.message);
    return res.status(400).json({ error: error.message });
  }
};

// @RULE: SEND VERIFICATION MAIL

exports.sendEmailVerification = async (req, res) => {
  let token, tokenExpiration;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'error! Try again or contact support' });
    }
    token = buffer.toString('hex');
    tokenExpiration = Date.now() + 3600000;
  });
  // @RULE: send token and token expiration to the db this is the db
  try {
    const conn = await db.getConnection();
    await conn.execute('call meal_plan.verifyEmailExists(?)', [req.body.userEmail]);
    await conn.execute('call meal_plan.resetToken(?, ?, ?)', [req.body.userEmail, token, tokenExpiration]);

    const msg = {
      to: req.body.userEmail, // Change to your recipient
      from: process.env.SENDGRID_FROM, // Change to your verified sender
      subject: 'password Reset',
      text: 'If this email was not sent by you please contact us',
      html: `<div><p>Click on the link below to change your password... <a href="http:localhost:8000/api/users/passwordreset/${token}"" target="new"></p>
                        <a href="http://localhost:8000/api/users/passwordreset/${token}">reset password</a>
                    </div>
            `,
    };
    const result = await sgMail.send(msg);
    console.log('results are ', result);
    return res.status(200).json({ message: msg });
  } catch (err) {
    console.log('error is ', err);
    if (err && err.message === 'That email does not exist') {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: 'error!  Try Again or contact support' });
  }
};

//  @RULE: RESET PASSWORD

exports.ResetPassword = async (req, res) => {
  const confirmToken = Date.now();
  try {
    const conn = await db.getConnection();
    const [results] = await conn.execute('call meal_plan.confirmToken(?, ?, @user)', [req.params.token, confirmToken]);
    return res.status(200).json({
      message: 'success',
      user: results[0][0].user,
      token: req.params.token,
    });
  } catch (err) {
    console.log('error is ', err);
    if (err && err.message === 'Not allowed. Please contact support') {
      return res.status(400).json({ message: err.message });
    }
    if (err && err.message === 'token arleady expired or used') {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: 'error!  Try Again or contact support' });
  }
};

//  @RULE: UPDATE PASSWORD

exports.updatePassword = async (req, res) => {
  const confirmToken = Date.now();
  // delete req.body.confirm_password;
  const { userId, token, password } = req.body;
  let newpassword;

  try {
    const conn = await db.getConnection();
    const salt = await bcrypt.genSalt(10);
    newpassword = await bcrypt.hash(req.body.password, salt);
    await conn.execute('call meal_plan.updatedPassword(?,?, ?, ?)', [userId, token, confirmToken, newpassword]);
    return res.status(200).json({
      message: 'successfully updated password. go to login to confirm',
    });
  } catch (err) {
    console.log('error is ', err);
    if (err && err.message === 'Not allowed. Please contact support') {
      return res.status(400).json({ message: err.message });
    }
    if (err && err.message === 'token arleady expired or used') {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: 'error!  Try Again or contact support' });
  }
};

// @RULE: test email

exports.sendMail = (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'zarathustra254@gmail.com', // Change to your recipient
    from: process.env.SENDGRID_FROM, // Change to your verified sender
    subject: 'Testing API Key',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
      res.json('email sent');
    })
    .catch((error) => {
      console.error(error);
      res.json(error);
    });
};

// @RULE: handle logout

exports.handleLogout = async (req, res) => {
  const cookies = req.cookies;
  const sql = 'select Email, refresh_token from meal_plan.users where refresh_token  = ? ';
  const sql2 = 'UPDATE `meal_plan`.`users` SET `refresh_token` = "" WHERE email = ?';
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
      res.clearCookie('jwt', { httpOnly: true });
      return res.sendStatus(204);
    }

    // delete the token in the database
    await db.execute(sql2, [userID]);
    res.clearCookie('jwt', { httpOnly: true });

    return res.sendStatus(204);
  } catch (error) {
    console.log(' logout errors ', error);
    res.status(400).json({ message: 'error logging out' });
  }
};
