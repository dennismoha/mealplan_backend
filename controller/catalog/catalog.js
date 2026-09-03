const { FoodCategory, FoodSubcategory, FoodItem, MealType, Meal, MealMealType, Recipe, Country, FoodNutrition } = require('../../models/orm');

exports.getCatalog = async (req, res) => {
  const [categories, subcategories, foodItems, mealTypes, mealSlots, links, recipes, countries] = await Promise.all([
    FoodCategory.findAll({ order: [['category_name', 'ASC']], raw: true }), FoodSubcategory.findAll({ order: [['subcategory_name', 'ASC']], raw: true }), FoodItem.findAll({ include: [{ model: Country, as: 'countries', through: { attributes: [] } }, { model: FoodNutrition, as: 'nutrition' }], order: [['food_name', 'ASC']] }), MealType.findAll({ include: [{ model: Country, as: 'countries', through: { attributes: [] } }], order: [['meal_name', 'ASC']] }), Meal.findAll({ attributes: ['mealName', 'mealID'], order: [['mealName', 'ASC']], raw: true }), MealMealType.findAll({ include: [{ model: Meal, as: 'meal' }, { model: MealType, as: 'mealType' }] }), Recipe.findAll({ include: [{ model: FoodItem, as: 'foodItems', through: { attributes: ['quantity', 'notes'] } }], order: [['title', 'ASC']] }), Country.findAll({ order: [['name', 'ASC']], raw: true }),
  ]);
  const assignments = links.map(link => ({ meal_mealTypeID: link.meal_mealTypeID, mealID: link.meal?.mealID, mealName: link.meal?.mealName, mealTypesID: link.mealType?.mealTypesID, meal_name: link.mealType?.meal_name }));
  res.status(200).json({ statusCode: 200, data: { categories, subcategories, foodItems, mealTypes, mealSlots, assignments, recipes, countries }, status: 'Catalog retrieved successfully' });
};
