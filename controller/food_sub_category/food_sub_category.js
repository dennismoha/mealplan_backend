// controllers/foodSubcategoryController.js
const { StatusCodes } = require('http-status-codes');
const {
    getSuccessMessage,
  } = require("#mealplan/middlewares/custom_success/sucess_message.js");
//const IndexQuery = require('#mealplan/globals/services/db/db_query_utilities.js');

const IndexQuery = require("#mealplan/globals/services/db/db_query_utilities.js");
const conflictError = require('#mealplan/middlewares/custom_errors/conflict_error.js');

// Create an instance of IndexQuery
const indexQuery = new IndexQuery();

// Get all food subcategories
exports.getAllFoodSubcategories = async (req, res) => {
  const sql = 'SELECT * FROM foodsubcategory';
  const results = await indexQuery.getAll(sql);
  res.status(StatusCodes.OK).send(getSuccessMessage(200, results));
};

// Get a single food subcategory by ID
exports.getSingleFoodSubcategory = async (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM foodsubcategory WHERE foodsubcategory_id = ?';
  const results = await indexQuery.checkIfRecordExists(sql, [id]);
  
  if (results.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Subcategory not found' });
  }
  
  res.status(StatusCodes.OK).send(getSuccessMessage(200, results[0]));
};

// Create a new food subcategory
exports.createFoodSubcategory = async (req, res) => {
  const { subcategory_name, description, food_category_id } = req.body;
  const checkIfExistsSql = 'SELECT * FROM foodsubcategory WHERE subcategory_name = ?';
  const existingResults = await indexQuery.checkIfRecordExists(checkIfExistsSql, [subcategory_name]);

  if (existingResults.length !== 0) {
   throw new conflictError("subcategory exists")
  }

  const insertSql = 'INSERT INTO foodsubcategory (subcategory_name, description, food_category_id) VALUES (?, ?, ?)';
  const result = await indexQuery.insertNewRecord(insertSql, [subcategory_name, description, food_category_id]);

  res.status(StatusCodes.CREATED).send(getSuccessMessage(201, { subcategory_name, description, food_category_id }));
};

// Update an existing food subcategory
exports.updateFoodSubcategory = async (req, res) => {
  const id = req.params.id;
  const { subcategory_name, description, food_category_id } = req.body;

  const checkIfExistsSql = 'SELECT * FROM foodsubcategory WHERE subcategory_name = ? AND foodsubcategory_id!= ?';
  const existingResults = await indexQuery.checkIfRecordExists(checkIfExistsSql, [subcategory_name, id]);

  if (existingResults.length !== 0) {
    throw new conflictError("sub category name arleady exists")
  }

  const updateSql = 'UPDATE foodsubcategory SET subcategory_name = ?, description = ?, food_category_id = ? WHERE foodsubcategory_id= ?';
  const result = await indexQuery.updateRecord(updateSql, [subcategory_name, description, food_category_id, id]);

  if (result.affectedRows === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Subcategory not found' });
  }

  res.status(StatusCodes.OK).send(getSuccessMessage(200, { id, subcategory_name, description, food_category_id }));
};

// Delete a food subcategory
exports.deleteFoodSubcategory = async (req, res) => {
  const id = req.params.id;
  const deleteSql = 'DELETE FROM foodsubcategory WHERE foodsubcategory_id = ?';
  const result = await indexQuery.deleteRecord(deleteSql, [id]);

  if (result.affectedRows === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Subcategory not found' });
  }

  return   res.status(StatusCodes.NO_CONTENT).send(getSuccessMessage(200, {}));
 
};
