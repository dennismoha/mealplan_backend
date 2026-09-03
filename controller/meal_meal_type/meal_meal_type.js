const { Meal, MealType, MealMealType } = require('../../models/orm');
const include = [{ model: Meal, as: 'meal' }, { model: MealType, as: 'mealType' }];
const flatten = row => ({ meal_mealTypeID: row.meal_mealTypeID, mealName: row.meal?.mealName, mealId: row.meal?.mealID, meal_name: row.mealType?.meal_name, mealTypesId: row.mealType?.mealTypesID });
exports.getAllMealMealTypes = async (req, res) => res.json((await MealMealType.findAll({ include })).map(flatten));
exports.getMealSelection = async (req, res) => res.json({ meals: await Meal.findAll({ attributes: ['mealID', 'mealName'], raw: true }), mealTypes: await MealType.findAll({ attributes: ['mealTypesID', 'meal_name'], raw: true }) });
exports.createMealInsertion = async (req, res) => { await MealMealType.create({ mealsID: req.body.mealsId, mealTypeID: req.body.mealTypeId }); res.json({ success: true }); };
exports.getSingleItem = async (req, res) => { const row = await MealMealType.findOne({ where: { meal_mealTypeID: req.params.id }, include }); res.json({ mealMealType: row && flatten(row) }); };
exports.updateSingleItem = async (req, res) => { await MealMealType.update({ mealsID: req.body.mealsId, mealTypeID: req.body.mealTypeId }, { where: { meal_mealTypeID: req.params.id } }); res.json({ success: true }); };
exports.deleteSingleItem = async (req, res) => { await MealMealType.destroy({ where: { meal_mealTypeID: req.params.id } }); res.json({ success: true }); };
