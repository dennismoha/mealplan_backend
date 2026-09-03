const { Op } = require('sequelize');
const { MealType } = require('../../models/orm');

exports.fetchMealTypes = async (req, res) => res.status(200).json(await MealType.findAll({ order: [['meal_name', 'ASC']], raw: true }));
exports.createNewMealType = async (req, res) => { const name = req.body.mealName; if (await MealType.findOne({ where: { meal_name: { [Op.like]: `%${name}%` } } })) return res.status(400).json({ message: 'Meal exists' }); await MealType.create({ meal_name: name }); res.status(201).json({ message: 'Successfully added a meal' }); };
exports.saveEditMealType = async (req, res) => { const name = req.body.meal_name; if (await MealType.findOne({ where: { meal_name: name, mealTypesID: { [Op.ne]: req.params.id } } })) return res.status(400).json({ message: 'Meal exists' }); await MealType.update({ meal_name: name }, { where: { mealTypesID: req.params.id } }); res.status(200).json({ message: 'Successfully edited the meal' }); };
exports.deleteMealType = async (req, res) => { await MealType.destroy({ where: { mealTypesID: req.params.id } }); res.status(200).json({ message: 'Meal type deleted successfully!' }); };
