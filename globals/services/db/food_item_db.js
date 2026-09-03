const { v4: uuidv4 } = require('uuid');
const prisma = require('../../../models/prisma');

class FoodItemDB {
  async addFoodItemToDB(data) { return prisma.fooditems.create({ data: { ...data, food_itemID: data.food_itemID || uuidv4() } }); }
  async fetchFoodItemsFromDb() { return prisma.fooditems.findMany({ orderBy: { food_name: 'asc' } }); }
  async fetchSingleFoodItemsFromDb(id) { return prisma.fooditems.findMany({ where: { fooditem_cacheID: id } }); }
  async updateFoodItemInDb(data) { return prisma.fooditems.updateMany({ data, where: { fooditem_cacheID: data.fooditem_cacheID } }); }
  async deleteFoodItemInDb(key) { return prisma.fooditems.deleteMany({ where: { fooditem_cacheID: key } }); }
}
module.exports = new FoodItemDB();
