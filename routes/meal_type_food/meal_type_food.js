const express = require('express');
const router = express.Router();
router.use((req, res, next) => ['GET', 'HEAD'].includes(req.method) ? next() : res.status(410).json({ message: 'This legacy relationship API is read-only. Use the canonical dish editor or meal combinations.' }));
const mealTypeFoodsController = require('../../controller/meal_type_foods/meal_type_foods');
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
