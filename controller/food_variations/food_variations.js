const prisma = require('../../models/prisma');

exports.getAllFoodVariations = async (req, res) => {
  // SQL query to get all food variations
  const getAllVariationsSql = 'SELECT * FROM food_variations';

  try {
    const variations = await prisma.$queryRawUnsafe(getAllVariationsSql);
    res.json(variations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFoodVariationById = async (req, res) => {
  const id = req.params.id;

  try {
    const variation = (await prisma.$queryRaw`SELECT * FROM food_variations WHERE idfood_variations = ${Number(id)} LIMIT 1`)[0];

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

  const existingVariation = await prisma.$queryRaw`SELECT * FROM food_variations WHERE variation_name = ${variationData.variation_name}`;

  console.log('existing food variation is ', existingVariation);
  if (existingVariation.length !== 0) {
    return res.status(400).json({ message: 'Food Variation with the same name already exists' });
  }

  try {
    await prisma.$executeRaw`INSERT INTO food_variations (variation_name, foodItemsID, foodVariationsID) VALUES (${variationData.variation_name}, ${variationData.foodItemsID}, ${variationData.foodVariationsID})`;

    res.json({ id: variationData.foodVariationsID, message: 'Food Variation successfully created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateFoodVariationById = async (req, res) => {
  const id = req.params.id;
  const variationData = req.body;

  try {
    await prisma.$executeRaw`UPDATE food_variations SET variation_name = ${variationData.variation_name}, foodItemsID = ${variationData.foodItemsID}, foodVariationsID = ${variationData.foodVariationsID} WHERE idfood_variations = ${Number(id)}`;

    res.json({ message: 'Food Variation updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteFoodVariationById = async (req, res) => {
  const id = req.params.id;

  try {
    await prisma.$executeRaw`DELETE FROM food_variations WHERE idfood_variations = ${Number(id)}`;
    res.json({ message: 'Food Variation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
