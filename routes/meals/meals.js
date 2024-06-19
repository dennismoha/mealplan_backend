const express = require('express');
const router = express.Router();
const mealsController = require('../../controller/meals/meals');
const { validateAddMeal, validateUpdateMeal } = require('../../middlewares/validator/meals/meals_validator');

// CREATE
router.post('/meals', validateAddMeal, mealsController.addMeal);

// READ
router.get('/meals', mealsController.getAllMeals);

// UPDATE
router.put('/meals/:id', validateUpdateMeal, mealsController.updateMeal);

// DELETE
router.delete('/meals/:id', mealsController.deleteMeal);

module.exports = router;
