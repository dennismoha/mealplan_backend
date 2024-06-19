const IndexQuery = require('../query_utiltity/index'); // Update the path accordingly
const indexQuery = new IndexQuery();

// Constants for SQL queries
const GET_ALL_MEAL_TYPE_FOODS_QUERY = 'SELECT * FROM meal_type_foods';
const GET_MEAL_TYPE_FOOD_BY_ID_QUERY = 'SELECT * FROM meal_type_foods WHERE idmeal_type_foods = ?';
const CREATE_MEAL_TYPE_FOOD_QUERY =
  'INSERT INTO meal_type_foods (meal_type_foodsID, meal_type_ID, food_variations_ID) VALUES (?, ?, ?)';
const UPDATE_MEAL_TYPE_FOOD_QUERY =
  'UPDATE meal_type_foods SET meal_type_ID = ?, food_variations_ID = ? WHERE idmeal_type_foods = ?';
const DELETE_MEAL_TYPE_FOOD_QUERY = 'DELETE FROM meal_type_foods WHERE idmeal_type_foods = ?';

exports.getAllMealTypeFoods = async (req, res) => {
  try {
    const mealTypeFoods = await indexQuery.getAll(GET_ALL_MEAL_TYPE_FOODS_QUERY);
    res.json(mealTypeFoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMealTypeFoodById = async (req, res) => {
  try {
    const id = req.params.id;
    const mealTypeFood = await indexQuery.getById(GET_MEAL_TYPE_FOOD_BY_ID_QUERY, [id]);

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

    const mealTypeFoodId = await indexQuery.insertNewRecord(CREATE_MEAL_TYPE_FOOD_QUERY, [
      mealTypeFoodData.meal_type_foodsID,
      mealTypeFoodData.meal_type_ID,
      mealTypeFoodData.food_variations_ID
    ]);

    res.json({ id: mealTypeFoodId, message: 'Meal Type Food created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateMealTypeFoodById = async (req, res) => {
  try {
    const id = req.params.id;
    const mealTypeFoodData = req.body;

    await indexQuery.updateRecord(UPDATE_MEAL_TYPE_FOOD_QUERY, [
      mealTypeFoodData.meal_type_ID,
      mealTypeFoodData.food_variations_ID,
      id
    ]);

    res.json({ message: 'Meal Type Food updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteMealTypeFoodById = async (req, res) => {
  try {
    const id = req.params.id;

    await indexQuery.deleteRecord(DELETE_MEAL_TYPE_FOOD_QUERY, [id]);
    res.json({ message: 'Meal Type Food deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
