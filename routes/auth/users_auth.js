const express = require('express');
const User = require('../../controller/user_auth/auth');
const { userSignupValidator, userLoginValidator } = require('../../middlewares/validator/auth/auth_validator');
// const auth = require('../../config/auth_token')

const router = express.Router();

// @RULE: REGISTER USER
router.post('/register', userSignupValidator, User.createUser);

// @RULE: LOGIN USER
router.post('/login/', userLoginValidator, User.userLogin);

// @Rule: send email
router.get('/sendmail/', User.sendMail);

// @Rule: send email verification
router.post('/verificationmail/', User.sendEmailVerification);

// @Rule: Reset Password
router.get('/passwordreset/:token', User.ResetPassword);

// @Rule: updated Password
router.post('/updatepassword/', User.updatePassword);

// @Rule: logout
router.get('/logout', User.handleLogout);

module.exports = router;
