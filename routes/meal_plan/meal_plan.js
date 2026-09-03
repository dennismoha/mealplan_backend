const express = require('express');
const router = express.Router();

const mealPlanController = require('../../controller/meal_plan/meal_plan');
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');
const { requireMealPlanOwnership } = require('../../middlewares/authorization/meal_plan_ownership');
const { validateMealPlanFields } = require('#mealplan/middlewares/validator/meal_plan/meal_plan_validator.js');



router.get('/all', mealPlanController.fetchMealPlans); // fetch all the meal plans
router.get('/mine', verifyJwt, requireRoles('professional'), mealPlanController.fetchMyMealPlans);

//router.post('/new', verifyJwt, checkRole, mealPlanController.createANewMealPlan); // create a new meal plan
router.post('/new', verifyJwt, requireRoles('professional', 'admin'), requireMealPlanOwnership('plan-key'), validateMealPlanFields, mealPlanController.createANewMealPlan); // create a new meal plan
router.put('/update/', verifyJwt, requireRoles('professional', 'admin'), requireMealPlanOwnership('plan-key'), mealPlanController.updateMealPlan);
router.delete('/remove/:mealplankey/:day', verifyJwt, requireRoles('professional', 'admin'), requireMealPlanOwnership('plan-key'), mealPlanController.deleteMealPlan);

module.exports = router;
