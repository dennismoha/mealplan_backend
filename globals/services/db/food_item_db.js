const { FoodItem } = require('../../../models/orm');

class FoodItemDB {
  async addFoodItemToDB(data) { return FoodItem.create(data); }
  async fetchFoodItemsFromDb() { return FoodItem.findAll({ order: [['food_name', 'ASC']], raw: true }); }
  async fetchSingleFoodItemsFromDb(id) { return FoodItem.findAll({ where: { fooditem_cacheID: id }, raw: true }); }
  async updateFoodItemInDb(data) { return FoodItem.update(data, { where: { fooditem_cacheID: data.fooditem_cacheID } }); }
  async deleteFoodItemInDb(key) { return FoodItem.destroy({ where: { fooditem_cacheID: key } }); }
}
module.exports = new FoodItemDB();
