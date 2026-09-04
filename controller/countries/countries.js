const prisma = require('../../models/prisma');

const countryData = (body = {}) => ({
  name: typeof body.name === 'string' ? body.name.trim() : '',
  code: typeof body.code === 'string' ? body.code.trim().toUpperCase() : '',
  description: typeof body.description === 'string' && body.description.trim() ? body.description.trim() : null,
  image_url: typeof body.image_url === 'string' && body.image_url.trim() ? body.image_url.trim() : null,
});

const validateCountry = (data) => {
  if (!data.name || data.name.length > 100) return 'Country name is required and must be 100 characters or fewer.';
  if (!/^[A-Z]{2,3}$/.test(data.code)) return 'Country code must contain 2 or 3 letters.';
  if (data.image_url) {
    try {
      const url = new URL(data.image_url);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch (_) {
      return 'Image URL must be a valid HTTP or HTTPS URL.';
    }
  }
  return null;
};

const writeError = (res, error) => {
  if (error.code === 'P2002') return res.status(409).json({ message: 'A country with this name or code already exists.' });
  if (error.code === 'P2025') return res.status(404).json({ message: 'Country not found.' });
  throw error;
};

exports.list = async (req, res) => res.json({ countries: await prisma.countries.findMany({ orderBy: { name: 'asc' } }) });
exports.get = async (req, res) => {
  const id = Number(req.params.id);
  const country = await prisma.countries.findUnique({ where: { id } });
  if (country) {
    const [foodLinks, mealLinks] = await Promise.all([prisma.food_item_countries.findMany({ where: { country_id: id } }), prisma.meal_type_countries.findMany({ where: { country_id: id } })]);
    country.foodItems = await prisma.fooditems.findMany({ where: { food_itemID: { in: foodLinks.map(link => link.food_item_id) } } });
    const nutrition = await prisma.food_nutrition.findMany({ where: { food_item_id: { in: country.foodItems.map(food => food.food_itemID) } } });
    country.foodItems = country.foodItems.map(food => ({ ...food, nutrition: nutrition.find(item => item.food_item_id === food.food_itemID) || null }));
    country.mealTypes = (await prisma.mealtype.findMany({ where: { mealTypesID: { in: mealLinks.map(link => link.meal_type_id) } }, include: { recipe: true } })).map(({ recipe, ...meal }) => ({ ...meal, recipes: recipe }));
  }
  return country ? res.json({ country }) : res.sendStatus(404);
};
exports.create = async (req, res) => {
  const data = countryData(req.body);
  const error = validateCountry(data);
  if (error) return res.status(400).json({ message: error });
  try {
    return res.status(201).json({ country: await prisma.countries.create({ data }) });
  } catch (writeFailure) {
    return writeError(res, writeFailure);
  }
};
exports.update = async (req, res) => {
  const data = countryData(req.body);
  const error = validateCountry(data);
  if (error) return res.status(400).json({ message: error });
  try {
    return res.json({ country: await prisma.countries.update({ data, where: { id: Number(req.params.id) } }) });
  } catch (writeFailure) {
    return writeError(res, writeFailure);
  }
};
exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const [foodLinks, mealLinks, meals, mealTypes] = await Promise.all([
    prisma.food_item_countries.count({ where: { country_id: id } }),
    prisma.meal_type_countries.count({ where: { country_id: id } }),
    prisma.meals.count({ where: { country_id: id } }),
    prisma.mealtype.count({ where: { country_id: id } }),
  ]);
  if (foodLinks + mealLinks + meals + mealTypes > 0) {
    return res.status(409).json({ message: 'This country is linked to food or meal records. Remove those links before deleting it.' });
  }
  try {
    await prisma.countries.delete({ where: { id } });
    return res.sendStatus(204);
  } catch (writeFailure) {
    return writeError(res, writeFailure);
  }
};
exports.linkFood = async (req, res) => { await prisma.food_item_countries.create({ data: { country_id: Number(req.params.id), food_item_id: req.body.foodItemId } }); res.json({ success: true }); };
exports.linkMeal = async (req, res) => { await prisma.meal_type_countries.create({ data: { country_id: Number(req.params.id), meal_type_id: req.body.mealTypeId } }); res.json({ success: true }); };
