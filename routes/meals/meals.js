const express = require('express');
const router = express.Router();
const mealsController = require('../../controller/meals/meals');
const verifyJwt = require('../../config/auth_token');
const { requireRoles } = require('../../middlewares/validator/auth/user_role_checker');

// ============================================================
// MEAL CRUD OPERATIONS
// ============================================================

/**
 * POST /meals
 * Create a new meal with food items, images, and preparation sources
 * Body: {
 *   mealName: string,
 *   local_name?: string,
 *   description?: string,
 *   image_url?: string,
 *   video_url?: string,
 *   pronunciation_url?: string,
 *   country_id?: number,
 *   foodItems?: Array<{ food_item_id, quantity?, unit?, preparation_notes? }>,
 *   preparationSources?: Array<{ source_type, source_url, title? }>,
 *   mealImages?: Array<{ image_url, image_order? }>
 * }
 */
router.post('/meals', verifyJwt, requireRoles('admin', 'professional'), mealsController.createMeal);

/**
 * GET /meals
 * Get all meals (with optional pagination and details)
 * Query: { includeDetails?: 'true'|'false', limit?: number, offset?: number }
 */
router.get('/meals', mealsController.getAllMeals);

/**
 * GET /meals/:id
 * Get meal by ID with all details
 */
/**
 * GET /meals/:id/details
 * Get meal with detailed information (includes organized sources)
 */
router.get('/meals/:id/details', mealsController.getMealDetails);

router.get('/meals/:id', mealsController.getMealById);

/**
 * PUT /meals/:id
 * Update meal details
 * Body: { mealName?, local_name?, description?, image_url?, video_url?, pronunciation_url?, country_id? }
 */
router.put('/meals/:id', verifyJwt, requireRoles('admin', 'professional'), mealsController.updateMeal);

/**
 * DELETE /meals/:id
 * Delete meal and all associated data
 */
router.delete('/meals/:id', verifyJwt, requireRoles('admin'), mealsController.deleteMeal);

// ============================================================
// MEAL FOOD ITEMS MANAGEMENT
// ============================================================

/**
 * POST /meals/:id/food-items
 * Add food items to a meal
 * Body: { foodItems: Array<{ food_item_id, quantity?, unit?, preparation_notes? }> }
 */
router.post('/meals/:id/food-items', verifyJwt, requireRoles('admin', 'professional'), mealsController.addFoodItemsToMeal);

/**
 * DELETE /meals/:id/food-items/:foodItemId
 * Remove a food item from meal
 */
router.delete('/meals/:id/food-items/:foodItemId', verifyJwt, requireRoles('admin', 'professional'), mealsController.removeFoodItemFromMeal);

// ============================================================
// MEAL PREPARATION SOURCES MANAGEMENT
// ============================================================

/**
 * POST /meals/:id/preparation-sources
 * Add preparation sources (YouTube, TikTok, Instagram, X, etc.)
 * Body: { sources: Array<{ source_type, source_url, title? }> }
 * source_type: 'youtube' | 'tiktok' | 'instagram' | 'x' | 'other'
 */
router.post('/meals/:id/preparation-sources', verifyJwt, requireRoles('admin', 'professional'), mealsController.addPreparationSources);

// ============================================================
// MEAL IMAGES MANAGEMENT
// ============================================================

/**
 * POST /meals/:id/images
 * Add images to meal
 * Body: { images: Array<{ image_url, image_order? }> or Array<string> }
 */
router.post('/meals/:id/images', verifyJwt, requireRoles('admin', 'professional'), mealsController.addMealImages);

module.exports = router;
