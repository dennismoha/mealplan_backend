// mealplantimeRoutes.js
const express = require('express');
const {
  validateMealplanTime
} = require('../../middlewares/validator/meal_meal_plan_time/meal_meal_plan_timeValidator');
const mealplanTimeController = require('../../controller/meal_plan_time/meal_plan_time');

const router = express.Router();
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');
const { requireMealPlanOwnership } = require('../../middlewares/authorization/meal_plan_ownership');


router.get('/', mealplanTimeController.getAllMealplanTimes); // fetch all mealplan time
router.get('/:id', mealplanTimeController.getMealplanTime); // fetch a single mealplan time
router.post('/', verifyJwt, requireRoles('professional', 'admin'), validateMealplanTime, mealplanTimeController.createMealplanTime);
router.put('/:id', verifyJwt, requireRoles('professional', 'admin'), requireMealPlanOwnership('interval-id'), validateMealplanTime, mealplanTimeController.updateMealplanTime);
router.delete('/:id', verifyJwt, requireRoles('professional', 'admin'), requireMealPlanOwnership('interval-id'), mealplanTimeController.deleteMealplanTime);


module.exports = router;
