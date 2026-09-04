const express = require('express');
const router = express.Router();

const mealTypeController = require('../controller/meal_type/meal_type.js');
const verifyJwt = require('../config/auth_token');
const { requireRoles } = require('../middlewares/validator/auth/user_role_checker');

router.get('/all', mealTypeController.fetchMealTypes);
router.post('/add', verifyJwt, requireRoles('admin', 'professional'), mealTypeController.createNewMealType); // post a new meal
router.put('/edit/:id', verifyJwt, requireRoles('admin', 'professional'), mealTypeController.saveEditMealType);
router.delete('/remove/:id', verifyJwt, requireRoles('admin'), mealTypeController.deleteMealType); // DELETE

module.exports = router;
