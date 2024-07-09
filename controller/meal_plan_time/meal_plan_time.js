// mealplantimeController.js

const IndexQuery = require('#mealplan/globals/services/db/db_query_utilities.js')


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
    return res.status(400).json({ message: 'Meal plan with the same name already exists' });
  }

  const insertMealplanSql = 'INSERT INTO mealplantime (meal_plan_name) VALUES (?)';

  try {
    await indexQuery.insertNewRecord(insertMealplanSql, [mealPlanName]);
    res.status(201).json({ message: 'successfully created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMealplanTime = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { mealPlanName, mealplantime_ID } = req.body;
  // eslint-disable-next-line camelcase
  let id = mealplantime_ID;

  // Check if the meal plan already exists
  // const checkIfMealplanExistsSql = 'SELECT * FROM mealplantime WHERE meal_plan_name = ?';
  // const existingMealplan = await indexQuery.checkIfRecordExists(checkIfMealplanExistsSql, [mealPlanName]);

  // if (existingMealplan.length !== 0) {
  //   return res.status(400).json({ message: 'Meal plan with the same name already exists' });
  // }

  const updateMealplanSql = 'UPDATE mealplantime SET meal_plan_name = ? WHERE  mealplantime_ID = ?';

  try {
    await indexQuery.updateRecord(updateMealplanSql, [mealPlanName, id]);
    res.json({ message: 'meal plan updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
