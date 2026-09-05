const { v4: uuidv4 } = require('uuid');
const prisma = require('../../../models/prisma');

const legacyFoodItemSelect = {
  idFoodItems: true,
  food_name: true,
  local_name: true,
  local_names: { include: { country: true }, orderBy: { id: "asc" } },
  descriptionl: true,
  image_url: true,
  video_url: true,
  pronunciation_url: true,
  pronunciation_public_id: true,
  nutrient_description: true,
  food_itemID: true,
  category_id: true,
  fooditem_cacheID: true,
  created_at: true,
  updated_at: true,
  foodsubcategory_id: true,
};

const withEnglishName = food => ({ ...food, english_name: food.food_name });

class FoodItemDB {
  async addFoodItemToDB(data) { return prisma.fooditems.create({ data: { ...data, food_itemID: data.food_itemID || uuidv4() }, include: { local_names: { include: { country: true } } } }); }
  async fetchFoodItemsFromDb() {
    const foods = await prisma.fooditems.findMany({ select: legacyFoodItemSelect, orderBy: { food_name: 'asc' } });
    return foods.map(withEnglishName);
  }
  async fetchSingleFoodItemsFromDb(id) {
    const foods = await prisma.fooditems.findMany({ select: legacyFoodItemSelect, where: { fooditem_cacheID: id } });
    return foods.map(withEnglishName);
  }
  async updateFoodItemInDb(data) { return prisma.fooditems.updateMany({ data, where: { fooditem_cacheID: data.fooditem_cacheID } }); }
  async deleteFoodItemInDb(key) { return prisma.fooditems.deleteMany({ where: { fooditem_cacheID: key } }); }
}
module.exports = new FoodItemDB();
