// routes/index.js
const express = require('express');
const mealmealTypeController = require('../../controller/meal_meal_type/meal_meal_type');
const mealmealTypeValidator = require('../../middlewares/validator/meal_meal_type/meal_meal_type_validator');
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');

const router = express.Router();

router.get('/all', mealmealTypeController.getAllMealMealTypes); // fetch all mealTypes
router.get('/selection', mealmealTypeController.getMealSelection); // fetch meals and mealtypes
router.post('/add', verifyJwt, requireRoles('admin'), mealmealTypeValidator.createMealInsertionValidator, mealmealTypeController.createMealInsertion);
router.get('/:id', mealmealTypeController.getSingleItem); // fetch a single mealmealType
router.put('/update/:id', verifyJwt, requireRoles('admin'), mealmealTypeValidator.updateSingleItemValidator, mealmealTypeController.updateSingleItem);
router.delete('/remove/:id', verifyJwt, requireRoles('admin'), mealmealTypeController.deleteSingleItem);

module.exports = router;
