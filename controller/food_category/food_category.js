const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');
const { FoodCategory, FoodSubcategory } = require('../../models/orm');
const ConflictError = require('../../middlewares/custom_errors/conflict_error');
const { getSuccessMessage } = require('../../middlewares/custom_success/sucess_message');

exports.getAllFoodCategories = async (req, res) => res.status(200).send(getSuccessMessage(200, await FoodCategory.findAll({ order: [['category_name', 'ASC']], raw: true })));
exports.getSingleCategory = async (req, res) => res.status(200).send(getSuccessMessage(200, await FoodCategory.findOne({ where: { food_categoryID: req.params.id }, raw: true })));
exports.createFoodCategory = async (req, res) => {
  const { categoryName, description, imageURL } = req.body;
  if (await FoodCategory.findOne({ where: { category_name: categoryName } })) throw new ConflictError('Food category already exists');
  await FoodCategory.create({ category_name: categoryName, description, image_url: imageURL });
  res.status(StatusCodes.CREATED).send(getSuccessMessage(201, []));
};
exports.updateFoodCategory = async (req, res) => {
  const { categoryName, description, imageURL } = req.body; const id = req.params.id;
  if (await FoodCategory.findOne({ where: { category_name: categoryName, food_categoryID: { [Op.ne]: id } } })) throw new ConflictError('Food category already exists');
  await FoodCategory.update({ category_name: categoryName, description, image_url: imageURL }, { where: { food_categoryID: id } });
  const Category = await FoodCategory.findOne({ where: { food_categoryID: id }, raw: true });
  res.status(200).json({ message: 'Successfully updated the food category details', Category });
};
exports.deleteFoodCategory = async (req, res) => { await FoodCategory.destroy({ where: { food_categoryID: req.params.id } }); res.status(204).send(); };
exports.getFoodSubcategoryDetails = async (req, res) => res.status(200).json({ message: 'Data fetched successfully', data: await FoodCategory.findAll({ include: [{ model: FoodSubcategory, as: 'subcategories', required: false }], order: [['category_name', 'ASC']] }) });
