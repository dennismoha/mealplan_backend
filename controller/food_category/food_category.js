/* eslint-disable camelcase */
// foodCategoryController.js

const categoryQueue = require("../../globals/services/queues/category_queue");
const {
  categoryRedis,
} = require("../../globals/services/redis/food_category_redis");
const FoodCategoryQuery = require("../query_utiltity/index");
const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const ConflictError = require("../../middlewares/custom_errors/conflict_error");
const foodCategory = require("../../globals/services/db/food_category_db");
const { CATEGORY_UPDATE, CATEGORY_DELETE } = require("../../constants");
const databaseError = require("#mealplan/middlewares/custom_errors/database_error.js");
const {
  getSuccessMessage,
} = require("#mealplan/middlewares/custom_success/sucess_message.js");

const foodCategoryQuery = new FoodCategoryQuery();

exports.getAllFoodCategories = async (req, res) => {
  const sql = "SELECT * FROM foodcategory";

  const foodcategory = await foodCategoryQuery.getAll(sql);
  res.status(StatusCodes.OK).send(getSuccessMessage(200, foodcategory));
};

/*

    get single category
    first check in cache if the category is cached.
    if not cached a cache miss will occure, go to the db
    if cached, a cache hit will occur, return the data

*/

exports.getSingleCategory = async (req, res) => {
  let id = req.params.id;
  let Category = await categoryRedis.selectSingleCategoryFromCache(id);

  // check for cache miss
  if (_.isEmpty(Category)) {
    // fetch from the database if there is a cachemiss
    Category = await foodCategory.fetchSingleCategoryFromDb(id);
    // if it exists we cache it
    await categoryRedis.saveCategoryToCache(id, Category);
  }
  //return directly if there is cache hit
  // res.status(StatusCodes.OK).json({ message: 'success', category: Category });
  res.status(StatusCodes.OK).send(getSuccessMessage(200, Category));
};

exports.createFoodCategory = async (req, res) => {
  const { categoryName, description, imageURL } = req.body;
  console.log("checking if category exists before saving");
  // Check if the food category already exists
  const checkIfExistsSql = "SELECT * FROM foodcategory WHERE category_name = ?";
  const existingFoodCategory = await foodCategoryQuery.checkIfRecordExists(
    checkIfExistsSql,
    [categoryName]
  );

  console.log("existing food category is ", existingFoodCategory);
  if (existingFoodCategory.length !== 0) {
    throw new ConflictError("Food category already exists");
  }

  categoryQueue.addCategoryJob("addCategoriesToDb", req.body);
  res.status(StatusCodes.CREATED).send(getSuccessMessage(201, []));
};

exports.updateFoodCategory = async (req, res) => {
  const { categoryName } = req.body;
  let id = req.params.id;
  let Category;
  // Check if the updated food category name already exists
  const checkIfExistsSql =
    "SELECT * FROM foodcategory WHERE category_name = ? AND food_categoryID != ?";
  const existingFoodCategory = await foodCategoryQuery.checkIfRecordExists(
    checkIfExistsSql,
    [categoryName, id]
  );

  if (existingFoodCategory.length !== 0) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: "Food category already exists" });
  }

  /*
    I avoided using Queues since I'll be forced to queue the whole chain for proper updates.
      //let categoryData = await categoryQueue.addCategoryJob(CATEGORY_UPDATE, { id, data: req.body });
  */

  await foodCategory.updateCategoryInDB({ id, data: req.body });

  // check if category exists on cache to update it
  let numberOfCategoriesInSet =
    await categoryRedis.checkIfCategoryExistsOnCache(id);

  if (!numberOfCategoriesInSet) {
    // we return and not cache since it's not arleady cached
    Category = await foodCategory.fetchSingleCategoryFromDb(id);
    return res
      .status(StatusCodes.OK)
      .json({
        message: "succesfully updated the food category detaisl",
        Category,
      });
  }

  // if it exists we  update the cache
  Category = await foodCategory.fetchSingleCategoryFromDb(id);

  await categoryRedis.saveCategoryToCache(id, Category);

  res
    .status(StatusCodes.OK)
    .json({
      message: "succesfully updated the food category detaisl",
      Category,
    });
};

exports.deleteFoodCategory = async (req, res) => {
  let id = req.params.id;

  // first check if it's cached

  // check if category exists on cache to update it
  let numberOfCategoriesInSet =
    await categoryRedis.checkIfCategoryExistsOnCache(id);

  if (numberOfCategoriesInSet) {
    // we remove it since it's cached
    await categoryRedis.deleteSingleCategoryFromCache(id);
  }

  await categoryQueue.addCategoryJob(CATEGORY_DELETE, { id });

  res.status(StatusCodes.NO_CONTENT).json({ message: "Deleted food category" });
};
