/* eslint-disable camelcase */

const FoodCategoryQuery = require('#mealplan/globals/services/db/db_query_utilities.js')
const foodCategoryQuery = new FoodCategoryQuery();
const { categoryRedis } = require('../redis/food_category_redis');




class FoodCategory {
  async addFoodCategoryToDB(data) {
    const { categoryName, description, imageURL } = data;
    
    const insertSql = 'INSERT INTO foodcategory (category_name, description, image_url) VALUES (?, ? ,?)';

    const FoodCategoryQuerys = await foodCategoryQuery.insertNewRecord(insertSql, [
      categoryName,
      description,
      imageURL
    ]);
    console.log('food added ', FoodCategoryQuerys);
    return;
  }

  // fetch single category from db

  async fetchSingleCategoryFromDb(id) {
    const sql = `
      SELECT 
      fc.*,
      JSON_ARRAYAGG(JSON_OBJECT('foodItemID', fi.food_itemID, 'name', fi.food_name, 'image_url',fi.image_url, 'descriptionl', fi.descriptionl)) AS foodItems
  FROM 
      foodcategory fc
  LEFT JOIN 
      fooditems fi ON fc.food_categoryID = fi.category_id
  WHERE 
      fc.food_categoryID = ?
  GROUP BY 
      fc.food_categoryID;
  `;

    let foodCategoryResults = await query.checkIfRecordExists(sql, [id]);

    foodCategoryResults = foodCategoryResults[0];
    const { food_categoryID } = foodCategoryResults;

    const checkIfFoodItemsNull = foodCategoryResults.foodItems.every(
      (item) => item.name === null && item.image_url === null && item.foodItemID === null && item.descriptionl === null
    );
    // if category contains no foodItems we return [] instead of null
    if (checkIfFoodItemsNull) {
      foodCategoryResults = {
        ...foodCategoryResults,
        foodItems: []
      };
    }

    return foodCategoryResults;
  }

  // update category
  async updateCategoryInDB(data) {
    console.log('data is ', data, 'id ');
    const { categoryName, description } = data.data;
    let id = data.id;

    const updateSql = 'UPDATE foodcategory SET category_name = ?, description = ? WHERE food_categoryID = ?';

    await foodCategoryQuery.updateRecord(updateSql, [categoryName, description, id]);

    return;
  }

  // delete category in db

  async deleteFoodCategory(id) {
    // if no go direct and remove it from the db

    const sql = 'delete  from foodcategory where food_categoryId  = ?';

    await foodCategoryQuery.deleteRecord(sql, [id.id]);
    return 1;
  }
}

const foodCategory = new FoodCategory();
module.exports = foodCategory;
