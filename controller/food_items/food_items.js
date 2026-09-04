/* eslint-disable camelcase */
const { StatusCodes } = require("http-status-codes");
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require("uuid");
const {
  getSuccessMessage,
} = require("#mealplan/middlewares/custom_success/sucess_message.js");

const ConflictError = require("#mealplan/middlewares/custom_errors/conflict_error.js");

const winstonLogger = require("#mealplan/config/winston_logger.js");

const {
  foodItemRedis,
} = require("#mealplan/globals/services/redis/food_item_cache.js");
const foodItemQueue = require("#mealplan/globals/services/queues/food-item.js");
const {
  FOOD_ITEM_SET,
  UPDATEFOODITEMQUEUE,
  DELETEFOODITEMQUEUE,
} = require("#mealplan/constants.js");
const foodItemDB = require("#mealplan/globals/services/db/food_item_db.js");
const prisma = require("#mealplan/models/prisma.js");
const { upload } = require("#mealplan/config/cloudinary_upload.js");

// Create a new food item

exports.createFoodItem = async (req, res) => {
  const food_name = req.body.food_name?.trim();
  const category_id = req.body.category_id;
  const foodsubcategory_id = req.body.foodsubcategory_id;

  if (!food_name || !category_id || !foodsubcategory_id) {
    return res.status(400).json({ message: "Food name, category, and subcategory are required" });
  }

  const subcategory = await prisma.foodsubcategory.findFirst({
    where: { foodsubcategory_id, food_category_id: category_id },
  });
  if (!subcategory) {
    return res.status(400).json({ message: "Choose a subcategory that belongs to the selected category" });
  }

  // Check if the food item already exists
  const existingFoodItem = await prisma.fooditems.findUnique({ where: { food_name } });

  if (existingFoodItem) {
    throw new ConflictError("food resource exists");
  }

  const cacheId = uuidv4();
  const foodItem = await foodItemDB.addFoodItemToDB({
    food_name,
    descriptionl: req.body.descriptionl?.trim() || null,
    image_url: req.body.image_url?.trim() || null,
    category_id,
    foodsubcategory_id,
    fooditem_cacheID: cacheId,
  });

  // The database is authoritative. A cache outage must not roll back a valid
  // food item or cause the API to claim success before persistence finishes.
  await foodItemRedis.saveFoodItemToCache(cacheId, foodItem);
  return res.status(201).json({ message: "added food item", data: foodItem });
};

/*
      Get all food items
      fetch from cache if not available fetch from db
*/
exports.getAllFoodItems = async (req, res) => {
  // will add pagination later
  let result = await foodItemRedis.selectAllFoodItemFromCache(
    FOOD_ITEM_SET,
    0,
    -1
  );

  if (result.length === 0) {
    result = await foodItemDB.fetchFoodItemsFromDb();
  }

  return res
    .status(StatusCodes.OK)
    .send(
      getSuccessMessage(200, {
        result 
      })
    );  
};

exports.createFoodItemImage = async(req,res) =>{
  const image = req.body.image;

  try {
    const result =await upload(image)
    if(!result.public_id){
      throw new Error('Error uploading image')
    }
    console.log('image result is ', result)


  
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(result.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
  });
  
  console.log(optimizeUrl);
  
  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url(result.public_id, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
  });
  
  console.log(autoCropUrl);
  
    return res.status(200).json({result, autoCropUrl, optimizeUrl})
  } catch (error) {
    console.log('error is ', error);
    return
  }
 

  

}

// Get a specific food item by ID
exports.getFoodItemById = async (req, res) => {
  // get food item from cache
  let foodItem = await foodItemRedis.selectSingleFoodItemFromCache(
    req.params.id
  );
  console.log('food item length is ', foodItem)
  ///fetch from db if items is 0
  if (foodItem.length === 0) {
    console.log('fetching from db')
    foodItem = await foodItemDB.fetchSingleFoodItemsFromDb(req.params.id);
  }


  return res
    .status(StatusCodes.OK)
    .send(
      getSuccessMessage(200, {
        foodItem
      })
    ); 
 
};

// Update a food item by ID
exports.updateFoodItemById = async (req, res) => {
  // Check if the food item already exists
  const existingFoodItem = await prisma.fooditems.findMany({ select: { food_name: true, category_id: true, fooditem_cacheID: true }, where: { food_name: req.body.food_name } });

  console.log("existing food item is ", existingFoodItem);

  if (existingFoodItem.length > 1) {
    // Food item with the same name or ID already exists
    throw new ConflictError("food resource exists");
  }

  if (existingFoodItem.length === 1) {
    let { food_name, category_id } = existingFoodItem[0];

    if (
      food_name === req.body.food_name &&
      category_id === req.body.category_id
    ) {
      // update cache first
      let updateCache = await foodItemRedis.updateSingleFoodInFromCache(
        req.body
      );

      // update the db

      await foodItemQueue.addFoodItemJob(UPDATEFOODITEMQUEUE, req.body);

      res
        .status(200)
        .json({ message: "Food item updated successfully", updateCache });
    }
  }
};

// Delete a food item by ID
exports.deleteFoodItemById = async (req, res) => {
  // delete id from cache

  await foodItemRedis.deleteSingleFoodItemFromCache(req.params.id);

  await foodItemQueue.addFoodItemJob(DELETEFOODITEMQUEUE, req.params.id);

  res.status(200).json({ message: "Food item deleted successfully" });
};
