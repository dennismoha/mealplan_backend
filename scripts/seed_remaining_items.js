/* eslint-disable no-console */
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const prisma = require('../models/prisma');

async function seedRemainingFoodItems() {
  try {
    console.log('🌱 Seeding remaining food items...\n');

    const foodItems = [
      {
        food_name: 'Banana',
        local_name: 'Ndizi (Swahili)',
        descriptionl: 'Yellow tropical fruit rich in potassium and vitamins',
        image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500',
        video_url: 'https://www.youtube.com/watch?v=banana-recipe',
        pronunciation_url: 'https://pronunciation.com/banana',
        nutrient_description: 'Rich in potassium, vitamin B6, vitamin C, and fiber',
        subcategoryName: 'Tropical Fruits',
        countryName: 'Kenya',
      },
      {
        food_name: 'Mango',
        local_name: 'Embe (Swahili)',
        descriptionl: 'Sweet tropical fruit, king of fruits with creamy texture',
        image_url: 'https://images.unsplash.com/photo-1585518419758-8bce5a85f8ae?w=500',
        video_url: 'https://www.youtube.com/watch?v=mango-recipe',
        pronunciation_url: 'https://pronunciation.com/mango',
        nutrient_description: 'High in vitamin A, vitamin C, and antioxidants',
        subcategoryName: 'Tropical Fruits',
        countryName: 'Kenya',
      },
      {
        food_name: 'Rice',
        local_name: 'Wali (Swahili)',
        descriptionl: 'Staple grain crop, primary carbohydrate source',
        image_url: 'https://images.unsplash.com/photo-1586080876582-d3fe9f93a646?w=500',
        video_url: 'https://www.youtube.com/watch?v=rice-recipe',
        pronunciation_url: 'https://pronunciation.com/rice',
        nutrient_description: 'Source of carbohydrates, contains B vitamins',
        subcategoryName: 'Grains & Cereals',
        countryName: 'Kenya',
      },
    ];

    for (const item of foodItems) {
      // Find subcategory and get its category
      const subcategory = await prisma.foodsubcategory.findUnique({
        where: { subcategory_name: item.subcategoryName },
      });

      if (!subcategory) {
        console.log(`⚠ Skipping ${item.food_name} - subcategory "${item.subcategoryName}" not found`);
        continue;
      }

      // Check if food item already exists
      const existing = await prisma.fooditems.findUnique({
        where: { food_name: item.food_name },
      });

      if (existing) {
        console.log(`⚠ ${item.food_name} already exists, skipping`);
        continue;
      }

      // Create food item
      const foodItem = await prisma.fooditems.create({
        data: {
          food_name: item.food_name,
          local_name: item.local_name,
          descriptionl: item.descriptionl,
          image_url: item.image_url,
          video_url: item.video_url,
          pronunciation_url: item.pronunciation_url,
          nutrient_description: item.nutrient_description,
          food_itemID: uuidv4(),
          category_id: subcategory.food_category_id,
          foodsubcategory_id: subcategory.foodsubcategory_id,
        },
      });

      // Link food item to country
      const country = await prisma.countries.findUnique({
        where: { name: item.countryName },
      });

      if (country) {
        await prisma.food_item_countries.create({
          data: {
            food_item_id: foodItem.food_itemID,
            country_id: country.id,
          },
        });
        console.log(`✓ Created food item: ${item.food_name} (${item.local_name})`);
      } else {
        console.log(`⚠ Country "${item.countryName}" not found for ${item.food_name}`);
      }
    }

    console.log('\n✅ Seeding complete!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedRemainingFoodItems();
