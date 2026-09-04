const { v4: uuidv4 } = require('uuid');
const prisma = require('../../models/prisma');

const includeDetails = {
  meal_type_food_items: { include: { fooditems: true } },
  meal_type_preparation_sources: true,
  meal_type_images: { orderBy: { image_order: 'asc' } },
  recipe: true,
};

exports.fetchMealTypes = async (req, res) => res.status(200).json(await prisma.mealtype.findMany({ include: includeDetails, orderBy: { meal_name: 'asc' } }));

exports.createNewMealType = async (req, res) => {
  const { mealName, local_name, description, image_url, video_url, pronunciation_url, country_id, foodItems = [], preparationSources = [], mealImages = [] } = req.body;
  const name = mealName?.trim();
  if (!name) return res.status(400).json({ message: 'Meal name is required' });
  if (!Array.isArray(foodItems) || !foodItems.length || foodItems.some(item => !item.food_item_id)) return res.status(400).json({ message: 'Choose at least one valid food item' });
  if (await prisma.mealtype.findUnique({ where: { meal_name: name } })) return res.status(409).json({ message: 'Meal already exists' });

  const meal = await prisma.mealtype.create({
    data: {
      meal_name: name, mealTypesID: uuidv4(), local_name: local_name?.trim() || null, description: description?.trim() || null, country_id: country_id || null,
      image_url: image_url || null, video_url: video_url || null, pronunciation_url: pronunciation_url || null,
      meal_type_food_items: { create: foodItems.map(item => ({ food_item_id: item.food_item_id, quantity: item.quantity || null, unit: item.unit || null, preparation_notes: item.preparation_notes || null })) },
      meal_type_preparation_sources: { create: preparationSources.map(source => ({ source_type: source.source_type, source_url: source.source_url, title: source.title || null })) },
      meal_type_images: { create: mealImages.map((image, index) => ({ image_url: typeof image === 'string' ? image : image.image_url, image_order: typeof image === 'string' ? index : image.image_order ?? index })) },
    },
    include: includeDetails,
  });
  if (country_id) {
    await prisma.meal_type_countries.create({
      data: { meal_type_id: meal.mealTypesID, country_id: Number(country_id) },
    });
  }
  return res.status(201).json({ message: 'Successfully added a meal', data: meal });
};

exports.saveEditMealType = async (req, res) => {
  const name = req.body.meal_name?.trim();
  if (!name) return res.status(400).json({ message: 'Meal name is required' });
  if (await prisma.mealtype.findFirst({ where: { meal_name: name, mealTypesID: { not: req.params.id } } })) return res.status(409).json({ message: 'Meal exists' });
  const meal = await prisma.mealtype.update({ data: { meal_name: name }, where: { mealTypesID: req.params.id } });
  return res.status(200).json({ message: 'Successfully edited the meal', data: meal });
};

exports.deleteMealType = async (req, res) => {
  await prisma.mealtype.delete({ where: { mealTypesID: req.params.id } });
  return res.status(200).json({ message: 'Meal deleted successfully' });
};
