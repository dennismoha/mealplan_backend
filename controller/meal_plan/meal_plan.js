/* eslint-disable camelcase */
// This contains logic for meal plans
const db = require('../../config/db');
const mealPlanDB = require('../../globals/services/db/meal_plan_db');
const { mealPlanRedis } = require('../../globals/services/redis/meal_plan');
const ConflictError = require('../../middlewares/custom_errors/conflict_error');
const IndexQuery = require('../query_utiltity/index');
const { StatusCodes } = require('http-status-codes');

// fetch all the mealplans.
exports.fetchMealPlans = async (req, res) => {
  // fetch it from cache
  let meals;

  // meals = await mealPlanRedis.getMealPlanFromCache();
  meals = null;

  if (meals === null) {
    // if cache miss, fetch it from db then cache
    //fetch from db
    meals = await mealPlanDB.fetchMealPlansFromDb();

    // save the mealplans to cache
    await mealPlanRedis.saveMealPlanToCache(meals);
  }

  return res.status(StatusCodes.OK).json({ meals });
};

// creating a new meal plan record

exports.createANewMealPlan = async (req, res) => {
  // save meal plan to db
  await mealPlanDB.addMealPlanToDB(req.body);
  let meals = await mealPlanDB.fetchMealPlansFromDb();
  // console.log('meals upon creating is ', meals);
  console.log('req. body is ', req.body);
  await mealPlanRedis.saveMealPlanToCache(meals);

  return res.status(StatusCodes.OK).json({ message: 'succesfully created a new meal Plan' });
};

//  update meal plans

exports.updateMealPlan = async (req, res) => {
  // save to db
  await mealPlanDB.updateMealPlanInDB(req.body);

  // we update the cache
  const results = await mealPlanRedis.updateMealPlanInCache(req.body.mealplan_key, req.body);

  return res.status(StatusCodes.OK).json({ message: 'succesfully updated the meal Plan', results });
};

//  update meal plans

exports.deleteMealPlan = async (req, res) => {
  // delete from db
  const { mealplankey, day } = req.params;
  await mealPlanDB.deleteMealPlanInDb(mealplankey, day);
  return res.status(StatusCodes.NO_CONTENT).json({ message: 'succesfully deleted' });
};
