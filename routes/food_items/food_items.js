const express = require('express');
const router = express.Router();
const foodItemsController = require('../../controller/food_items/food_items');
const {
  createFoodItemValidator,
  updateFoodItemValidator,
  getFoodItemByIdValidator,
  deleteFoodItemByIdValidator
} = require('../../middlewares/validator/food_items/food_items_validator');
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');

// Create a new food item
router.post('/', verifyJwt, requireRoles('admin'), createFoodItemValidator, foodItemsController.createFoodItem);

// Get all food items
router.get('/', foodItemsController.getAllFoodItems);

// Update a food item by ID
router.put('/update/:id', verifyJwt, requireRoles('admin'), updateFoodItemValidator, foodItemsController.updateFoodItemById);

// Get a specific food item by ID
router.get('/:id', getFoodItemByIdValidator, foodItemsController.getFoodItemById);

// Delete a food item by ID
router.delete(
  '/fooditems/:id',
  verifyJwt,
  requireRoles('admin'),
  deleteFoodItemByIdValidator,

  foodItemsController.deleteFoodItemById
);

router.post('/image', foodItemsController.createFoodItemImage)
router.get('/:id/pronunciation', foodItemsController.getPronunciation);
router.put('/:id/pronunciation', verifyJwt, requireRoles('admin'), foodItemsController.savePronunciation);
router.delete('/:id/pronunciation', verifyJwt, requireRoles('admin'), foodItemsController.deletePronunciation);

router.put('/:id/local-names/:nameId/pronunciation', verifyJwt, requireRoles('admin'), foodItemsController.saveLocalNamePronunciation);

router.put('/:id', verifyJwt, requireRoles('admin'), foodItemsController.updateFoodItemById);
router.delete('/:id', verifyJwt, requireRoles('admin'), foodItemsController.deleteFoodItemById);

router.put('/:id/nutrition', verifyJwt, requireRoles('admin'), require('../../controller/food_items/nutrition').save);
module.exports = router;
