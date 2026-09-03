const express = require('express');
const router = express.Router();
const mealsController = require('../../controller/meals/meals');
const { validateAddMeal, validateUpdateMeal } = require('../../middlewares/validator/meals/meals_validator');
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');

// CREATE
router.post('/meals', verifyJwt, requireRoles('admin'), validateAddMeal, mealsController.addMeal);

// READ
router.get('/meals', mealsController.getAllMeals);

// UPDATE
router.put('/meals/:id', verifyJwt, requireRoles('admin'), validateUpdateMeal, mealsController.updateMeal);

// DELETE
router.delete('/meals/:id', verifyJwt, requireRoles('admin'), mealsController.deleteMeal);

module.exports = router;
