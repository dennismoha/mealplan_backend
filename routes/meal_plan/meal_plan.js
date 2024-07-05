const express = require('express');
const router = express.Router();

const mealPlanController = require('../../controller/meal_plan/meal_plan');
const verifyJwt = require('../../config/auth_token');
const { checkRole } = require('../../middlewares/validator/auth/user_role_checker');

/**
 * @swagger
 * /meal/plan/all:
 *  get:
 *      summary: This is a get request to return a list of all meal plans
 *      description:  This api returns a list of all meal plans
 *      responses:
 *          200:
 *              description: to test get method
 */
router.get('/all', mealPlanController.fetchMealPlans); // fetch all the meal plans

//router.post('/new', verifyJwt, checkRole, mealPlanController.createANewMealPlan); // create a new meal plan
router.post('/new', mealPlanController.createANewMealPlan); // create a new meal plan
router.put('/update/', mealPlanController.updateMealPlan);
router.delete('/remove/:mealplankey/:day', mealPlanController.deleteMealPlan);

module.exports = router;
