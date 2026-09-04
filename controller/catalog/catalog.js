const prisma = require('../../models/prisma');

exports.getCatalog = async (req, res) => {
  let [categories, subcategories, foodItems, mealTypes, mealSlots, links, recipes, countries, foodCountryLinks, mealCountryLinks, nutrition, recipeFoodLinks] = await Promise.all([
    prisma.foodcategory.findMany({ orderBy: { category_name: 'asc' } }), prisma.foodsubcategory.findMany({ orderBy: { subcategory_name: 'asc' } }), prisma.fooditems.findMany({ orderBy: { food_name: 'asc' } }), prisma.mealtype.findMany({ orderBy: { meal_name: 'asc' } }), prisma.meals.findMany({ include: { meal_food_items: { include: { fooditems: true } }, meal_preparation_sources: true, meal_images: { orderBy: { image_order: 'asc' } } }, orderBy: { mealName: 'asc' } }), prisma.mealmealtype.findMany({ include: { meals: true, mealtype: true } }), prisma.recipe.findMany({ orderBy: { title: 'asc' } }), prisma.countries.findMany({ orderBy: { name: 'asc' } }), prisma.food_item_countries.findMany(), prisma.meal_type_countries.findMany(), prisma.food_nutrition.findMany(), prisma.recipe_food_items.findMany(),
  ]);
  foodItems = foodItems.map(food => ({ ...food, countries: countries.filter(country => foodCountryLinks.some(link => link.food_item_id === food.food_itemID && link.country_id === country.id)), nutrition: nutrition.find(item => item.food_item_id === food.food_itemID) || null }));
  mealTypes = mealTypes.map(meal => ({ ...meal, countries: countries.filter(country => mealCountryLinks.some(link => link.meal_type_id === meal.mealTypesID && link.country_id === country.id)) }));
  recipes = recipes.map(recipe => ({ ...recipe, foodItems: foodItems.filter(food => recipeFoodLinks.some(link => link.recipe_id === recipe.recipe_ID && link.food_item_id === food.food_itemID)) }));
  const assignments = links.map(link => ({ meal_mealTypeID: link.meal_mealTypeID, mealID: link.meals?.mealID, mealName: link.meals?.mealName, mealTypesID: link.mealtype?.mealTypesID, meal_name: link.mealtype?.meal_name }));
  res.status(200).json({ statusCode: 200, data: { categories, subcategories, foodItems, mealTypes, mealSlots, assignments, recipes, countries }, status: 'Catalog retrieved successfully' });
};
