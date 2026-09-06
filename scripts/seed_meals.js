require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const prisma = require('../models/prisma');

/**
 * Seed sample meals combining the food items in the database
 * This demonstrates the comprehensive meal creation feature
 */

async function seedMeals() {
  try {
    console.log('🌱 Starting meal seeding process...\n');

    // First, get the food items we'll use to build meals
    const foodItems = await prisma.fooditems.findMany({
      take: 6,
      select: { food_itemID: true, food_name: true }
    });

    if (foodItems.length < 2) {
      console.log('⚠ Not enough food items in database. Please seed food items first.');
      return;
    }

    // Build sample meals
    const mealData = [
      {
        mealName: 'Spaghetti with Meat Sauce',
        local_name: 'Pasta na Nyama',
        description: 'Delicious Italian-style pasta dish with savory meat sauce, served with fresh vegetables',
        image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500',
        video_url: 'https://www.youtube.com/watch?v=spaghetti-meat-sauce',
        pronunciation_url: 'https://pronunciation.com/spaghetti',
        country_id: 1,
        foodItems: [
          { food_item_id: foodItems[0]?.food_itemID, quantity: '500', unit: 'g', preparation_notes: 'Cooked, drained' },
          { food_item_id: foodItems[1]?.food_itemID, quantity: '300', unit: 'g', preparation_notes: 'Ground and browned' }
        ],
        preparationSources: [
          { source_type: 'youtube', source_url: 'https://www.youtube.com/watch?v=spaghetti-recipe', title: 'Traditional Spaghetti Tutorial' },
          { source_type: 'instagram', source_url: 'https://www.instagram.com/explore/tags/spaghetti/', title: 'Spaghetti Inspiration' }
        ],
        mealImages: [
          'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500',
          'https://images.unsplash.com/photo-1595412108529-c1651dda42c0?w=500'
        ]
      },
      {
        mealName: 'Chicken and Rice Bowl',
        local_name: 'Kuku na Wali',
        description: 'Protein-rich meal with tender chicken, fluffy rice, and fresh vegetables',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
        video_url: 'https://www.youtube.com/watch?v=chicken-rice-bowl',
        pronunciation_url: 'https://pronunciation.com/chicken-rice',
        country_id: 1,
        foodItems: [
          { food_item_id: foodItems[2]?.food_itemID, quantity: '400', unit: 'g', preparation_notes: 'Grilled and sliced' },
          { food_item_id: foodItems[4]?.food_itemID, quantity: '250', unit: 'g', preparation_notes: 'Fluffy white rice' }
        ],
        preparationSources: [
          { source_type: 'youtube', source_url: 'https://www.youtube.com/watch?v=chicken-rice-bowl', title: 'Easy Chicken Rice Bowl' },
          { source_type: 'tiktok', source_url: 'https://www.tiktok.com/@foodvideos', title: 'Quick Meal Ideas' }
        ],
        mealImages: [
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
        ]
      },
      {
        mealName: 'Vegetable Stir-fry with Beans',
        local_name: 'Mboga na Maharagwe',
        description: 'Colorful and nutritious vegetable medley with protein-rich beans',
        image_url: 'https://images.unsplash.com/photo-1609050566381-59f0cf50d1b7?w=500',
        video_url: 'https://www.youtube.com/watch?v=vegetable-stir-fry',
        pronunciation_url: 'https://pronunciation.com/stir-fry',
        country_id: 2,
        foodItems: [
          { food_item_id: foodItems[0]?.food_itemID, quantity: '250', unit: 'g', preparation_notes: 'Julienned' },
          { food_item_id: foodItems[3]?.food_itemID, quantity: '200', unit: 'g', preparation_notes: 'Cooked until tender' }
        ],
        preparationSources: [
          { source_type: 'youtube', source_url: 'https://www.youtube.com/watch?v=stir-fry-tutorial', title: 'Healthy Stir-fry Guide' },
          { source_type: 'instagram', source_url: 'https://www.instagram.com/healthyfood', title: 'Healthy Food Ideas' },
          { source_type: 'x', source_url: 'https://x.com/recipes', title: 'Recipe Tweets' }
        ],
        mealImages: [
          'https://images.unsplash.com/photo-1609050566381-59f0cf50d1b7?w=500',
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
        ]
      }
    ];

    // Create meals
    for (const mealInput of mealData) {
      try {
        // Check if meal already exists
        const existing = await prisma.meals.findUnique({
          where: { mealName: mealInput.mealName }
        });

        if (existing) {
          console.log(`⚠ Meal already exists: ${mealInput.mealName}`);
          continue;
        }

        // Validate food items exist
        const validFoodItems = [];
        for (const item of mealInput.foodItems) {
          if (item.food_item_id) {
            const foodItem = await prisma.fooditems.findUnique({
              where: { food_itemID: item.food_item_id }
            });
            if (foodItem) {
              validFoodItems.push(item);
            }
          }
        }

        if (validFoodItems.length === 0) {
          console.log(`⚠ Skipping ${mealInput.mealName} - no valid food items`);
          continue;
        }

        const mealID = uuidv4();
        const meal = await prisma.meals.create({
          data: {
            mealName: mealInput.mealName,
            mealID,
            local_name: mealInput.local_name,
            description: mealInput.description,
            image_url: mealInput.image_url,
            video_url: mealInput.video_url,
            pronunciation_url: mealInput.pronunciation_url,
            country_id: mealInput.country_id,
            meal_food_items: {
              create: validFoodItems.map(item => ({
                food_item_id: item.food_item_id,
                quantity: item.quantity,
                unit: item.unit,
                preparation_notes: item.preparation_notes
              }))
            },
            meal_preparation_sources: {
              create: mealInput.preparationSources.map(source => ({
                source_type: source.source_type,
                source_url: source.source_url,
                title: source.title
              }))
            },
            meal_images: {
              create: mealInput.mealImages.map((image, index) => ({
                image_url: image,
                image_order: index
              }))
            }
          }
        });

        console.log(`✓ Created meal: ${meal.mealName} (${meal.mealID})`);
        console.log(`  - Local name: ${meal.local_name}`);
        console.log(`  - Food items: ${validFoodItems.length}`);
        console.log(`  - Preparation sources: ${mealInput.preparationSources.length}`);
        console.log(`  - Images: ${mealInput.mealImages.length}`);
      } catch (error) {
        console.error(`❌ Error creating meal: ${error.message}`);
      }
    }

    // Display summary
    const mealCount = await prisma.meals.count();
    const mealFoodCount = await prisma.meal_food_items.count();
    const mealSourceCount = await prisma.meal_preparation_sources.count();
    const mealImageCount = await prisma.meal_images.count();

    console.log('\n✅ Meal seeding completed!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Total meals: ${mealCount}`);
    console.log(`   - Meal-food associations: ${mealFoodCount}`);
    console.log(`   - Preparation sources: ${mealSourceCount}`);
    console.log(`   - Meal images: ${mealImageCount}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding
seedMeals();
