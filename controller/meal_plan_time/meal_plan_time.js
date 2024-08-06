// mealplantimeController.js

const IndexQuery = require('#mealplan/globals/services/db/db_query_utilities.js');
const conflictError = require('#mealplan/middlewares/custom_errors/conflict_error.js');
const { getSuccessMessage } = require('#mealplan/middlewares/custom_success/sucess_message.js');
const { StatusCodes } = require('http-status-codes');

const indexQuery = new IndexQuery();

exports.getAllMealplanTimes = async (req, res) => {
  const sql = 'SELECT * FROM mealplantime';
  try {
    const mealplanTimes = await indexQuery.getAll(sql);
    res.json(mealplanTimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMealplanTime = async (req, res) => {
  let id = req.params.id;
  const sql = 'SELECT * FROM mealplantime WHERE mealplantime_ID = ?';

  try {
    const mealplanTime = await indexQuery.checkIfRecordExists(sql, [id]);

    if (mealplanTime.length === 0) {
      return res.status(404).json({ message: 'meal plan time resource not exisrs' });
    }
    return res.json(mealplanTime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMealplanTime = async (req, res) => {
  const { mealPlanName } = req.body;

  // Check if the meal plan already exists
  const checkIfMealplanExistsSql = 'SELECT * FROM mealplantime WHERE meal_plan_name = ?';
  const existingMealplan = await indexQuery.checkIfRecordExists(checkIfMealplanExistsSql, [mealPlanName]);

  console.log('existing meal plan is ', existingMealplan);
  if (existingMealplan.length !== 0) {
    throw new conflictError('Meal plan with the same name already exists');
    //return res.status(400).json({ message: 'Meal plan with the same name already exists' });
  }

  const insertMealplanSql = 'INSERT INTO mealplantime (meal_plan_name) VALUES (?)';

  
    await indexQuery.insertNewRecord(insertMealplanSql, [mealPlanName]);
    res.status(StatusCodes.CREATED).send(getSuccessMessage(201,[], 'succesfully created a new meal Plan time interval resource' ));
  
};

exports.updateMealplanTime = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { mealPlanName, mealplantime_ID } = req.body;
  // eslint-disable-next-line camelcase
  let id = req.params.id;

  // Check if the meal plan already exists
  const checkIfMealplanExistsSql = 'SELECT * FROM mealplantime WHERE meal_plan_name = ?';
  const existingMealplan = await indexQuery.checkIfRecordExists(checkIfMealplanExistsSql, [mealPlanName]);

  if (existingMealplan.length !== 0) {
    throw new conflictError('Meal plan time with the same name already exists');
    return res.status(400).json({ message: 'Meal plan with the same name already exists' });
  }

  const updateMealplanSql = 'UPDATE mealplantime SET meal_plan_name = ? WHERE  idmealPlanWeek = ?';

 
    await indexQuery.updateRecord(updateMealplanSql, [mealPlanName, id]);
    res.status(StatusCodes.OK).send(getSuccessMessage(200,[], 'succesfully updated' ));
    //res.json({ message: 'meal plan updated successfully' });
 
};

exports.deleteMealplanTime = async (req, res) => {
  let id = req.params.id;
  const sql = 'DELETE FROM mealplantime WHERE  mealplantime_ID  = ?';

  try {
    await indexQuery.deleteRecord(sql, [id]);
    res.json({ message: 'Deleted meal plan time' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
