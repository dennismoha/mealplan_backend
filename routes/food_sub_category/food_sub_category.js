// routes/foodSubcategoryRoutes.js

const express = require('express');
const router = express.Router();
const foodSubcategoryController = require('#mealplan/controller/food_sub_category/food_sub_category.js');


// Routes for food subcategory operations
router.get('/', foodSubcategoryController.getAllFoodSubcategories);
router.get('/:id', foodSubcategoryController.getSingleFoodSubcategory);
router.post('/', foodSubcategoryController.createFoodSubcategory);
router.put('/:id', foodSubcategoryController.updateFoodSubcategory);
router.delete('/:id', foodSubcategoryController.deleteFoodSubcategory);

module.exports = router;
