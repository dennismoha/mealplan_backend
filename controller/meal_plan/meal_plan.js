/* eslint-disable camelcase */
// This contains logic for meal plans

const { StatusCodes } = require("http-status-codes");
const MealPlanDB = require("#mealplan/globals/services/db/meal_plan_db.js");
const IndexQuery = require("#mealplan/globals/services/db/db_query_utilities.js");
const {
  mealPlanRedis,
} = require("#mealplan/globals/services/redis/meal_plan.js");

const {
  getSuccessMessage,
} = require("#mealplan/middlewares/custom_success/sucess_message.js");
const mealPlanDB = new MealPlanDB();

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

  await mealPlanRedis.saveMealPlanToCache(meals);

  return res
    .status(StatusCodes.CREATED)
    .send(getSuccessMessage(201, [], "succesfully created a new meal Plan"));
};

//  update meal plans

exports.updateMealPlan = async (req, res) => {
  // save to db
  await mealPlanDB.updateMealPlanInDB(req.body);

  // we update the cache
  await mealPlanRedis.updateMealPlanInCache(req.body.mealplan_key, req.body);

  return res
    .status(StatusCodes.CREATED)
    .send(getSuccessMessage(200, [], "succesfully updated the meal Plan"));
};

//  update meal plans

exports.deleteMealPlan = async (req, res) => {
  // delete from db
  const { mealplankey, day } = req.params;
  await mealPlanDB.deleteMealPlanInDb(mealplankey, day);

  return res
    .status(StatusCodes.NO_CONTENT)
    .send(getSuccessMessage(StatusCodes.NO_CONTENT, [], "succesfully deleted"));
  
};
