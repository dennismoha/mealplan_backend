const express = require('express');
const catalogController = require('../../controller/catalog/catalog');

const router = express.Router();
router.get('/', catalogController.getCatalog);

module.exports = router;
