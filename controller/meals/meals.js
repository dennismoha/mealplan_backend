const { v4: uuidv4 } = require('uuid');
const prisma = require('../../models/prisma');

exports.addMeal = async (req, res) => { const existing = await prisma.meals.findUnique({ where: { mealName: req.body.mealName } }); if (existing) return res.status(400).json({ error: 'Meal already exists' }); const meal = await prisma.meals.create({ data: { ...req.body, mealID: req.body.mealID || uuidv4() } }); return res.status(201).json({ message: 'Meal added successfully!', meal }); };
exports.getAllMeals = async (req, res) => res.status(200).json(await prisma.meals.findMany({ select: { mealName: true, mealID: true }, orderBy: { mealName: 'asc' } }));
exports.updateMeal = async (req, res) => { await prisma.meals.update({ data: { mealName: req.body.mealName }, where: { mealID: req.params.id } }); res.status(200).json({ message: 'Meal updated successfully!' }); };
exports.deleteMeal = async (req, res) => { await prisma.meals.delete({ where: { mealID: req.params.id } }); res.status(200).json({ message: 'Meal deleted successfully!' }); };
