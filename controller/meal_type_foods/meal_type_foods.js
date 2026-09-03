const prisma = require('../../models/prisma');

exports.getAllMealTypeFoods = async (req, res) => {
  try {
    const mealTypeFoods = await prisma.$queryRaw`SELECT * FROM meal_type_foods`;
    res.json(mealTypeFoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMealTypeFoodById = async (req, res) => {
  try {
    const id = req.params.id;
    const mealTypeFood = (await prisma.$queryRaw`SELECT * FROM meal_type_foods WHERE idmeal_type_foods = ${Number(id)} LIMIT 1`)[0];

    if (!mealTypeFood) {
      return res.status(404).json({ error: 'Meal Type Food not found' });
    }

    res.json(mealTypeFood);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createMealTypeFood = async (req, res) => {
  try {
    const mealTypeFoodData = req.body;

    await prisma.$executeRaw`INSERT INTO meal_type_foods (meal_type_foodsID, meal_type_ID, food_variations_ID) VALUES (${mealTypeFoodData.meal_type_foodsID}, ${mealTypeFoodData.meal_type_ID}, ${mealTypeFoodData.food_variations_ID})`;

    res.json({ id: mealTypeFoodData.meal_type_foodsID, message: 'Meal Type Food created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateMealTypeFoodById = async (req, res) => {
  try {
    const id = req.params.id;
    const mealTypeFoodData = req.body;

    await prisma.$executeRaw`UPDATE meal_type_foods SET meal_type_ID = ${mealTypeFoodData.meal_type_ID}, food_variations_ID = ${mealTypeFoodData.food_variations_ID} WHERE idmeal_type_foods = ${Number(id)}`;

    res.json({ message: 'Meal Type Food updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteMealTypeFoodById = async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.$executeRaw`DELETE FROM meal_type_foods WHERE idmeal_type_foods = ${Number(id)}`;
    res.json({ message: 'Meal Type Food deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
