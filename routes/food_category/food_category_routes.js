// foodCategoryRoutes.js
const express = require('express');
const { validateFoodCategory } = require('../../middlewares/validator/food_category/food_category_validator');
const foodCategoryController = require('../../controller/food_category/food_category');
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');

const router = express.Router();

router.get('/', foodCategoryController.getAllFoodCategories);
router.get('/subcategories', foodCategoryController.getFoodSubcategoryDetails);
// router.get('/:id', foodCategoryController.getFoodCategory);
router.get('/:id', foodCategoryController.getSingleCategory);
router.post('/', verifyJwt, requireRoles('admin'), validateFoodCategory, foodCategoryController.createFoodCategory);
router.put('/:id', verifyJwt, requireRoles('admin'), validateFoodCategory, foodCategoryController.updateFoodCategory);
router.delete('/:id', verifyJwt, requireRoles('admin'), foodCategoryController.deleteFoodCategory);

module.exports = router;
