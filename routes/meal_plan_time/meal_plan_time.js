// mealplantimeRoutes.js
const express = require('express');
const {
  validateMealplanTime
} = require('../../middlewares/validator/meal_meal_plan_time/meal_meal_plan_timeValidator');
const mealplanTimeController = require('../../controller/meal_plan_time/meal_plan_time');

const router = express.Router();

router.get('/', mealplanTimeController.getAllMealplanTimes); // fetch all mealplan time
router.get('/:id', mealplanTimeController.getMealplanTime); // fetch a single mealplan time
router.post('/', validateMealplanTime, mealplanTimeController.createMealplanTime);
router.put('/:id', validateMealplanTime, mealplanTimeController.updateMealplanTime);
router.delete('/:id', mealplanTimeController.deleteMealplanTime);

module.exports = router;
