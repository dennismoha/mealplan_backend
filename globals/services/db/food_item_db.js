/* eslint-disable camelcase */
const Query = require('./db_query_utilities');
const query = new Query();

class FoodItemDB {
  // add new food item to db
  async addFoodItemToDB(data) {
    const { food_name, descriptionl, image_url, category_id, fooditem_cacheID } = data;
    console.log('data in services is ', data);

    const insertQuery =
      'INSERT INTO fooditems (food_name, descriptionl, image_url, category_id, fooditem_cacheID) VALUES (?, ?, ?, ?,?)';
    const insertParams = [food_name, descriptionl, image_url, category_id, fooditem_cacheID];

    await query.insertNewRecord(insertQuery, insertParams);

    return;
  }

  //select all food items from db
  async fetchFoodItemsFromDb() {
    const sql = 'SELECT * FROM fooditems';
    let result = await query.getAll(sql);
    return result;
  }

  //select single food item from db
  async fetchSingleFoodItemsFromDb(id) {
    const sql = 'SELECT * FROM fooditems WHERE fooditem_cacheID = ?';
    const params = [id];
    let result = await query.checkIfRecordExists(sql, params);
    return result;
  }

  //update foodItem in the db
  async updateFoodItemInDb(data) {
    const { food_name, descriptionl, image_url, category_id, fooditem_cacheID } = data;
    const updated_at = new Date();
    const params = [food_name, descriptionl, image_url, category_id, updated_at, fooditem_cacheID];
    const sql =
      // eslint-disable-next-line max-len
      'UPDATE fooditems SET food_name = ?, descriptionl = ?, image_url = ?,  category_id = ?, updated_at = ? WHERE fooditem_cacheID = ?';
    const result = await query.updateRecord(sql, params);
    console.log('update results are ', result);
    return result;
  }

  //delete foodItem in the db
  async deleteFoodItemInDb(key) {
    const sql = 'DELETE FROM fooditems WHERE fooditem_cacheID = ?';
    await query.deleteRecord(sql, [key]);
    return;
  }
}

const foodItemDB = new FoodItemDB();
module.exports = foodItemDB;
