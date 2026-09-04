/* eslint-disable no-console */
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const prisma = require('../models/prisma');

async function seedMissingSubcategories() {
  try {
    console.log('🌱 Adding missing subcategories...\n');

    // Find or create Fruits category
    let fruitsCategory = await prisma.foodcategory.findUnique({
      where: { category_name: 'Fruits' },
    });

    if (!fruitsCategory) {
      console.log('Fruits category not found, checking alternatives...');
      fruitsCategory = await prisma.foodcategory.findFirst({
        where: { category_name: { in: ['fruits', 'Fruitss', 'Fruits'] } },
      });
    }

    // Find or create Grains & Cereals category
    let grainsCategory = await prisma.foodcategory.findUnique({
      where: { category_name: 'Grains & Cereals' },
    });

    if (!fruitsCategory) {
      console.log('❌ No Fruits category found - cannot add Tropical Fruits subcategory');
    } else {
      const tropicalFruits = await prisma.foodsubcategory.findUnique({
        where: { subcategory_name: 'Tropical Fruits' },
      });
      if (!tropicalFruits) {
        await prisma.foodsubcategory.create({
          data: {
            subcategory_name: 'Tropical Fruits',
            description: 'Bananas, mangoes, papaya, and other tropical fruits',
            image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500',
            foodsubcategory_id: uuidv4(),
            food_category_id: fruitsCategory.food_categoryID,
          },
        });
        console.log('✓ Created subcategory: Tropical Fruits');
      }
    }

    if (!grainsCategory) {
      console.log('❌ No Grains & Cereals category found - cannot add subcategories');
    } else {
      const grainsCereals = await prisma.foodsubcategory.findUnique({
        where: { subcategory_name: 'Grains & Cereals' },
      });
      if (!grainsCereals) {
        await prisma.foodsubcategory.create({
          data: {
            subcategory_name: 'Grains & Cereals',
            description: 'Rice, wheat, corn, and other grain products',
            image_url: 'https://images.unsplash.com/photo-1586080876582-d3fe9f93a646?w=500',
            foodsubcategory_id: uuidv4(),
            food_category_id: grainsCategory.food_categoryID,
          },
        });
        console.log('✓ Created subcategory: Grains & Cereals');
      }
    }

    console.log('\n✅ Subcategories seeding complete!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedMissingSubcategories();
