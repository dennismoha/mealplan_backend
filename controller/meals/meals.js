const { Meal } = require('../../models/orm');

exports.addMeal = async (req, res) => { const [row, created] = await Meal.findOrCreate({ where: { mealName: req.body.mealName }, defaults: req.body }); return created ? res.status(201).json({ message: 'Meal added successfully!', meal: row }) : res.status(400).json({ error: 'Meal already exists' }); };
exports.getAllMeals = async (req, res) => res.status(200).json(await Meal.findAll({ attributes: ['mealName', 'mealID'], order: [['mealName', 'ASC']], raw: true }));
exports.updateMeal = async (req, res) => { await Meal.update({ mealName: req.body.mealName }, { where: { mealID: req.params.id } }); res.status(200).json({ message: 'Meal updated successfully!' }); };
exports.deleteMeal = async (req, res) => { await Meal.destroy({ where: { mealID: req.params.id } }); res.status(200).json({ message: 'Meal deleted successfully!' }); };
