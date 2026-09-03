const { Op } = require('sequelize');
const { FoodSubcategory } = require('../../models/orm');
const ConflictError = require('../../middlewares/custom_errors/conflict_error');
const { getSuccessMessage } = require('../../middlewares/custom_success/sucess_message');

exports.getAllFoodSubcategories = async (req, res) => res.status(200).send(getSuccessMessage(200, await FoodSubcategory.findAll({ order: [['subcategory_name', 'ASC']], raw: true })));
exports.getSingleFoodSubcategory = async (req, res) => { const row = await FoodSubcategory.findOne({ where: { foodsubcategory_id: req.params.id }, raw: true }); return row ? res.status(200).send(getSuccessMessage(200, row)) : res.status(404).json({ error: 'Subcategory not found' }); };
exports.createFoodSubcategory = async (req, res) => { const data = req.body; if (await FoodSubcategory.findOne({ where: { subcategory_name: data.subcategory_name } })) throw new ConflictError('Subcategory exists'); const row = await FoodSubcategory.create(data); res.status(201).send(getSuccessMessage(201, row)); };
exports.updateFoodSubcategory = async (req, res) => { const id = req.params.id; const data = req.body; if (await FoodSubcategory.findOne({ where: { subcategory_name: data.subcategory_name, foodsubcategory_id: { [Op.ne]: id } } })) throw new ConflictError('Subcategory name already exists'); const [changed] = await FoodSubcategory.update(data, { where: { foodsubcategory_id: id } }); return changed ? res.status(200).send(getSuccessMessage(200, { id, ...data })) : res.status(404).json({ error: 'Subcategory not found' }); };
exports.deleteFoodSubcategory = async (req, res) => { const changed = await FoodSubcategory.destroy({ where: { foodsubcategory_id: req.params.id } }); return changed ? res.status(204).send() : res.status(404).json({ error: 'Subcategory not found' }); };
