/* eslint-disable no-console */
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const prisma = require('../models/prisma');

const countries = [
  ['Kenya', 'KE', 'East African food traditions built around maize, beans, leafy greens, grilled meats, and Indian Ocean influences.'],
  ['Uganda', 'UG', 'A fertile East African cuisine known for matoke, groundnut sauces, beans, millet, and freshwater fish.'],
  ['Ethiopia', 'ET', 'A distinctive culinary tradition of fermented injera, richly spiced stews, pulses, and communal dining.'],
  ['India', 'IN', 'A vast collection of regional cuisines using rice, wheat, pulses, vegetables, dairy, and layered spice blends.'],
  ['Mexico', 'MX', 'A cuisine rooted in maize, beans, chillies, tomatoes, squash, herbs, and Indigenous cooking techniques.'],
  ['Italy', 'IT', 'Regional Mediterranean cooking centred on seasonal produce, grains, legumes, cheese, olive oil, and pasta.'],
];

const categories = [
  ['Grains & Cereals', 'Whole and refined staple grains used for porridges, breads, rice dishes, and pasta.'],
  ['Legumes & Pulses', 'Beans, peas, lentils, and groundnuts that provide plant protein and fibre.'],
  ['Vegetables', 'Leafy, fruiting, and root vegetables used in everyday meals.'],
  ['Fruit', 'Fresh fruit used in breakfasts, snacks, salads, sauces, and desserts.'],
  ['Animal Proteins', 'Meat, poultry, fish, and eggs.'],
  ['Dairy & Alternatives', 'Milk, cultured dairy products, cheese, and plant-based alternatives.'],
];

const subcategories = [
  ['Maize & Millet', 'Grains & Cereals'], ['Rice', 'Grains & Cereals'], ['Wheat & Pasta', 'Grains & Cereals'],
  ['Beans & Lentils', 'Legumes & Pulses'], ['Nuts & Seeds', 'Legumes & Pulses'],
  ['Leafy Greens', 'Vegetables'], ['Root Vegetables', 'Vegetables'], ['Fruiting Vegetables', 'Vegetables'],
  ['Tropical Fruit', 'Fruit'], ['Citrus Fruit', 'Fruit'],
  ['Meat & Poultry', 'Animal Proteins'], ['Fish & Eggs', 'Animal Proteins'],
  ['Milk & Cultured Dairy', 'Dairy & Alternatives'], ['Cheese', 'Dairy & Alternatives'],
];

const foods = [
  { name: 'Maize flour', local: 'Unga wa mahindi', sub: 'Maize & Millet', countries: ['Kenya', 'Uganda'], nutrition: [100, 361, 6.9, 76.9, 3.9, 7.3] },
  { name: 'Finger millet flour', local: 'Wimbi', sub: 'Maize & Millet', countries: ['Kenya', 'Uganda', 'Ethiopia'], nutrition: [100, 336, 7.3, 72.0, 1.3, 3.6] },
  { name: 'Teff flour', local: 'Teff', sub: 'Maize & Millet', countries: ['Ethiopia'], nutrition: [100, 367, 13.3, 73.1, 2.4, 8.0] },
  { name: 'Basmati rice', local: 'Chawal', sub: 'Rice', countries: ['India', 'Kenya'], nutrition: [100, 356, 8.9, 77.8, 1.1, 2.2] },
  { name: 'Arborio rice', local: 'Riso Arborio', sub: 'Rice', countries: ['Italy'], nutrition: [100, 356, 6.7, 80.0, 0.6, 1.0] },
  { name: 'Spaghetti', local: 'Spaghetti', sub: 'Wheat & Pasta', countries: ['Italy'], nutrition: [100, 371, 13.0, 74.7, 1.5, 3.2] },
  { name: 'Corn tortilla', local: 'Tortilla de maíz', sub: 'Maize & Millet', countries: ['Mexico'], nutrition: [100, 218, 5.7, 44.6, 2.9, 6.3] },
  { name: 'Kidney beans', local: 'Maharagwe', sub: 'Beans & Lentils', countries: ['Kenya', 'Uganda', 'Mexico'], nutrition: [100, 127, 8.7, 22.8, 0.5, 6.4] },
  { name: 'Red lentils', local: 'Masoor dal', sub: 'Beans & Lentils', countries: ['India', 'Ethiopia'], nutrition: [100, 116, 9.0, 20.1, 0.4, 7.9] },
  { name: 'Groundnuts', local: 'Njugu', sub: 'Nuts & Seeds', countries: ['Uganda', 'Kenya'], nutrition: [100, 567, 25.8, 16.1, 49.2, 8.5] },
  { name: 'Sukuma wiki', local: 'Collard greens', sub: 'Leafy Greens', countries: ['Kenya'], nutrition: [100, 32, 3.0, 5.4, 0.6, 4.0] },
  { name: 'Spinach', local: 'Palak', sub: 'Leafy Greens', countries: ['India', 'Italy'], nutrition: [100, 23, 2.9, 3.6, 0.4, 2.2] },
  { name: 'Potato', local: 'Viazi', sub: 'Root Vegetables', countries: ['Kenya', 'Uganda', 'India', 'Italy'], nutrition: [100, 77, 2.0, 17.5, 0.1, 2.2] },
  { name: 'Tomato', local: 'Nyanya', sub: 'Fruiting Vegetables', countries: ['Kenya', 'India', 'Mexico', 'Italy'], nutrition: [100, 18, 0.9, 3.9, 0.2, 1.2] },
  { name: 'Avocado', local: 'Parachichi', sub: 'Tropical Fruit', countries: ['Kenya', 'Mexico'], nutrition: [100, 160, 2.0, 8.5, 14.7, 6.7] },
  { name: 'Plantain', local: 'Matoke', sub: 'Tropical Fruit', countries: ['Uganda', 'Kenya'], nutrition: [100, 122, 1.3, 31.9, 0.4, 2.3] },
  { name: 'Lime', local: 'Limón verde', sub: 'Citrus Fruit', countries: ['Mexico'], nutrition: [100, 30, 0.7, 10.5, 0.2, 2.8] },
  { name: 'Chicken', local: 'Kuku', sub: 'Meat & Poultry', countries: ['Kenya', 'Uganda', 'India', 'Mexico', 'Italy'], nutrition: [100, 165, 31.0, 0, 3.6, 0] },
  { name: 'Tilapia', local: 'Ngege', sub: 'Fish & Eggs', countries: ['Kenya', 'Uganda'], nutrition: [100, 128, 26.2, 0, 2.7, 0] },
  { name: 'Egg', local: 'Yai', sub: 'Fish & Eggs', countries: ['Kenya', 'Uganda', 'Ethiopia', 'India', 'Mexico', 'Italy'], nutrition: [100, 155, 12.6, 1.1, 10.6, 0] },
  { name: 'Plain yoghurt', local: 'Maziwa lala', sub: 'Milk & Cultured Dairy', countries: ['Kenya', 'India'], nutrition: [100, 61, 3.5, 4.7, 3.3, 0] },
  { name: 'Parmesan', local: 'Parmigiano Reggiano', sub: 'Cheese', countries: ['Italy'], nutrition: [100, 431, 38.0, 4.1, 29.0, 0] },
];

const dishes = [
  { name: 'Ugali with sukuma wiki', local: 'Ugali na sukuma', country: 'Kenya', foods: [['Maize flour', '200 g'], ['Sukuma wiki', '300 g'], ['Tomato', '2 medium']], description: 'Firm maize meal served with gently sautéed collard greens and tomato.' },
  { name: 'Githeri', local: 'Githeri', country: 'Kenya', foods: [['Maize flour', '250 g cooked maize'], ['Kidney beans', '250 g'], ['Tomato', '2 medium']], description: 'A nourishing Kenyan combination of maize and beans simmered with vegetables.' },
  { name: 'Matoke with groundnut sauce', local: 'Matooke', country: 'Uganda', foods: [['Plantain', '6 medium'], ['Groundnuts', '150 g'], ['Tomato', '2 medium']], description: 'Steamed green plantain accompanied by a creamy roasted-groundnut sauce.' },
  { name: 'Injera with misir wot', local: 'Injera be misir wot', country: 'Ethiopia', foods: [['Teff flour', '300 g'], ['Red lentils', '250 g'], ['Tomato', '3 medium']], description: 'Fermented teff flatbread served with a deeply seasoned red lentil stew.' },
  { name: 'Palak dal with rice', local: 'Palak dal chawal', country: 'India', foods: [['Red lentils', '250 g'], ['Spinach', '250 g'], ['Basmati rice', '300 g'], ['Tomato', '2 medium']], description: 'Comforting lentils and spinach served with fragrant basmati rice.' },
  { name: 'Chicken biryani', local: 'Murgh biryani', country: 'India', foods: [['Chicken', '600 g'], ['Basmati rice', '400 g'], ['Plain yoghurt', '150 g'], ['Tomato', '2 medium']], description: 'Layered spiced rice with yoghurt-marinated chicken.' },
  { name: 'Bean and avocado tacos', local: 'Tacos de frijol y aguacate', country: 'Mexico', foods: [['Corn tortilla', '8 pieces'], ['Kidney beans', '300 g'], ['Avocado', '2 medium'], ['Tomato', '2 medium'], ['Lime', '2']], description: 'Warm corn tortillas filled with seasoned beans, avocado, tomato, and lime.' },
  { name: 'Spaghetti al pomodoro', local: 'Spaghetti al pomodoro', country: 'Italy', foods: [['Spaghetti', '400 g'], ['Tomato', '600 g'], ['Parmesan', '60 g']], description: 'A classic Italian pasta with a simple tomato sauce and Parmesan.' },
  { name: 'Mushroom-style spinach risotto', local: 'Risotto agli spinaci', country: 'Italy', foods: [['Arborio rice', '350 g'], ['Spinach', '200 g'], ['Parmesan', '80 g']], description: 'Creamy Arborio rice finished with spinach and Parmesan.' },
  { name: 'Grilled tilapia with potatoes', local: 'Samaki na viazi', country: 'Kenya', foods: [['Tilapia', '600 g'], ['Potato', '500 g'], ['Tomato', '2 medium'], ['Lime', '1']], description: 'Grilled tilapia with seasoned potatoes, tomato, and citrus.' },
];

const recipes = [
  ['Ugali with sukuma wiki', 10, 30, 4, 'Easy', 'Bring water to a boil. Gradually beat in maize flour until thick and smooth. Sauté chopped greens and tomato separately, then serve together.'],
  ['Githeri', 15, 50, 6, 'Easy', 'Combine cooked maize and beans. Add sautéed tomato and aromatics, then simmer until the flavours meld and the broth thickens.'],
  ['Matoke with groundnut sauce', 20, 45, 4, 'Medium', 'Steam peeled plantains until tender. Blend roasted groundnuts with warm water, simmer with tomato until creamy, and serve over the plantain.'],
  ['Injera with misir wot', 30, 50, 6, 'Advanced', 'Cook fermented teff batter as thin flatbreads. Slowly cook the lentils with tomato and spices until soft, rich, and spoonable.'],
  ['Palak dal with rice', 15, 35, 4, 'Easy', 'Simmer lentils until tender. Fold in cooked spinach and tomato with toasted spices, then serve alongside basmati rice.'],
  ['Chicken biryani', 30, 60, 6, 'Medium', 'Marinate chicken in yoghurt and spices. Part-cook the rice, layer it with the chicken, cover tightly, and steam until aromatic and tender.'],
  ['Bean and avocado tacos', 15, 15, 4, 'Easy', 'Warm the tortillas. Fill with seasoned beans, diced avocado and tomato, then finish with fresh lime juice.'],
  ['Spaghetti al pomodoro', 10, 25, 4, 'Easy', 'Cook spaghetti until al dente. Simmer tomato into a light sauce, toss with the pasta, and finish with grated Parmesan.'],
  ['Mushroom-style spinach risotto', 10, 35, 4, 'Medium', 'Toast the rice, then add hot stock gradually while stirring. Fold in spinach and Parmesan when the rice is creamy but still firm.'],
  ['Grilled tilapia with potatoes', 20, 40, 4, 'Medium', 'Season and grill the tilapia until opaque. Roast or boil the potatoes and serve with tomato and a squeeze of lime.'],
];

async function upsertData() {
  const countryByName = {};
  for (const [name, code, description] of countries) {
    countryByName[name] = await prisma.countries.upsert({ where: { name }, update: { code, description }, create: { name, code, description } });
  }

  const categoryByName = {};
  for (const [category_name, description] of categories) {
    const found = await prisma.foodcategory.findUnique({ where: { category_name } });
    categoryByName[category_name] = found
      ? await prisma.foodcategory.update({ where: { category_name }, data: { description } })
      : await prisma.foodcategory.create({ data: { category_name, description, food_categoryID: uuidv4() } });
  }

  const subcategoryByName = {};
  for (const [subcategory_name, categoryName] of subcategories) {
    const category = categoryByName[categoryName];
    const found = await prisma.foodsubcategory.findUnique({ where: { subcategory_name } });
    const data = { description: `${subcategory_name} used across regional cuisines.`, food_category_id: category.food_categoryID };
    subcategoryByName[subcategory_name] = found
      ? await prisma.foodsubcategory.update({ where: { subcategory_name }, data })
      : await prisma.foodsubcategory.create({ data: { ...data, subcategory_name, foodsubcategory_id: uuidv4() } });
  }

  const foodByName = {};
  for (const item of foods) {
    const subcategory = subcategoryByName[item.sub];
    const data = { local_name: item.local, descriptionl: `${item.name} is a commonly used ingredient in home cooking.`, nutrient_description: 'Nutrition values are approximate per 100 g edible portion.', category_id: subcategory.food_category_id, foodsubcategory_id: subcategory.foodsubcategory_id };
    const found = await prisma.fooditems.findUnique({ where: { food_name: item.name } });
    const food = found
      ? await prisma.fooditems.update({ where: { food_name: item.name }, data })
      : await prisma.fooditems.create({ data: { ...data, food_name: item.name, food_itemID: uuidv4() } });
    foodByName[item.name] = food;
    const [serving_size_g, energy_kcal, protein_g, carbohydrates_g, fat_g, fiber_g] = item.nutrition;
    await prisma.food_nutrition.upsert({ where: { food_item_id: food.food_itemID }, update: { serving_size_g, energy_kcal, protein_g, carbohydrates_g, fat_g, fiber_g, source: 'USDA FoodData Central; approximate generic values' }, create: { food_item_id: food.food_itemID, serving_size_g, energy_kcal, protein_g, carbohydrates_g, fat_g, fiber_g, source: 'USDA FoodData Central; approximate generic values' } });
    for (const countryName of item.countries) {
      const where = { food_item_id: food.food_itemID, country_id: countryByName[countryName].id };
      if (!await prisma.food_item_countries.findFirst({ where })) await prisma.food_item_countries.create({ data: where });
    }
  }

  const dishByName = {};
  for (const dish of dishes) {
    const country = countryByName[dish.country];
    const found = await prisma.mealtype.findUnique({ where: { meal_name: dish.name } });
    const data = { local_name: dish.local, description: dish.description, country_id: country.id };
    const meal = found
      ? await prisma.mealtype.update({ where: { meal_name: dish.name }, data })
      : await prisma.mealtype.create({ data: { ...data, meal_name: dish.name, mealTypesID: uuidv4() } });
    dishByName[dish.name] = meal;
    const countryLink = { meal_type_id: meal.mealTypesID, country_id: country.id };
    if (!await prisma.meal_type_countries.findFirst({ where: countryLink })) await prisma.meal_type_countries.create({ data: countryLink });
    for (const [foodName, quantity] of dish.foods) {
      const link = { meal_type_id: meal.mealTypesID, food_item_id: foodByName[foodName].food_itemID };
      await prisma.meal_type_food_items.upsert({ where: { unique_meal_type_food: link }, update: { quantity }, create: { ...link, quantity } });
    }

    const existingLegacy = await prisma.meals.findUnique({ where: { mealName: dish.name } });
    const legacy = existingLegacy
      ? await prisma.meals.update({ where: { mealName: dish.name }, data: { local_name: dish.local, description: dish.description, country_id: country.id } })
      : await prisma.meals.create({ data: { mealName: dish.name, mealID: uuidv4(), local_name: dish.local, description: dish.description, country_id: country.id } });
    for (const [foodName, quantity] of dish.foods) {
      const link = { meal_id: legacy.mealID, food_item_id: foodByName[foodName].food_itemID };
      await prisma.meal_food_items.upsert({ where: { unique_meal_food: link }, update: { quantity }, create: { ...link, quantity } });
    }
  }

  for (const [dishName, prep_time, cook_time, servings, difficulty, instructions] of recipes) {
    const dish = dishes.find(item => item.name === dishName);
    const meal = dishByName[dishName];
    const ingredientText = dish.foods.map(([name, quantity]) => `${quantity} ${name}`).join('\n');
    const data = { description: dish.description, ingredients: ingredientText, instructions, prep_time, cook_time, total_time: prep_time + cook_time, servings, cuisine: dish.country, difficulty, meal_type: 'Main dish', meal_typeID: meal.mealTypesID };
    const found = await prisma.recipe.findFirst({ where: { title: dishName } });
    const recipe = found
      ? await prisma.recipe.update({ where: { recipe_ID: found.recipe_ID }, data })
      : await prisma.recipe.create({ data: { ...data, title: dishName, recipe_ID: uuidv4() } });
    for (const [foodName, quantity] of dish.foods) {
      const where = { recipe_id: recipe.recipe_ID, food_item_id: foodByName[foodName].food_itemID };
      const link = await prisma.recipe_food_items.findFirst({ where });
      if (link) await prisma.recipe_food_items.update({ where: { id: link.id }, data: { quantity } });
      else await prisma.recipe_food_items.create({ data: { ...where, quantity } });
    }
  }
}

async function main() {
  console.log('Seeding realistic meal-planning data...');
  await upsertData();
  const counts = await Promise.all([prisma.countries.count(), prisma.foodcategory.count(), prisma.foodsubcategory.count(), prisma.fooditems.count(), prisma.mealtype.count(), prisma.recipe.count()]);
  console.log(`Seed complete: ${counts[0]} countries, ${counts[1]} categories, ${counts[2]} subcategories, ${counts[3]} food items, ${counts[4]} meal types, ${counts[5]} recipes.`);
}

main().catch((error) => { console.error('Seed failed:', error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
