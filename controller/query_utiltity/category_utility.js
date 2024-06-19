const db = require('../../config/db');

class CategoryQuery {
  async getAllCategories() {
    const sql = 'select * from category ';
    let categories = await db.execute(sql);
    categories = categories[0];
    console.log(categories);
    return categories;
  }
}

module.exports = CategoryQuery;
