// routes/index.js
const express = require('express');
const mealmealTypeController = require('../../controller/meal_meal_type/meal_meal_type');
const mealmealTypeValidator = require('../../middlewares/validator/meal_meal_type/meal_meal_type_validator');

const router = express.Router();

router.get('/all', mealmealTypeController.getAllMealMealTypes); // fetch all mealTypes
router.get('/selection', mealmealTypeController.getMealSelection); // fetch meals and mealtypes
router.post('/add', mealmealTypeValidator.createMealInsertionValidator, mealmealTypeController.createMealInsertion);
router.get('/:id', mealmealTypeController.getSingleItem); // fetch a single mealmealType
router.put('/update/:id', mealmealTypeValidator.updateSingleItemValidator, mealmealTypeController.updateSingleItem);
router.delete('/remove/:id', mealmealTypeController.deleteSingleItem);

module.exports = router;
