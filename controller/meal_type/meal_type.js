const { v4: uuidv4 } = require('uuid');
const prisma = require('../../models/prisma');
const includeDetails = { combination_items: { orderBy: { display_order: 'asc' } }, meal_type_food_items: { include: { fooditems: true } }, meal_type_preparation_sources: true, meal_type_images: { orderBy: { image_order: 'asc' } }, recipe: true };
const canEdit = (req, meal) => req.roles === 'admin' || meal.owner_user_id === req.userId;
const invalid = message => { throw Object.assign(new Error(message), { status: 400 }); };
const replyError = (res, error) => {
  if (error.status) return res.status(error.status).json({ message: error.message });
  if (['P2002','P2003','P2034'].includes(error.code)) return res.status(409).json({ message: 'This meal name is taken, a referenced record changed, or the meal is still in use.' });
  throw error;
};
exports.fetchMealTypes = async (req, res) => res.json(await prisma.mealtype.findMany({ include: includeDetails, orderBy: { meal_name: 'asc' } }));
exports.getMeal = async (req, res) => { const meal = await prisma.mealtype.findUnique({ where: { mealTypesID: req.params.id }, include: includeDetails }); return meal ? res.json({ data: meal }) : res.status(404).json({ message: 'Meal not found' }); };
async function save(req, res, editing) {
  try {
    const existing = editing ? await prisma.mealtype.findUnique({ where: { mealTypesID: req.params.id } }) : null;
    if (editing && !existing) return res.status(404).json({ message: 'Meal not found' });
    if (existing && !canEdit(req, existing)) return res.status(403).json({ message: 'Only the dish author or an administrator can edit it' });
    if (existing?.meal_kind === 'combination') invalid('Use the combination editor for this meal');
    const body = req.body;
    const data = {};
    const name = body.mealName ?? body.meal_name ?? existing?.meal_name;
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 255) invalid('Meal name is required (maximum 255 characters)');
    data.meal_name = name.trim();
    for (const field of ['local_name','description','image_url','video_url','pronunciation_url']) if (body[field] !== undefined) {
      if (body[field] !== null && typeof body[field] !== 'string') invalid(`Invalid ${field}`);
      data[field] = body[field]?.trim() || null;
    }
    if (body.servings !== undefined) { if (!Number.isInteger(body.servings) || body.servings < 1 || body.servings > 10000) invalid('Servings must be a positive whole number'); data.servings = body.servings; }
    if (body.country_id !== undefined) {
      if (body.country_id !== null && (!Number.isInteger(body.country_id) || !await prisma.countries.findUnique({ where: { id: body.country_id } }))) invalid('Choose an existing country');
      data.country_id = body.country_id;
    }
    if (!editing || body.foodItems !== undefined) {
      const foods = body.foodItems;
      if (!Array.isArray(foods) || !foods.length) invalid('Choose at least one food item');
      const ids = foods.map(f => f?.food_item_id);
      if (ids.some(id => typeof id !== 'string') || new Set(ids).size !== ids.length || await prisma.fooditems.count({ where: { food_itemID: { in: ids } } }) !== ids.length) invalid('Choose distinct existing food items');
      const create = foods.map(f => {
        if (f.grams != null && (!Number.isFinite(Number(f.grams)) || Number(f.grams) <= 0)) invalid('Ingredient grams must be positive');
        return { food_item_id: f.food_item_id, quantity: f.quantity || null, unit: f.unit || null, preparation_notes: f.preparation_notes || null, grams: f.grams == null || f.grams === '' ? null : Number(f.grams) };
      });
      data.meal_type_food_items = { ...(editing ? { deleteMany: {} } : {}), create };
    }
    if (body.preparationSources !== undefined) {
      if (!Array.isArray(body.preparationSources)) invalid('Invalid preparation sources');
      data.meal_type_preparation_sources = { ...(editing ? { deleteMany: {} } : {}), create: body.preparationSources.map(s => { if (!s || typeof s.source_url !== 'string' || !/^https?:\/\//i.test(s.source_url)) invalid('Use HTTP or HTTPS preparation links'); return { source_type: s.source_type || 'other', source_url: s.source_url, title: s.title || null }; }) };
    }
    if (body.mealImages !== undefined) {
      if (!Array.isArray(body.mealImages)) invalid('Invalid image list');
      data.meal_type_images = { ...(editing ? { deleteMany: {} } : {}), create: body.mealImages.map((image, image_order) => { const image_url = typeof image === 'string' ? image : image.image_url; if (typeof image_url !== 'string' || !/^https?:\/\//i.test(image_url)) invalid('Use HTTP or HTTPS image URLs'); return { image_url, image_order }; }) };
    }
    const meal = await prisma.$transaction(async tx => {
      const row = editing ? await tx.mealtype.update({ where: { mealTypesID: existing.mealTypesID }, data, include: includeDetails }) : await tx.mealtype.create({ data: { ...data, mealTypesID: uuidv4(), owner_user_id: req.userId }, include: includeDetails });
      if (body.country_id !== undefined) {
        if (existing?.country_id && existing.country_id !== body.country_id) await tx.meal_type_countries.deleteMany({ where: { meal_type_id: row.mealTypesID, country_id: existing.country_id } });
        if (body.country_id && !await tx.meal_type_countries.findFirst({ where: { meal_type_id: row.mealTypesID, country_id: body.country_id } })) await tx.meal_type_countries.create({ data: { meal_type_id: row.mealTypesID, country_id: body.country_id } });
      }
      return row;
    });
    return res.status(editing ? 200 : 201).json({ data: meal, message: 'Meal saved' });
  } catch (error) { return replyError(res, error); }
}
exports.createNewMealType = (req, res) => save(req, res, false);
exports.saveEditMealType = (req, res) => save(req, res, true);
exports.deleteMealType = async (req, res) => {
  try {
    await prisma.$transaction(async tx => {
      const meal = await tx.mealtype.findUnique({ where: { mealTypesID: req.params.id } });
      if (!meal) throw Object.assign(new Error('Meal not found'), { status: 404 });
      if (!canEdit(req, meal)) throw Object.assign(new Error('Only the author or an administrator can delete this meal'), { status: 403 });
      const planRefs = ['breakfast','morning_break','lunch','evening_break','supper'].flatMap(slot => [{ [`${slot}_id`]: meal.mealTypesID }, { [slot === 'lunch' ? 'Lunch' : slot]: meal.meal_name }]);
      if (await tx.meal_combination_items.count({ where: { dish_id: meal.mealTypesID } }) || await tx.mealplan.count({ where: { OR: planRefs } }) || await tx.recipe.count({ where: { meal_typeID: meal.mealTypesID } })) throw Object.assign(new Error('Remove this meal from plans and combinations, and delete its recipe before deleting it.'), { status: 409 });
      await tx.meal_type_countries.deleteMany({ where: { meal_type_id: meal.mealTypesID } });
      await tx.mealtype.delete({ where: { mealTypesID: meal.mealTypesID } });
    }, { isolationLevel: 'Serializable' });
    return res.json({ message: 'Meal deleted' });
  } catch (error) { return replyError(res, error); }
};
