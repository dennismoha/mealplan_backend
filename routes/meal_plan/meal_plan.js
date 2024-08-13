const express = require('express');
const router = express.Router();

const mealPlanController = require('../../controller/meal_plan/meal_plan');
const verifyJwt = require('../../config/auth_token');
const { checkRole } = require('../../middlewares/validator/auth/user_role_checker');
const { validateMealPlanFields } = require('#mealplan/middlewares/validator/meal_plan/meal_plan_validator.js');



router.get('/all', mealPlanController.fetchMealPlans); // fetch all the meal plans

//router.post('/new', verifyJwt, checkRole, mealPlanController.createANewMealPlan); // create a new meal plan
router.post('/new',validateMealPlanFields, mealPlanController.createANewMealPlan); // create a new meal plan
router.put('/update/', mealPlanController.updateMealPlan);
router.delete('/remove/:mealplankey/:day', mealPlanController.deleteMealPlan);

module.exports = router;
