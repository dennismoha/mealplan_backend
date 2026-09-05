const { v4: uuidv4 } = require('uuid');
const prisma = require('../../models/prisma');

async function withFoodItems(recipe) {
  if (!recipe) return recipe;
  const links = await prisma.recipe_food_items.findMany({ where: { recipe_id: recipe.recipe_ID } });
  const foods = await prisma.fooditems.findMany({ where: { food_itemID: { in: links.map(link => link.food_item_id) } } });
  return { ...recipe, foodItems: foods.map(food => ({ ...food, RecipeFoodItem: links.find(link => link.food_item_id === food.food_itemID) })) };
}
exports.list = async (req, res) => res.json({ recipes: await Promise.all((await prisma.recipe.findMany({ orderBy: { title: 'asc' } })).map(withFoodItems)) });
const recipeFields = body => {
  const data = {};
  for (const field of ['title', 'description', 'ingredients', 'instructions', 'video_url', 'image_url', 'cuisine', 'difficulty', 'meal_type', 'prep_time', 'cook_time', 'total_time', 'servings']) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
};
const recipeError = (res, error) => {
  if (['P2002', 'P2034'].includes(error.code)) return res.status(409).json({ message: 'This meal already has a recipe or was changed. Refresh to edit its existing recipe.' });
  if (error.status) return res.status(error.status).json({ message: error.message });
  throw error;
};
const invalid = message => { throw Object.assign(new Error(message), { status: 400 }); };
async function saveRecipe(tx, body, owner, existing) {
  const mealId = body.meal_typeID ?? existing?.meal_typeID;
  if (typeof mealId !== 'string' || !mealId) invalid('Choose a meal for this recipe');
  if (existing && mealId !== existing.meal_typeID) invalid('A recipe cannot be moved to a different meal');
  const meal = await tx.mealtype.findUnique({ where: { mealTypesID: mealId }, include: { meal_type_food_items: true } });
  if (!meal) invalid('Meal not found');
  const duplicate = await tx.recipe.findFirst({ where: { meal_typeID: mealId, ...(existing ? { idrecipe: { not: existing.idrecipe } } : {}) } });
  if (duplicate) throw Object.assign(new Error('This meal already has a recipe. Edit or delete that recipe instead.'), { status: 409 });
  const data = recipeFields(body);
  for (const field of ['title', 'ingredients', 'instructions']) {
    const value = data[field] ?? existing?.[field];
    if (typeof value !== 'string' || !value.trim()) invalid(`${field} is required`);
    if (data[field] !== undefined) data[field] = value.trim();
  }
  let foods = body.foodItems;
  if (!existing && foods === undefined) foods = meal.meal_type_food_items.map(item => ({ id: item.food_item_id, quantity: [item.quantity, item.unit].filter(Boolean).join(' '), notes: item.preparation_notes }));
  if (foods !== undefined) {
    if (!Array.isArray(foods) || foods.some(item => !item || typeof item.id !== 'string')) invalid('Invalid linked food items');
    const ids = foods.map(item => item.id);
    if (new Set(ids).size !== ids.length || await tx.fooditems.count({ where: { food_itemID: { in: ids } } }) !== ids.length) invalid('Choose distinct existing food items');
  }
  const row = existing ? await tx.recipe.update({ where: { idrecipe: existing.idrecipe }, data }) : await tx.recipe.create({ data: { ...data, meal_typeID: mealId, recipe_ID: uuidv4(), owner_user_id: owner } });
  if (foods !== undefined) {
    if (existing) await tx.recipe_food_items.deleteMany({ where: { recipe_id: row.recipe_ID } });
    if (foods.length) await tx.recipe_food_items.createMany({ data: foods.map(item => ({ recipe_id: row.recipe_ID, food_item_id: item.id, quantity: item.quantity || null, notes: item.notes || null })) });
  }
  return row;
}
exports.create = async (req, res) => {
  try {
    const recipe = await prisma.$transaction(tx => saveRecipe(tx, req.body, req.userId), { isolationLevel: 'Serializable' });
    return res.status(201).json({ recipe: await withFoodItems(recipe) });
  } catch (error) { return recipeError(res, error); }
};
exports.update = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ message: 'Invalid recipe ID' });
  const recipe = await prisma.recipe.findUnique({ where: { idrecipe: id } });
  if (!recipe) return res.sendStatus(404);
  if (req.roles !== 'admin' && recipe.owner_user_id !== req.userId) return res.status(403).json({ message: 'You can only edit recipes that you created' });
  try {
    const updated = await prisma.$transaction(tx => saveRecipe(tx, req.body, req.userId, recipe), { isolationLevel: 'Serializable' });
    return res.json({ recipe: await withFoodItems(updated) });
  } catch (error) { return recipeError(res, error); }
};
exports.remove = async (req, res) => { const id = Number(req.params.id); const recipe = await prisma.recipe.findUnique({ where: { idrecipe: id } }); if (!recipe) return res.sendStatus(404); if (req.roles !== 'admin' && recipe.owner_user_id !== req.userId) return res.status(403).json({ message: 'You can only delete recipes that you created' }); await prisma.$transaction([prisma.recipe_food_items.deleteMany({ where: { recipe_id: recipe.recipe_ID } }), prisma.recipe.delete({ where: { idrecipe: id } })]); res.sendStatus(204); };
