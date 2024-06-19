const IndexQuery = require('../query_utiltity/index');

const indexQuery = new IndexQuery();

exports.getAllFoodVariations = async (req, res) => {
  // SQL query to get all food variations
  const getAllVariationsSql = 'SELECT * FROM food_variations';

  try {
    const variations = await indexQuery.getAll(getAllVariationsSql);
    res.json(variations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFoodVariationById = async (req, res) => {
  const id = req.params.id;

  // SQL query to get food variation by ID
  const getVariationByIdSql = 'SELECT * FROM food_variations WHERE idfood_variations = ?';

  try {
    const variation = await indexQuery.getById(getVariationByIdSql, [id]);

    if (!variation) {
      return res.status(404).json({ error: 'Food Variation not found' });
    }

    res.json(variation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createFoodVariation = async (req, res) => {
  const variationData = req.body;

  // SQL query to check if food variation with the same name already exists
  const checkIfVariationExistsSql = 'SELECT * FROM food_variations WHERE variation_name = ?';
  const existingVariation = await indexQuery.checkIfRecordExists(checkIfVariationExistsSql, [
    variationData.variation_name
  ]);

  console.log('existing food variation is ', existingVariation);
  if (existingVariation.length !== 0) {
    return res.status(400).json({ message: 'Food Variation with the same name already exists' });
  }

  // SQL query to insert new food variation
  const createFoodVariationSql = `
    INSERT INTO food_variations (variation_name, foodItemsID, foodVariationsID)
    VALUES (?, ?, ?)
  `;

  try {
    const variationId = await indexQuery.insertNewRecord(createFoodVariationSql, [
      variationData.variation_name,
      variationData.foodItemsID,
      variationData.foodVariationsID
    ]);

    res.json({ id: variationId, message: 'Food Variation successfully created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateFoodVariationById = async (req, res) => {
  const id = req.params.id;
  const variationData = req.body;

  // SQL query to update food variation
  const updateFoodVariationSql = `
    UPDATE food_variations
    SET variation_name = ?, foodItemsID = ?, foodVariationsID = ?
    WHERE idfood_variations = ?
  `;

  try {
    await indexQuery.updateRecord(updateFoodVariationSql, [
      variationData.variation_name,
      variationData.foodItemsID,
      variationData.foodVariationsID,
      id
    ]);

    res.json({ message: 'Food Variation updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteFoodVariationById = async (req, res) => {
  const id = req.params.id;

  // SQL query to delete food variation by ID
  const deleteFoodVariationSql = 'DELETE FROM food_variations WHERE idfood_variations = ?';

  try {
    await indexQuery.deleteRecord(deleteFoodVariationSql, [id]);
    res.json({ message: 'Food Variation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
