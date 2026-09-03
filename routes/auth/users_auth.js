const express = require('express');
const User = require('../../controller/user_auth/auth');
const { userSignupValidator, userLoginValidator } = require('../../middlewares/validator/auth/auth_validator');
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');
// const auth = require('../../config/auth_token')

const router = express.Router();

// @RULE: REGISTER USER
router.post('/register', userSignupValidator, User.createUser);

// @RULE: LOGIN USER
router.post('/login/', userLoginValidator, User.userLogin);
router.get('/me', verifyJwt, User.getCurrentUser);
router.get('/admin/users', verifyJwt, requireRoles('admin'), User.listUsers);
router.post('/admin/users', verifyJwt, requireRoles('admin'), User.adminCreateUser);
router.patch('/admin/users/:id', verifyJwt, requireRoles('admin'), User.updateUserAccess);

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
