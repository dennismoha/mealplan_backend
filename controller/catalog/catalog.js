const { StatusCodes } = require('http-status-codes');
const IndexQuery = require('../query_utiltity/index');

const indexQuery = new IndexQuery();

// A read model for the frontend. It keeps the existing write APIs intact while
// exposing the relationships already present in the latest schema.
exports.getCatalog = async (req, res) => {
  const [categories, subcategories, foodItems, mealTypes, mealSlots, assignments, recipes] = await Promise.all([
    indexQuery.getAll('SELECT * FROM foodcategory ORDER BY category_name'),
    indexQuery.getAll('SELECT * FROM foodsubcategory ORDER BY subcategory_name'),
    indexQuery.getAll('SELECT * FROM fooditems ORDER BY food_name'),
    indexQuery.getAll('SELECT * FROM mealtype ORDER BY meal_name'),
    indexQuery.getAll('SELECT mealName, mealID FROM meals ORDER BY mealName'),
    indexQuery.getAll(`
      SELECT mmt.meal_mealTypeID, m.mealName, m.mealID,
             mt.meal_name, mt.mealTypesID
      FROM mealmealtype mmt
      JOIN meals m ON mmt.mealsID = m.mealID
      JOIN mealtype mt ON mmt.mealTypeID = mt.mealTypesID
      ORDER BY m.mealName, mt.meal_name
    `),
    indexQuery.getAll('SELECT * FROM recipe ORDER BY title'),
  ]);

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    data: { categories, subcategories, foodItems, mealTypes, mealSlots, assignments, recipes },
    status: 'Catalog retrieved successfully',
  });
};
