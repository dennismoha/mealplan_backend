const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

class loginQuery {
  async login(sql) {
    const { queryBody, checkUser, saveRefreshToken } = sql;
    const { userEmail, password } = queryBody;
    console.log('this is the login');
    // try {
    let user = await db.execute(checkUser, [userEmail]);
    console.log('the value of the user is ', user[0]);
    console.log('password is ', password);
    user = user[0];
    if (user.length === 0) {
      throw Error('unknown user');
    }
    console.log('user is ', user[0].password);

    const passwordIsEqual = await bcrypt.compare(password, user[0].password);
    if (!passwordIsEqual) {
      console.log('passwords not equal');
      throw new Error('Email or password is incorrect');
    }
    console.log('passwords are equal');
    const userId = userEmail;
    // const { roles } = user;
    let roles = user[0].role;
    // if (userId === 'me@mail.com') {
    //   roles = [2001, 2002];
    // } else {
    //   roles = [2003];
    // }
    const token = jwt.sign({ userId, roles }, `${process.env.ACCESS_TOKEN_SECRET}`, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ userId, roles }, `${process.env.REFRESH_TOKEN_SECRET}`, {
      expiresIn: '6h',
    });
    const saveUserRefreshToken = await db.execute(saveRefreshToken, [refreshToken, userEmail]);
    console.log('save user refresh token is ', saveUserRefreshToken);
    return { token, userId, roles, refreshToken };
  }

  async signUp(sql) {
    console.log('sql is ', sql);
    const { checkUser, registerUser, querBody, role } = sql;
    let { password, userEmail } = querBody;

    // try {
    const conn = await db.getConnection();
    console.log('user email is ', userEmail);
    let user = await conn.execute(checkUser, [userEmail]);
    console.log('user is ', user[0]);
    if (user[0].length > 0) {
      throw Error('user exists');
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    querBody.password = password;
    const passBody = Object.values(querBody);
    console.log('passbody is', passBody);
    await db.execute(registerUser, [...passBody, role]);
    return { message: 'success' };
    // res.status(200).json({ message: 'success' });
    // } catch (error) {
    //   console.log('error signing up user data to db', error);
    //   if (error && error.message === 'user arleady exists') {
    //     return res.status(400).json({ message: error.message });
    //   }
    //   return res.status(400).json({ message: 'error Singup. Try later or contact support' });
    // }
  }
}

module.exports = loginQuery;

// console.log(path.dirname(require.main.filename))
// console.log(path.dirname(Object.keys(require.cache)[0]));
