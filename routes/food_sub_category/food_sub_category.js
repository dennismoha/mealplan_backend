// routes/foodSubcategoryRoutes.js

const express = require('express');
const router = express.Router();
const foodSubcategoryController = require('#mealplan/controller/food_sub_category/food_sub_category.js');
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');


// Routes for food subcategory operations
router.get('/', foodSubcategoryController.getAllFoodSubcategories);
router.get('/:id', foodSubcategoryController.getSingleFoodSubcategory);
router.post('/', verifyJwt, requireRoles('admin'), foodSubcategoryController.createFoodSubcategory);
router.put('/:id', verifyJwt, requireRoles('admin'), foodSubcategoryController.updateFoodSubcategory);
router.delete('/:id', verifyJwt, requireRoles('admin'), foodSubcategoryController.deleteFoodSubcategory);

module.exports = router;
