const express = require('express');
const { StatusCodes } = require('http-status-codes');
const router = express.Router();

// check if the server is working.
router.get('/', (req, res) => res.status(StatusCodes.OK).json({ message: 'server is working well' }));

module.exports = router;
