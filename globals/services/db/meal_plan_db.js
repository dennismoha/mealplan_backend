/* eslint-disable camelcase */
// const ConflictError = require('../../../middlewares/custom_errors/conflict_error');
const IndexQuery = require('#mealplan/globals/services/db/db_query_utilities.js');
const Query = require('./db_query_utilities');
const query = new Query();

class MealPlanDB {
  // Add new meal plan to database
  async addMealPlanToDB(data) {
    let insertMealPlanSql, insertMealPlan;

    // eslint-disable-next-line camelcase
    let { day_of_week, breakfast, morning_break, Lunch, evening_break, supper, mealplan_key } = data;

    /*
    check if a simmilar day exists in record for that mealplan week
    We can't have two days in a week . eg , two tuesdays in the same mealplan
  */

    let checkDayExists = `select * from mealplan where  day_of_week = ? and mealplan_key = ?;`;
    let mealPlanDaysCount = `select count(*) As mealplanfull from mealplan where mealplan_key = ?;`;

    // eslint-disable-next-line max-len
    insertMealPlanSql = `INSERT INTO mealplan (day_of_week,breakfast, morning_break, Lunch, evening_break, supper, mealplan_key) VALUES (?,?,?,?,?,?,?)`;

    /*
        count to see if that week has got 6 days, if number of week returned is greater than 6
        then that week is full else an extra day/days is remaining. count starts from 0

    */

    let daysCount = await query.checkIfRecordExists(mealPlanDaysCount, [mealplan_key]);

    if (daysCount[0].mealplanfull > 6) {
      throw new ConflictError('mealplan has got all days');
    }

    // check if a record exists with that mealPlanRecord name

    insertMealPlan = await query.checkIfRecordExists(checkDayExists, [day_of_week, mealplan_key]);
    if (insertMealPlan.length > 0) {
      throw new ConflictError('That day exists in the current meal plan');
    }

    // go on to create a new meal plan if above is fulfilled
    insertMealPlan = await query.insertNewRecord(
      insertMealPlanSql,
      // eslint-disable-next-line camelcase
      [day_of_week, breakfast, morning_break, Lunch, evening_break, supper, mealplan_key]
    );
  }

  // Select all meal plans from database
  async fetchMealPlansFromDb() {
    const sql = `SELECT 
    mealplantime.meal_plan_name AS mealplankey,
    mealplantime.idmealPlanWeek,
    JSON_OBJECT(
        'daysOfWeek',
        JSON_OBJECTAGG(
            mealplan.day_of_week,
            JSON_OBJECT(
                'breakfast', mealplan.breakfast,
                'morning_break', mealplan.morning_break,
                'lunch', mealplan.Lunch,
                'evening_break', mealplan.evening_break,
                'supper', mealplan.supper
            )
        )
    ) AS data
  FROM 
    mealplantime
  INNER JOIN 
    mealplan ON mealplantime.meal_plan_name = mealplan.mealplan_key
  GROUP BY 
    mealplan.mealplan_key;
  `;
    const result = await query.getAll(sql);
    return result;
  }

  // Select single meal plan from database
  async fetchSingleMealPlanFromDb(id) {
    const sql = 'SELECT * FROM mealplan WHERE meal_plan_id = ?';
    const params = [id];
    const result = await query.checkIfRecordExists(sql, params);
    return result;
  }

  // Update meal plan in database
  async updateMealPlanInDB(data) {
    const { day_of_week, breakfast, morning_break, Lunch, evening_break, supper, mealplan_key } = data;

    // Check if the new day_of_week already exists for the specified meal plan key
    const checkDayExistsSql = `SELECT * FROM mealplan WHERE day_of_week = ? AND mealplan_key = ?`;
    const existingDay = await query.checkIfRecordExists(checkDayExistsSql, [day_of_week, mealplan_key]);

    if (existingDay.length > 1) {
      throw new ConflictError('A meal plan already exists for the specified day');
    }

    // Update the meal plan entry
    const updateMealPlanSql = `
      UPDATE mealplan 
      SET day_of_week = ?, breakfast = ?, morning_break = ?, Lunch = ?, evening_break = ?, supper = ?, mealplan_key = ?
      WHERE day_of_week = ? AND mealplan_key = ?
    `;
    await query.updateRecord(updateMealPlanSql, [
      day_of_week,
      breakfast,
      morning_break,
      Lunch,
      evening_break,
      supper,
      mealplan_key,
      day_of_week,
      mealplan_key
    ]);
  }

  // Delete meal plan from database
  async deleteMealPlanInDb(mealplankey, day) {
    const sql = 'DELETE FROM mealplan WHERE mealplan_key = ? and day_of_week = ?';
    await query.deleteRecord(sql, [mealplankey, day]);
  }
}

 module.exports = MealPlanDB;