const express = require('express');
const refreshToken = require('../../controller/user_auth/refresh_token');
const router = express.Router();

// @RULE: get REFESH TOKEN
router.get('/refresh', refreshToken.handleRefreshToken);

module.exports = router;
