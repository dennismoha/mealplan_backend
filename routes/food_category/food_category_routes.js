// foodCategoryRoutes.js
const express = require('express');
const { validateFoodCategory } = require('../../middlewares/validator/food_category/food_category_validator');
const foodCategoryController = require('../../controller/food_category/food_category');

const router = express.Router();

router.get('/', foodCategoryController.getAllFoodCategories);
router.get('/subcategories', foodCategoryController.getFoodSubcategoryDetails);
// router.get('/:id', foodCategoryController.getFoodCategory);
router.get('/:id', foodCategoryController.getSingleCategory);
router.post('/', validateFoodCategory, foodCategoryController.createFoodCategory);
router.put('/:id', validateFoodCategory, foodCategoryController.updateFoodCategory);
router.delete('/:id', foodCategoryController.deleteFoodCategory);

module.exports = router;
