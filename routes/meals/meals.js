// Compatibility URLs resolve legacy IDs, then use the canonical dish service.
const router = require('express').Router();
const prisma = require('../../models/prisma');
const controller = require('../../controller/meal_type/meal_type');
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');
router.param('id', async (req, res, next, id) => {
  const alias = await prisma.legacy_meal_alias.findUnique({ where: { legacy_id: id } });
  req.params.id = alias?.dish_id || id;
  next();
});
router.get('/meals', controller.fetchMealTypes);
router.get('/meals/:id/details', controller.getMeal);
router.get('/meals/:id', controller.getMeal);
router.post('/meals', verifyJwt, requireRoles('professional','admin'), controller.createNewMealType);
router.put('/meals/:id', verifyJwt, requireRoles('professional','admin'), controller.saveEditMealType);
router.delete('/meals/:id', verifyJwt, requireRoles('professional','admin'), controller.deleteMealType);
// Relationship changes are submitted atomically through the full dish editor.
router.all('/meals/:id/*', (req, res) => res.status(410).json({ message: 'Use PUT /api/meal-types/edit/:id with foodItems, preparationSources, or mealImages to update this dish atomically.' }));
module.exports = router;
