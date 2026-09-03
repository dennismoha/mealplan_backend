const { FoodCategory, FoodItem } = require('../../../models/orm');

class FoodCategoryRepository {
  async addFoodCategoryToDB(data) { return FoodCategory.create({ category_name: data.categoryName, description: data.description, image_url: data.imageURL }); }
  async fetchSingleCategoryFromDb(id) { return FoodCategory.findOne({ where: { food_categoryID: id }, include: [{ model: FoodItem, as: 'foodItems', required: false }] }); }
  async updateCategoryInDB({ id, data }) { return FoodCategory.update({ category_name: data.categoryName, description: data.description, image_url: data.imageURL }, { where: { food_categoryID: id } }); }
  async deleteFoodCategory({ id }) { return FoodCategory.destroy({ where: { food_categoryID: id } }); }
}
module.exports = new FoodCategoryRepository();
