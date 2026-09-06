const { StatusCodes } = require('http-status-codes');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../../models/prisma');
const ConflictError = require('../../middlewares/custom_errors/conflict_error');
const { getSuccessMessage } = require('../../middlewares/custom_success/sucess_message');

exports.getAllFoodCategories = async (req, res) => res.status(200).send(getSuccessMessage(200, await prisma.foodcategory.findMany({ orderBy: { category_name: 'asc' } })));
exports.getSingleCategory = async (req, res) => res.status(200).send(getSuccessMessage(200, await prisma.foodcategory.findUnique({ where: { food_categoryID: req.params.id } })));
exports.createFoodCategory = async (req, res) => {
  const { categoryName, description, imageURL } = req.body;
  if (await prisma.foodcategory.findUnique({ where: { category_name: categoryName } })) throw new ConflictError('Food category already exists');
  await prisma.foodcategory.create({ data: { category_name: categoryName, description, image_url: imageURL, food_categoryID: uuidv4() } });
  res.status(StatusCodes.CREATED).send(getSuccessMessage(201, []));
};
exports.updateFoodCategory = async (req, res) => {
  const { categoryName, description, imageURL } = req.body; const id = req.params.id;
  if (await prisma.foodcategory.findFirst({ where: { category_name: categoryName, food_categoryID: { not: id } } })) throw new ConflictError('Food category already exists');
  const Category = await prisma.foodcategory.update({ data: { category_name: categoryName, description, image_url: imageURL }, where: { food_categoryID: id } });
  res.status(200).json({ message: 'Successfully updated the food category details', Category });
};
exports.deleteFoodCategory = async (req, res) => {
  if (await prisma.fooditems.count({ where: { category_id: req.params.id } }) || await prisma.foodsubcategory.count({ where: { food_category_id: req.params.id } })) return res.status(409).json({ message: 'Move or remove this category’s food items and subcategories before deleting it.' });
  try { await prisma.foodcategory.delete({ where: { food_categoryID: req.params.id } }); res.sendStatus(204); }
  catch (error) { if (error.code === 'P2003') return res.status(409).json({ message: 'This category is still referenced.' }); if (error.code === 'P2025') return res.status(404).json({ message: 'Category not found' }); throw error; }
};
exports.getFoodSubcategoryDetails = async (req, res) => {
  const rows = await prisma.foodcategory.findMany({ include: { foodsubcategory: true }, orderBy: { category_name: 'asc' } });
  const data = rows.map(({ foodsubcategory, ...category }) => ({ ...category, subcategories: foodsubcategory }));
  return res.status(200).json({ message: 'Data fetched successfully', data });
};
