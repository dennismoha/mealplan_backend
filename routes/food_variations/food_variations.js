const express = require('express');
const router = express.Router();
const foodVariationsController = require('../../controller/food_variations/food_variations');
const {
  createFoodVariationValidator,
  updateFoodVariationValidator,
  getFoodVariationByIdValidator,
  deleteFoodVariationByIdValidator,
} = require('../../middlewares/validator/food_variations/food_variations_validator');

// GET all food variations
router.get('/food-variations', foodVariationsController.getAllFoodVariations);

// GET all food variations
router.get('/food-variations', foodVariationsController.getAllFoodVariations);

// GET a specific food variation by ID
router.get('/food-variations/:id', getFoodVariationByIdValidator, foodVariationsController.getFoodVariationById);

// POST create a new food variation
router.post('/food-variations', createFoodVariationValidator, foodVariationsController.createFoodVariation);

// PUT update a specific food variation by ID
router.put('/food-variations/:id', updateFoodVariationValidator, foodVariationsController.updateFoodVariationById);

// DELETE delete a specific food variation by ID
router.delete(
  '/food-variations/:id',
  deleteFoodVariationByIdValidator,
  foodVariationsController.deleteFoodVariationById,
);

module.exports = router;
