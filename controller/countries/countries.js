const { Country, FoodItem, MealType, Recipe, FoodNutrition } = require('../../models/orm');

exports.list = async (req, res) => res.json({ countries: await Country.findAll({ order: [['name', 'ASC']], raw: true }) });
exports.get = async (req, res) => {
  const country = await Country.findByPk(req.params.id, { include: [{ model: FoodItem, as: 'foodItems', through: { attributes: [] }, include: [{ model: FoodNutrition, as: 'nutrition' }] }, { model: MealType, as: 'mealTypes', through: { attributes: [] }, include: [{ model: Recipe, as: 'recipes' }] }] });
  return country ? res.json({ country }) : res.sendStatus(404);
};
exports.create = async (req, res) => res.status(201).json({ country: await Country.create(req.body) });
exports.update = async (req, res) => { await Country.update(req.body, { where: { id: req.params.id } }); res.json({ country: await Country.findByPk(req.params.id) }); };
exports.remove = async (req, res) => { await Country.destroy({ where: { id: req.params.id } }); res.sendStatus(204); };
exports.linkFood = async (req, res) => { const country = await Country.findByPk(req.params.id); await country.addFoodItem(req.body.foodItemId); res.json({ success: true }); };
exports.linkMeal = async (req, res) => { const country = await Country.findByPk(req.params.id); await country.addMealType(req.body.mealTypeId); res.json({ success: true }); };
