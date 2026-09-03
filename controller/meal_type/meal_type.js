const { v4: uuidv4 } = require('uuid');
const prisma = require('../../models/prisma');

exports.fetchMealTypes = async (req, res) => res.status(200).json(await prisma.mealtype.findMany({ orderBy: { meal_name: 'asc' } }));
exports.createNewMealType = async (req, res) => { const name = req.body.mealName; if (await prisma.mealtype.findFirst({ where: { meal_name: { contains: name } } })) return res.status(400).json({ message: 'Meal exists' }); await prisma.mealtype.create({ data: { meal_name: name, mealTypesID: uuidv4() } }); res.status(201).json({ message: 'Successfully added a meal' }); };
exports.saveEditMealType = async (req, res) => { const name = req.body.meal_name; if (await prisma.mealtype.findFirst({ where: { meal_name: name, mealTypesID: { not: req.params.id } } })) return res.status(400).json({ message: 'Meal exists' }); await prisma.mealtype.update({ data: { meal_name: name }, where: { mealTypesID: req.params.id } }); res.status(200).json({ message: 'Successfully edited the meal' }); };
exports.deleteMealType = async (req, res) => { await prisma.mealtype.delete({ where: { mealTypesID: req.params.id } }); res.status(200).json({ message: 'Meal type deleted successfully!' }); };
