/* eslint-disable no-console */
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const prisma = require('../models/prisma');

async function seedCountries() {
  console.log('Seeding countries...');
  const countries = [
    {
      name: 'Kenya',
      code: 'KE',
      description: 'East African country known for its diverse cuisines and rich food culture',
      image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    },
    {
      name: 'Uganda',
      code: 'UG',
      description: 'Known for its unique dishes like matoke and posho',
      image_url: 'https://images.unsplash.com/photo-1570468606510-7dd15b285dd9?w=500',
    },
    {
      name: 'Mexico',
      code: 'MX',
      description: 'Home to vibrant flavors and traditional recipes',
      image_url: 'https://images.unsplash.com/photo-1565820904546-52ded8a24e93?w=500',
    },
    {
      name: 'India',
      code: 'IN',
      description: 'Ancient culinary traditions with diverse spices',
      image_url: 'https://images.unsplash.com/photo-1596040814397-37fa399c0374?w=500',
    },
    {
      name: 'Italy',
      code: 'IT',
      description: 'Mediterranean cuisine and pasta traditions',
      image_url: 'https://images.unsplash.com/photo-1571997477386-016713f755cd?w=500',
    },
    {
      name: 'Japan',
      code: 'JP',
      description: 'Art of sushi, ramen, and traditional Japanese cooking',
      image_url: 'https://images.unsplash.com/photo-1580959375944-abd886e1a7e6?w=500',
    },
  ];

  for (const country of countries) {
    const existing = await prisma.countries.findUnique({
      where: { name: country.name },
    });
    if (!existing) {
      await prisma.countries.create({ data: country });
      console.log(`✓ Created country: ${country.name}`);
    }
  }
  console.log('Countries seeding complete.\n');
}

async function seedCategories() {
  console.log('Seeding food categories...');
  const categories = [
    {
      category_name: 'Fruits',
      description: 'Fresh and nutritious fruits rich in vitamins and minerals',
      image_url: 'https://images.unsplash.com/photo-1560806547-d2fee9d55364?w=500',
    },
    {
      category_name: 'Vegetables',
      description: 'Leafy greens and root vegetables packed with nutrients',
      image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
    },
    {
      category_name: 'Grains & Cereals',
      description: 'Staple carbohydrates and whole grains',
      image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
    },
    {
      category_name: 'Proteins',
      description: 'Meat, fish, legumes, and protein-rich foods',
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
    },
    {
      category_name: 'Dairy',
      description: 'Milk, cheese, yogurt, and dairy products',
      image_url: 'https://images.unsplash.com/photo-1628189041127-36281e2e5537?w=500',
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const existing = await prisma.foodcategory.findUnique({
      where: { category_name: category.category_name },
    });
    if (!existing) {
      const created = await prisma.foodcategory.create({
        data: {
          ...category,
          food_categoryID: uuidv4(),
        },
      });
      createdCategories.push(created);
      console.log(`✓ Created category: ${category.category_name}`);
    } else {
      const updated = await prisma.foodcategory.update({ where: { category_name: category.category_name }, data: { description: category.description, image_url: category.image_url } });
      createdCategories.push(updated);
    }
  }
  console.log('Categories seeding complete.\n');
  return createdCategories;
}

async function seedSubcategories(categories) {
  console.log('Seeding food subcategories...');
  const subcategories = [
    {
      subcategory_name: 'Tropical Fruits',
      description: 'Bananas, mangoes, papaya, and other tropical fruits',
      image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500',
      categoryName: 'Fruits',
    },
    {
      subcategory_name: 'Citrus Fruits',
      description: 'Oranges, lemons, limes, and citrus varieties',
      image_url: 'https://images.unsplash.com/photo-1599599810989-a9e3b5f0c1f5?w=500',
      categoryName: 'Fruits',
    },
    {
      subcategory_name: 'Leafy Greens',
      description: 'Spinach, kale, lettuce, and other leafy vegetables',
      image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
      categoryName: 'Vegetables',
    },
    {
      subcategory_name: 'Root Vegetables',
      description: 'Carrots, potatoes, yams, and root crops',
      image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500',
      categoryName: 'Vegetables',
    },
    {
      subcategory_name: 'Legumes',
      description: 'Beans, lentils, peas, and legumes',
      image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
      categoryName: 'Proteins',
    },
    {
      subcategory_name: 'Meat & Poultry',
      description: 'Beef, chicken, pork, and poultry products',
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
      categoryName: 'Proteins',
    },
  ];

  const createdSubcategories = [];
  for (const subcat of subcategories) {
    const category = categories.find((c) => c.category_name === subcat.categoryName);
    if (!category) continue;

    const existing = await prisma.foodsubcategory.findUnique({
      where: { subcategory_name: subcat.subcategory_name },
    });
    if (!existing) {
      const created = await prisma.foodsubcategory.create({
        data: {
          subcategory_name: subcat.subcategory_name,
          description: subcat.description,
          image_url: subcat.image_url,
          foodsubcategory_id: uuidv4(),
          food_category_id: category.food_categoryID,
        },
      });
      createdSubcategories.push(created);
      console.log(`✓ Created subcategory: ${subcat.subcategory_name}`);
    } else {
      const updated = await prisma.foodsubcategory.update({ where: { subcategory_name: subcat.subcategory_name }, data: { description: subcat.description, image_url: subcat.image_url, food_category_id: category.food_categoryID } });
      createdSubcategories.push(updated);
    }
  }
  console.log('Subcategories seeding complete.\n');
  return createdSubcategories;
}

async function seedFoodItems(categories, subcategories) {
  console.log('Seeding food items...');
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
      food_name: 'Carrot',
      local_name: 'Karate (Swahili)',
      descriptionl: 'Orange root vegetable rich in beta-carotene and fiber',
      image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500',
      video_url: 'https://www.youtube.com/watch?v=carrot-recipe',
      pronunciation_url: 'https://pronunciation.com/carrot',
      nutrient_description: 'Rich in beta-carotene, vitamin K, and potassium',
      subcategoryName: 'Root Vegetables',
      countryName: 'Kenya',
    },
    {
      food_name: 'Beans',
      local_name: 'Maharagwe (Swahili)',
      descriptionl: 'Protein-rich legume, staple food in African cuisine',
      image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
      video_url: 'https://www.youtube.com/watch?v=beans-recipe',
      pronunciation_url: 'https://pronunciation.com/beans',
      nutrient_description: 'High in protein, fiber, and iron',
      subcategoryName: 'Legumes',
      countryName: 'Kenya',
    },
    {
      food_name: 'Chicken',
      local_name: 'Kuku (Swahili)',
      descriptionl: 'White meat protein source, lean and versatile',
      image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500',
      video_url: 'https://www.youtube.com/watch?v=chicken-recipe',
      pronunciation_url: 'https://pronunciation.com/chicken',
      nutrient_description: 'High in protein, B vitamins, and selenium',
      subcategoryName: 'Meat & Poultry',
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
    const subcategory = subcategories.find((s) => s.subcategory_name === item.subcategoryName);
    
    if (!subcategory) {
      console.log(`⚠ Skipping ${item.food_name} - subcategory not found`);
      continue;
    }

    // Find the category that owns this subcategory
    const category = categories.find((c) => c.food_categoryID === subcategory.food_category_id);
    
    if (!category) {
      console.log(`⚠ Skipping ${item.food_name} - category not found`);
      continue;
    }

    const existing = await prisma.fooditems.findUnique({
      where: { food_name: item.food_name },
    });

    let foodItem;
    if (!existing) {
      foodItem = await prisma.fooditems.create({
        data: {
          food_name: item.food_name,
          local_name: item.local_name,
          descriptionl: item.descriptionl,
          image_url: item.image_url,
          video_url: item.video_url,
          pronunciation_url: item.pronunciation_url,
          nutrient_description: item.nutrient_description,
          food_itemID: uuidv4(),
          category_id: category.food_categoryID,
          foodsubcategory_id: subcategory.foodsubcategory_id,
        },
      });

      console.log(`✓ Created food item: ${item.food_name} (${item.local_name})`);
    } else {
      foodItem = await prisma.fooditems.update({
        where: { food_name: item.food_name },
        data: { local_name: item.local_name, descriptionl: item.descriptionl, image_url: item.image_url, video_url: item.video_url, pronunciation_url: item.pronunciation_url, nutrient_description: item.nutrient_description, category_id: category.food_categoryID, foodsubcategory_id: subcategory.foodsubcategory_id },
      });
    }

    const country = await prisma.countries.findUnique({ where: { name: item.countryName } });
    if (country) {
      const link = await prisma.food_item_countries.findFirst({ where: { food_item_id: foodItem.food_itemID, country_id: country.id } });
      if (!link) await prisma.food_item_countries.create({ data: { food_item_id: foodItem.food_itemID, country_id: country.id } });
    }
  }
  console.log('Food items seeding complete.\n');
}

async function main() {
  try {
    console.log('🌱 Starting seed process...\n');
    await seedCountries();
    const categories = await seedCategories();
    const subcategories = await seedSubcategories(categories);
    await seedFoodItems(categories, subcategories);
    console.log('✅ Seeding completed successfully!\n');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
