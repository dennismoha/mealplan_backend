const express = require('express');
const router = express.Router();

const mealPlanController = require('../../controller/meal_plan/meal_plan');
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');
const { requireMealPlanOwnership } = require('../../middlewares/authorization/meal_plan_ownership');
const { validateMealPlanFields } = require('#mealplan/middlewares/validator/meal_plan/meal_plan_validator.js');



router.get('/all', mealPlanController.fetchMealPlans); // fetch all the meal plans
router.get('/mine', verifyJwt, requireRoles('user', 'professional', 'admin'), mealPlanController.fetchMyMealPlans);

//router.post('/new', verifyJwt, checkRole, mealPlanController.createANewMealPlan); // create a new meal plan
router.post('/new', verifyJwt, requireRoles('user', 'professional', 'admin'), requireMealPlanOwnership('plan-key'), validateMealPlanFields, mealPlanController.createANewMealPlan); // create a new meal plan
router.put('/update/', verifyJwt, requireRoles('user', 'professional', 'admin'), requireMealPlanOwnership('plan-key'), validateMealPlanFields, mealPlanController.updateMealPlan);
router.delete('/remove/:mealplankey/:day', verifyJwt, requireRoles('user', 'professional', 'admin'), requireMealPlanOwnership('plan-key'), mealPlanController.deleteMealPlan);

router.get('/:id/summary', require('../../controller/meal_type/totals').plan);
module.exports = router;
