const { validateLocalNames } = require("../../globals/helpers/food_local_names");
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
  UPDATEFOODITEMQUEUE,
  DELETEFOODITEMQUEUE,
} = require("#mealplan/constants.js");
const foodItemDB = require("#mealplan/globals/services/db/food_item_db.js");
const prisma = require("#mealplan/models/prisma.js");
const { upload } = require("#mealplan/config/cloudinary_upload.js");

// MediaRecorder commonly includes parameters such as `codecs=opus` in the
// MIME type: data:audio/webm;codecs=opus;base64,...
const isAudioDataUrl = value => (
  typeof value === "string" &&
  /^data:audio\/[a-z0-9.+-]+(?:;[^,;=]+=[^,;]+)*;base64,[a-z0-9+/=\s]+$/i.test(value)
);

const uploadAudio = audio => new Promise((resolve, reject) => {
  const separator = audio.indexOf(",");
  const buffer = Buffer.from(audio.slice(separator + 1), "base64");
  const stream = cloudinary.uploader.upload_stream(
    { resource_type: "video", folder: "mealplan/pronunciations" },
    (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    },
  );
  stream.end(buffer);
});

// Create a new food item

exports.createFoodItem = async (req, res) => {
  const english_name = (req.body.english_name || req.body.food_name)?.trim();
  // food_name remains populated as a compatibility alias for older clients.
  const food_name = english_name;
  const local_name = req.body.local_name?.trim() || null;
  let localNames;
  try {
    localNames = validateLocalNames(req.body.local_names);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  const countryIds = [...new Set(localNames.map(entry => entry.country_id))];
  const countries = await prisma.countries.findMany({ where: { id: { in: countryIds } }, select: { id: true } });
  if (countries.length !== countryIds.length) return res.status(400).json({ message: "Choose an existing country for every local name" });
  const category_id = req.body.category_id;
  const foodsubcategory_id = req.body.foodsubcategory_id;

  if (!english_name || !category_id || !foodsubcategory_id) {
    return res.status(400).json({ message: "English name, category, and subcategory are required" });
  }

  const subcategory = await prisma.foodsubcategory.findFirst({
    where: { foodsubcategory_id, food_category_id: category_id },
  });
  if (!subcategory) {
    return res.status(400).json({ message: "Choose a subcategory that belongs to the selected category" });
  }

  // Check if the food item already exists
  const existingFoodItem = await prisma.fooditems.findFirst({
    where: { OR: [{ english_name }, { food_name: english_name }] },
  });

  if (existingFoodItem) {
    throw new ConflictError("food resource exists");
  }

  const cacheId = uuidv4();
  let pronunciation = null;
  if (req.body.pronunciation_audio) {
    if (!isAudioDataUrl(req.body.pronunciation_audio)) {
      return res.status(400).json({ message: "The pronunciation recording is invalid" });
    }
    pronunciation = await uploadAudio(req.body.pronunciation_audio);
  }
  const uploaded = [];
  let foodItem;
  try {
    const namesWithAudio = [];
    for (const { pronunciation_audio, ...entry } of localNames) {
      if (pronunciation_audio) {
        const recording = await uploadAudio(pronunciation_audio);
        uploaded.push(recording.public_id);
        entry.pronunciation_url = recording.secure_url;
        entry.pronunciation_public_id = recording.public_id;
      }
      namesWithAudio.push(entry);
    }
    foodItem = await foodItemDB.addFoodItemToDB({
    food_name,
    english_name,
    local_name,
    local_names: { create: namesWithAudio },
    pronunciation_url: pronunciation?.secure_url || null,
    pronunciation_public_id: pronunciation?.public_id || null,
    descriptionl: req.body.descriptionl?.trim() || null,
    image_url: req.body.image_url?.trim() || null,
    category_id,
    foodsubcategory_id,
    fooditem_cacheID: cacheId,
  });

  } catch (error) {
    if (pronunciation?.public_id) uploaded.push(pronunciation.public_id);
    await Promise.allSettled(uploaded.map(public_id => cloudinary.uploader.destroy(public_id, { resource_type: "video" })));
    throw error;
  }

  // The database is authoritative. A cache outage must not roll back a valid
  // food item or cause the API to claim success before persistence finishes.
  await foodItemRedis.saveFoodItemToCache(cacheId, foodItem);
  return res.status(201).json({ message: "added food item", data: foodItem });
};

// Read complete food records from the database; legacy cache entries omit local names.
exports.getAllFoodItems = async (req, res) => {
  const result = await foodItemDB.fetchFoodItemsFromDb();

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

exports.savePronunciation = async (req, res) => {
  const audio = req.body.audio;
  if (!isAudioDataUrl(audio)) return res.status(400).json({ message: "A valid audio recording is required" });
  const food = await prisma.fooditems.findUnique({ where: { food_itemID: req.params.id } });
  if (!food) return res.status(404).json({ message: "Food item not found" });
  const result = await uploadAudio(audio);
  if (food.pronunciation_public_id) await cloudinary.uploader.destroy(food.pronunciation_public_id, { resource_type: "video", invalidate: true });
  const updated = await prisma.fooditems.update({ where: { food_itemID: req.params.id }, data: { pronunciation_url: result.secure_url, pronunciation_public_id: result.public_id } });
  return res.status(200).json({ message: "Pronunciation saved", data: updated });
};

exports.deletePronunciation = async (req, res) => {
  const food = await prisma.fooditems.findUnique({ where: { food_itemID: req.params.id } });
  if (!food) return res.status(404).json({ message: "Food item not found" });
  if (food.pronunciation_public_id) await cloudinary.uploader.destroy(food.pronunciation_public_id, { resource_type: "video", invalidate: true });
  await prisma.fooditems.update({ where: { food_itemID: req.params.id }, data: { pronunciation_url: null, pronunciation_public_id: null } });
  return res.status(200).json({ message: "Pronunciation deleted" });
};

exports.getPronunciation = async (req, res) => {
  const food = await prisma.fooditems.findUnique({
    where: { food_itemID: req.params.id },
    select: { pronunciation_url: true },
  });
  if (!food) return res.status(404).json({ message: "Food item not found" });
  return res.status(200).json({ pronunciation_url: food.pronunciation_url });
};

// Get a specific food item by ID
exports.getFoodItemById = async (req, res) => {
  const foodItem = await foodItemDB.fetchSingleFoodItemsFromDb(req.params.id);


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

// A name ID is always scoped to its food item to prevent cross-food updates.
exports.saveLocalNamePronunciation = async (req, res) => {
  const id = Number(req.params.nameId);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ message: "Invalid local name ID" });
  const audio = req.body.audio;
  if (audio !== null && !isAudioDataUrl(audio)) return res.status(400).json({ message: "A valid audio recording is required" });
  const name = await prisma.food_item_local_names.findFirst({ where: { id, food_item_id: req.params.id } });
  if (!name) return res.status(404).json({ message: "Local name not found" });
  const uploaded = audio === null ? null : await uploadAudio(audio);
  let updated;
  try {
    updated = await prisma.food_item_local_names.update({ where: { id }, data: {
      pronunciation_url: uploaded?.secure_url || null,
      pronunciation_public_id: uploaded?.public_id || null,
    }, include: { country: true } });
  } catch (error) {
    if (uploaded) await Promise.allSettled([cloudinary.uploader.destroy(uploaded.public_id, { resource_type: "video" })]);
    throw error;
  }
  if (name.pronunciation_public_id) await Promise.allSettled([cloudinary.uploader.destroy(name.pronunciation_public_id, { resource_type: "video", invalidate: true })]);
  return res.json({ data: updated });
};
