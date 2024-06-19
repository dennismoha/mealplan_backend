// controllers/mealmealTypeController.js

const IndexQuery = require('../query_utiltity/index');

const indexQuery = new IndexQuery();

// This will return all the meal mealtypes that exists
exports.getAllMealMealTypes = async (req, res) => {
  const sql = `
    SELECT mealmealtype.meal_mealTypeID, meals.mealName, meals.mealId, mealtype.meal_name, mealtype.mealTypesId 
    FROM mealmealtype
    JOIN meals ON mealmealtype.mealsID = meals.mealId
    JOIN mealtype ON mealmealtype.mealTypeId = mealtype.mealTypesID
  `;

  try {
    const result = await indexQuery.getAll(sql);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/*  incase you want to create a new mealmealType this controller will handle
    fetching of the meals and mealTypes
*/

exports.getMealSelection = async (req, res) => {
  const mealsSql = 'SELECT mealId, mealName FROM meals';
  const mealTypesSql = 'SELECT mealTypesId, meal_name FROM mealtype';

  try {
    const meals = await indexQuery.getAll(mealsSql);
    const mealTypes = await indexQuery.getAll(mealTypesSql);

    res.json({ meals, mealTypes });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/*
  This controller handles inserting a new record of the mealmealtypes into the db

*/
exports.createMealInsertion = async (req, res) => {
  const { mealsId, mealTypeId } = req.body;
  const sql = 'INSERT INTO mealmealtype (mealsID, mealTypeId) VALUES (?, ?)';

  try {
    await indexQuery.insertNewRecord(sql, [mealsId, mealTypeId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating meal insertion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/*
  This controller handles returning of a single record of the mealmealtype

*/

exports.getSingleItem = async (req, res) => {
  const mealMealTypeId = req.params.id;
  const mealsSql = 'SELECT mealId, mealName FROM meals';
  const mealTypesSql = 'SELECT mealTypesId, meal_name FROM mealtype';
  const mealMealTypeSql = `
    SELECT mealmealtype.meal_mealTypeID, meals.mealName, meals.mealId, mealtype.meal_name, mealtype.mealTypesId 
    FROM mealmealtype
    JOIN meals ON mealmealtype.mealsID = meals.mealId
    JOIN mealtype ON mealmealtype.mealTypeId = mealtype.mealTypesID
    WHERE mealmealtype.meal_mealTypeID = ?
  `;

  try {
    const meals = await indexQuery.getAll(mealsSql);
    const mealTypes = await indexQuery.getAll(mealTypesSql);
    const mealMealType = await indexQuery.checkIfRecordExists(mealMealTypeSql, [mealMealTypeId]);

    res.json({ meals, mealTypes, mealMealType: mealMealType[0] });
  } catch (error) {
    console.error('Error retrieving single item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateSingleItem = async (req, res) => {
  const mealMealTypeId = req.params.id;
  const { mealsId, mealTypeId } = req.body;
  const sql = 'UPDATE `meal_plan`.`mealmealtype` SET `mealsID` = ?, `mealTypeID` = ? WHERE (`meal_mealTypeID` = ?);';

  // 'UPDATE mealmealtype SET mealsID = ? WHERE meal_mealTypeID = ?';

  try {
    await indexQuery.updateRecord(sql, [mealsId, mealTypeId, mealMealTypeId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteSingleItem = async (req, res) => {
  console.log('delete params id ', req.params);
  const mealMealTypeId = req.params.id;
  const sql = 'DELETE FROM mealmealtype WHERE meal_mealTypeID = ?';

  try {
    await indexQuery.deleteRecord(sql, [mealMealTypeId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting single item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
