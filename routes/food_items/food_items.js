const express = require('express');
const router = express.Router();
const foodItemsController = require('../../controller/food_items/food_items');
const {
  createFoodItemValidator,
  updateFoodItemValidator,
  getFoodItemByIdValidator,
  deleteFoodItemByIdValidator
} = require('../../middlewares/validator/food_items/food_items_validator');

// Create a new food item
router.post('/', createFoodItemValidator, foodItemsController.createFoodItem);

// Get all food items
router.get('/', foodItemsController.getAllFoodItems);

// Update a food item by ID
router.put('/update/:id', updateFoodItemValidator, foodItemsController.updateFoodItemById);

// Get a specific food item by ID
router.get('/:id', getFoodItemByIdValidator, foodItemsController.getFoodItemById);

// Delete a food item by ID
router.delete(
  '/fooditems/:id',
  deleteFoodItemByIdValidator,

  foodItemsController.deleteFoodItemById
);

router.post('/image', foodItemsController.createFoodItemImage)

module.exports = router;
