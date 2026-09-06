const { v4: uuidv4 } = require('uuid');
const prisma = require('../../../models/prisma');

class FoodCategoryRepository {
  async addFoodCategoryToDB(data) { return prisma.foodcategory.create({ data: { category_name: data.categoryName, description: data.description, image_url: data.imageURL, food_categoryID: uuidv4() } }); }
  async fetchSingleCategoryFromDb(id) { return prisma.foodcategory.findUnique({ where: { food_categoryID: id }, include: { fooditems: true } }); }
  async updateCategoryInDB({ id, data }) { return prisma.foodcategory.update({ data: { category_name: data.categoryName, description: data.description, image_url: data.imageURL }, where: { food_categoryID: id } }); }
  async deleteFoodCategory({ id }) { return prisma.foodcategory.delete({ where: { food_categoryID: id } }); }
}
module.exports = new FoodCategoryRepository();
