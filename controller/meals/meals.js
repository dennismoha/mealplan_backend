const { v4: uuidv4 } = require('uuid');
const prisma = require('../../models/prisma');
const { getSuccessMessage } = require('../../middlewares/custom_success/sucess_message');
const BadRequestError = require('../../middlewares/custom_errors/bad_request');
const DatabaseError = require('../../middlewares/custom_errors/database_error');

const sendSuccess = (res, statusCode, message, data) => res
  .status(statusCode)
  .send({ ...getSuccessMessage(statusCode, data, message), message });

const sendError = (res, error) => res
  .status(error.statusCode || 500)
  .send({ errors: error.serializeErrors() });

const mealIdWhere = (id) => {
  const numericId = Number(id);

  return Number.isInteger(numericId) && numericId > 0
    ? { OR: [{ mealID: id }, { Id: numericId }] }
    : { mealID: id };
};

const validateFoodItems = (foodItems) => {
  if (!Array.isArray(foodItems)) {
    throw new BadRequestError('Food items must be an array');
  }
  if (foodItems.some(item => !item || typeof item.food_item_id !== 'string' || !item.food_item_id.trim())) {
    throw new BadRequestError('Each food item must have a food_item_id');
  }
  const ids = foodItems.map(item => item.food_item_id.trim());
  if (new Set(ids).size !== ids.length) {
    throw new BadRequestError('Food items cannot contain duplicate food_item_id values');
  }
};

const validateSources = (sources) => {
  if (!Array.isArray(sources)) {
    throw new BadRequestError('Preparation sources must be an array');
  }
  if (sources.some(source => !source || !source.source_url || !source.source_type)) {
    throw new BadRequestError('Each source must have source_url and source_type');
  }
};

const validateImages = (images) => {
  if (!Array.isArray(images)) {
    throw new BadRequestError('Meal images must be an array');
  }
  if (images.some(image => typeof image === 'string'
    ? !image.trim()
    : !image || typeof image.image_url !== 'string' || !image.image_url.trim())) {
    throw new BadRequestError('Each meal image must have an image_url');
  }
};

/**
 * Create a new meal with food items, images, and preparation sources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createMeal = async (req, res) => {
  try {
    const {
      mealName,
      local_name,
      description,
      image_url,
      video_url,
      pronunciation_url,
      country_id,
      foodItems = [],
      preparationSources = [],
      mealImages = []
    } = req.body;

    // Validate required fields
    if (!mealName || mealName.trim() === '') {
      throw new BadRequestError('Meal name is required');
    }
    validateFoodItems(foodItems);
    validateSources(preparationSources);
    validateImages(mealImages);

    // Check if meal already exists
    const existing = await prisma.meals.findUnique({
      where: { mealName }
    });

    if (existing) {
      throw new BadRequestError('Meal with this name already exists');
    }

    // Create meal with all related data
    const mealID = uuidv4();
    const meal = await prisma.meals.create({
      data: {
        mealName: mealName.trim(),
        mealID,
        local_name: local_name || null,
        description: description || null,
        image_url: image_url || null,
        video_url: video_url || null,
        pronunciation_url: pronunciation_url || null,
        country_id: country_id || null,
        // Create associated food items
        meal_food_items: {
          create: foodItems.map(item => ({
            food_item_id: item.food_item_id,
            quantity: item.quantity || null,
            unit: item.unit || null,
            preparation_notes: item.preparation_notes || null
          }))
        },
        // Create preparation sources
        meal_preparation_sources: {
          create: preparationSources.map(source => ({
            source_type: source.source_type || 'youtube',
            source_url: source.source_url,
            title: source.title || null
          }))
        },
        // Create meal images
        meal_images: {
          create: mealImages.map((image, index) => ({
            image_url: image.image_url || image,
            image_order: image.image_order !== undefined ? image.image_order : index
          }))
        }
      },
      include: {
        meal_food_items: { include: { fooditems: true } },
        meal_preparation_sources: true,
        meal_images: {
          orderBy: { image_order: 'asc' }
        }
      }
    });

    return sendSuccess(res, 201, 'Meal created successfully', meal);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return sendError(res, error);
    }
    const dbError = new DatabaseError('Failed to create meal', error.message);
    return sendError(res, dbError);
  }
};

/**
 * Get all meals with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllMeals = async (req, res) => {
  try {
    const { includeDetails = 'false' } = req.query;
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);
    const shouldIncludeDetails = includeDetails === 'true';

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestError('Limit must be an integer between 1 and 100');
    }
    if (!Number.isInteger(offset) || offset < 0) {
      throw new BadRequestError('Offset must be a non-negative integer');
    }

    const meals = await prisma.meals.findMany({
      skip: offset,
      take: limit,
      include: shouldIncludeDetails ? {
        meal_food_items: { include: { fooditems: true } },
        meal_preparation_sources: true,
        meal_images: {
          orderBy: { image_order: 'asc' }
        }
      } : false,
      orderBy: { mealName: 'asc' }
    });

    const total = await prisma.meals.count();

    return sendSuccess(res, 200, 'Meals retrieved successfully', {
        meals,
        pagination: {
          total,
          limit,
          offset,
          pages: Math.ceil(total / limit)
        }
      });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return sendError(res, error);
    }
    const dbError = new DatabaseError('Failed to retrieve meals', error.message);
    return sendError(res, dbError);
  }
};

/**
 * Get meal by ID with all details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMealById = async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await prisma.meals.findFirst({
      where: mealIdWhere(id),
      include: {
        meal_food_items: { include: { fooditems: true } },
        meal_preparation_sources: true,
        meal_images: {
          orderBy: { image_order: 'asc' }
        }
      }
    });

    if (!meal) {
      throw new BadRequestError('Meal not found');
    }

    return sendSuccess(res, 200, 'Meal retrieved successfully', meal);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return sendError(res, error);
    }
    const dbError = new DatabaseError('Failed to retrieve meal', error.message);
    return sendError(res, dbError);
  }
};

/**
 * Update meal details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      mealName,
      local_name,
      description,
      image_url,
      video_url,
      pronunciation_url,
      country_id
    } = req.body;

    if (mealName !== undefined && (typeof mealName !== 'string' || !mealName.trim())) {
      throw new BadRequestError('Meal name cannot be empty');
    }

    // Find meal first
    const meal = await prisma.meals.findFirst({
      where: mealIdWhere(id)
    });

    if (!meal) {
      throw new BadRequestError('Meal not found');
    }

    // Update meal
    const updatedMeal = await prisma.meals.update({
      where: { mealID: meal.mealID },
      data: {
        ...(mealName && { mealName: mealName.trim() }),
        ...(local_name !== undefined && { local_name }),
        ...(description !== undefined && { description }),
        ...(image_url !== undefined && { image_url }),
        ...(video_url !== undefined && { video_url }),
        ...(pronunciation_url !== undefined && { pronunciation_url }),
        ...(country_id !== undefined && { country_id })
      },
      include: {
        meal_food_items: { include: { fooditems: true } },
        meal_preparation_sources: true,
        meal_images: {
          orderBy: { image_order: 'asc' }
        }
      }
    });

    return sendSuccess(res, 200, 'Meal updated successfully', updatedMeal);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return sendError(res, error);
    }
    const dbError = new DatabaseError('Failed to update meal', error.message);
    return sendError(res, dbError);
  }
};

/**
 * Add food items to a meal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addFoodItemsToMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { foodItems } = req.body;

    if (!Array.isArray(foodItems) || foodItems.length === 0) {
      throw new BadRequestError('Food items array is required');
    }
    validateFoodItems(foodItems);

    // Find meal
    const meal = await prisma.meals.findFirst({
      where: mealIdWhere(id)
    });

    if (!meal) {
      throw new BadRequestError('Meal not found');
    }

    // Add food items
    const addedItems = await Promise.all(
      foodItems.map(item =>
        prisma.meal_food_items.upsert({
          where: {
            unique_meal_food: {
              meal_id: meal.mealID,
              food_item_id: item.food_item_id
            }
          },
          update: {
            quantity: item.quantity || null,
            unit: item.unit || null,
            preparation_notes: item.preparation_notes || null
          },
          create: {
            meal_id: meal.mealID,
            food_item_id: item.food_item_id,
            quantity: item.quantity || null,
            unit: item.unit || null,
            preparation_notes: item.preparation_notes || null
          }
        })
      )
    );

    return sendSuccess(res, 201, `${addedItems.length} food items added to meal`, addedItems);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return sendError(res, error);
    }
    const dbError = new DatabaseError('Failed to add food items', error.message);
    return sendError(res, dbError);
  }
};

/**
 * Remove food item from meal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.removeFoodItemFromMeal = async (req, res) => {
  try {
    const { id, foodItemId } = req.params;

    // Find meal
    const meal = await prisma.meals.findFirst({
      where: mealIdWhere(id)
    });

    if (!meal) {
      throw new BadRequestError('Meal not found');
    }

    // Delete the food item association
    await prisma.meal_food_items.deleteMany({
      where: {
        meal_id: meal.mealID,
        food_item_id: foodItemId
      }
    });

    return sendSuccess(res, 200, 'Food item removed from meal', null);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return sendError(res, error);
    }
    const dbError = new DatabaseError('Failed to remove food item', error.message);
    return sendError(res, dbError);
  }
};

/**
 * Add preparation sources to meal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addPreparationSources = async (req, res) => {
  try {
    const { id } = req.params;
    const { sources } = req.body;

    if (!Array.isArray(sources) || sources.length === 0) {
      throw new BadRequestError('Sources array is required');
    }

    validateSources(sources);

    // Find meal
    const meal = await prisma.meals.findFirst({
      where: mealIdWhere(id)
    });

    if (!meal) {
      throw new BadRequestError('Meal not found');
    }

    // Add sources
    const addedSources = await prisma.meal_preparation_sources.createMany({
      data: sources.map(source => ({
        meal_id: meal.mealID,
        source_type: source.source_type,
        source_url: source.source_url,
        title: source.title || null
      }))
    });

    return sendSuccess(res, 201, `${addedSources.count} preparation sources added`, { count: addedSources.count });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return sendError(res, error);
    }
    const dbError = new DatabaseError('Failed to add preparation sources', error.message);
    return sendError(res, dbError);
  }
};

/**
 * Add images to meal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addMealImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      throw new BadRequestError('Images array is required');
    }
    validateImages(images);

    // Find meal
    const meal = await prisma.meals.findFirst({
      where: mealIdWhere(id)
    });

    if (!meal) {
      throw new BadRequestError('Meal not found');
    }

    // Get the highest image order
    const lastImage = await prisma.meal_images.findFirst({
      where: { meal_id: meal.mealID },
      orderBy: { image_order: 'desc' }
    });

    const startOrder = (lastImage?.image_order || 0) + 1;

    // Add images
    const addedImages = await prisma.meal_images.createMany({
      data: images.map((image, index) => ({
        meal_id: meal.mealID,
        image_url: typeof image === 'string' ? image : image.image_url,
        image_order: typeof image === 'object' && image.image_order !== undefined
          ? image.image_order
          : startOrder + index
      }))
    });

    return sendSuccess(res, 201, `${addedImages.count} images added to meal`, { count: addedImages.count });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return sendError(res, error);
    }
    const dbError = new DatabaseError('Failed to add meal images', error.message);
    return sendError(res, dbError);
  }
};

/**
 * Delete meal and all associated data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;

    // Find meal
    const meal = await prisma.meals.findFirst({
      where: mealIdWhere(id)
    });

    if (!meal) {
      throw new BadRequestError('Meal not found');
    }

    // Delete meal (cascade will handle related records)
    await prisma.meals.delete({
      where: { mealID: meal.mealID }
    });

    return sendSuccess(res, 200, 'Meal deleted successfully', null);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return sendError(res, error);
    }
    const dbError = new DatabaseError('Failed to delete meal', error.message);
    return sendError(res, dbError);
  }
};

/**
 * Get meal with details including food items, images, and sources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMealDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await prisma.meals.findFirst({
      where: mealIdWhere(id),
      include: {
        meal_food_items: { include: { fooditems: true } },
        meal_preparation_sources: true,
        meal_images: {
          orderBy: { image_order: 'asc' }
        }
      }
    });

    if (!meal) {
      throw new BadRequestError('Meal not found');
    }

    // Transform the data to include source organization
    const transformedMeal = {
      ...meal,
      sources: {
        youtube: meal.meal_preparation_sources.filter(s => s.source_type === 'youtube'),
        tiktok: meal.meal_preparation_sources.filter(s => s.source_type === 'tiktok'),
        instagram: meal.meal_preparation_sources.filter(s => s.source_type === 'instagram'),
        x: meal.meal_preparation_sources.filter(s => s.source_type === 'x'),
        other: meal.meal_preparation_sources.filter(s => !['youtube', 'tiktok', 'instagram', 'x'].includes(s.source_type))
      }
    };

    return sendSuccess(res, 200, 'Meal details retrieved successfully', transformedMeal);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return sendError(res, error);
    }
    const dbError = new DatabaseError('Failed to retrieve meal details', error.message);
    return sendError(res, dbError);
  }
};
