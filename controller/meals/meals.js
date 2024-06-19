/*

  meals include lunch, breakfast , supper, and breaktime

*/
const DatabaseError = require('../../middlewares/custom_errors/database_error');
const IndexQuery = require('../query_utiltity/index'); // Update the path accordingly
const indexQuery = new IndexQuery();

// CREATE
exports.addMeal = async (req, res) => {
  try {
    const { mealName } = req.body;

    const checkIfExistsSQL = 'SELECT * FROM Meals WHERE mealName = ?';
    const insertNewRecordSQL = 'INSERT INTO Meals (mealName) VALUES (?)';

    const exists = await indexQuery.checkIfRecordExists(checkIfExistsSQL, [mealName]);
    console.log('exists is ', exists);
    if (exists.length !== 0) {
      return res.status(400).json({ error: 'Meal already exists' });
    }

    await indexQuery.insertNewRecord(insertNewRecordSQL, [mealName]);
    res.status(201).json({ message: 'Meal added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// READ
exports.getAllMeals = async (req, res) => {
  try {
    const getAllSQL = 'SELECT mealName, mealID FROM meals';
    const results = await indexQuery.getAll(getAllSQL);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    throw new DatabaseError('something went wrong.');
  }
};

// UPDATE
exports.updateMeal = async (req, res) => {
  try {
    const { mealName } = req.body;
    const mealTypeID = req.params.id;

    const updateRecordSQL = 'UPDATE Meals SET mealName = ? WHERE mealID = ?';
    const checkIfExistsSQL = 'SELECT * FROM Meals WHERE mealName = ?';

    const exists = await indexQuery.checkIfRecordExists(checkIfExistsSQL, [mealName]);

    if (exists.length !== 0) {
      return res.status(400).json({ error: 'Meal with that name already exists' });
    }
    console.log('exists is ', exists);
    await indexQuery.updateRecord(updateRecordSQL, [mealName, mealTypeID]);
    res.status(200).json({ message: 'Meal updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE
exports.deleteMeal = async (req, res) => {
  try {
    const mealID = req.params.id;

    const deleteRecordSQL = 'DELETE FROM Meals WHERE mealID = ?';

    await indexQuery.updateRecord(deleteRecordSQL, [mealID]);
    res.status(200).json({ message: 'Meal deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
