const express = require('express');
const router = express.Router();

const mealTypeController = require('../controller/meal_type/meal_type.js');
const verifyJwt = require('../config/auth_token');
const { requireRoles } = require('../middlewares/validator/auth/user_role_checker');

router.get('/details/:id', mealTypeController.getMeal);
router.get('/all', mealTypeController.fetchMealTypes);
router.post('/add', verifyJwt, requireRoles('admin', 'professional'), mealTypeController.createNewMealType); // post a new meal
router.put('/edit/:id', verifyJwt, requireRoles('admin', 'professional'), mealTypeController.saveEditMealType);
router.delete('/remove/:id', verifyJwt, requireRoles('admin', 'professional'), mealTypeController.deleteMealType); // DELETE

const combinations = require('../controller/meal_type/combinations');
router.post('/combinations', verifyJwt, requireRoles('admin', 'professional'), combinations.save);
router.put('/combinations/:id', verifyJwt, requireRoles('admin', 'professional'), combinations.save);
router.get('/details/:id/summary', require('../controller/meal_type/totals').dish);
module.exports = router;
