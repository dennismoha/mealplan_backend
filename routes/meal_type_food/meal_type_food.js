const express = require('express');
const router = express.Router();
const mealTypeFoodsController = require('../../controllers/mealTypeFoodsController');
const {
  createMealTypeFoodValidator,
  updateMealTypeFoodValidator,
  getMealTypeFoodByIdValidator,
  deleteMealTypeFoodByIdValidator,
} = require('../../middlewares/validator/meal_type_food/meal_type_food_validator');

// GET all meal type foods
router.get('/meal-type-foods', mealTypeFoodsController.getAllMealTypeFoods);

// GET a specific meal type food by ID
router.get('/meal-type-foods/:id', getMealTypeFoodByIdValidator, mealTypeFoodsController.getMealTypeFoodById);

// POST create a new meal type food
router.post('/meal-type-foods', createMealTypeFoodValidator, mealTypeFoodsController.createMealTypeFood);

// PUT update a specific meal type food by ID
router.put('/meal-type-foods/:id', updateMealTypeFoodValidator, mealTypeFoodsController.updateMealTypeFoodById);

// DELETE delete a specific meal type food by ID
router.delete('/meal-type-foods/:id', deleteMealTypeFoodByIdValidator, mealTypeFoodsController.deleteMealTypeFoodById);

module.exports = router;
