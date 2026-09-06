const { v4: uuidv4 } = require('uuid');
const prisma = require('../../models/prisma');
const { getSuccessMessage } = require('../../middlewares/custom_success/sucess_message');
exports.getAllFoodSubcategories = async (req, res) => res.json(getSuccessMessage(200, await prisma.foodsubcategory.findMany({ orderBy: { subcategory_name: 'asc' } })));
exports.getSingleFoodSubcategory = async (req, res) => { const row = await prisma.foodsubcategory.findUnique({ where: { foodsubcategory_id: req.params.id } }); return row ? res.json(getSuccessMessage(200, row)) : res.status(404).json({ message: 'Subcategory not found' }); };
const failure = (res, error) => { if (['P2002','P2003','P2025'].includes(error.code)) return res.status(error.code === 'P2025' ? 404 : 409).json({ message: 'Subcategory name is taken, the record is missing, or it is still in use.' }); throw error; };
async function save(req, res, editing) {
  const { subcategory_name, food_category_id, description } = req.body;
  if (typeof subcategory_name !== 'string' || !subcategory_name.trim() || subcategory_name.trim().length > 45 || typeof food_category_id !== 'string') return res.status(400).json({ message: 'A name (up to 45 characters) and category are required' });
  if (!await prisma.foodcategory.findUnique({ where: { food_categoryID: food_category_id } })) return res.status(400).json({ message: 'Choose an existing category' });
  const data = { subcategory_name: subcategory_name.trim(), food_category_id, description: typeof description === 'string' ? description.trim() || null : null };
  try {
    const row = await prisma.$transaction(async tx => {
      const row = editing ? await tx.foodsubcategory.update({ where: { foodsubcategory_id: req.params.id }, data }) : await tx.foodsubcategory.create({ data: { ...data, foodsubcategory_id: uuidv4() } });
      if (editing) await tx.fooditems.updateMany({ where: { foodsubcategory_id: req.params.id }, data: { category_id: food_category_id } });
      return row;
    });
    res.status(editing ? 200 : 201).json(getSuccessMessage(editing ? 200 : 201, row));
  } catch (error) { return failure(res, error); }
}
exports.createFoodSubcategory = (req, res) => save(req, res, false);
exports.updateFoodSubcategory = (req, res) => save(req, res, true);
exports.deleteFoodSubcategory = async (req, res) => {
  if (await prisma.fooditems.count({ where: { foodsubcategory_id: req.params.id } })) return res.status(409).json({ message: 'Move or remove this subcategory’s food items before deleting it.' });
  try { await prisma.foodsubcategory.delete({ where: { foodsubcategory_id: req.params.id } }); return res.sendStatus(204); } catch (error) { return failure(res, error); }
};
