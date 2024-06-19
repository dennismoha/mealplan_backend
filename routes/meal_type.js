const express = require('express');
const router = express.Router();

const mealTypeController = require('../controller/meal_type/meal_type.js');

router.get('/all', mealTypeController.fetchMealTypes);
router.post('/add', mealTypeController.createNewMealType); // post a new meal type
router.put('/edit/:id', mealTypeController.saveEditMealType);
router.delete('/remove/:id', mealTypeController.deleteMealType); // DELETE

module.exports = router;
