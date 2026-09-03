const prisma = require('../../models/prisma');

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
exports.create = async (req, res) => res.status(201).json({ country: await prisma.countries.create({ data: req.body }) });
exports.update = async (req, res) => res.json({ country: await prisma.countries.update({ data: req.body, where: { id: Number(req.params.id) } }) });
exports.remove = async (req, res) => { await prisma.countries.delete({ where: { id: Number(req.params.id) } }); res.sendStatus(204); };
exports.linkFood = async (req, res) => { await prisma.food_item_countries.create({ data: { country_id: Number(req.params.id), food_item_id: req.body.foodItemId } }); res.json({ success: true }); };
exports.linkMeal = async (req, res) => { await prisma.meal_type_countries.create({ data: { country_id: Number(req.params.id), meal_type_id: req.body.mealTypeId } }); res.json({ success: true }); };
