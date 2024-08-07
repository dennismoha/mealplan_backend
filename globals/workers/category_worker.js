const foodCategory = require('../services/db/food_category_db');

class CategoryWorker {
  addCategoryToDb(job, done) {
    console.log('on production adding category to db')
    try {
      console.log('jobqueue', 'done ');
      foodCategory.addFoodCategoryToDB(job.data);
      done(null, job.data);
    } catch (error) {
      console.log('error is ', error);
      done(error);
    }
  }

  // UPDATE CATEGORY
  updateCategoryInDb(job, done) {
    try {
      console.log('jobqueue', 'done ', job.data);
      foodCategory.updateCategoryInDB(job.data);
      done(null, job.data);
    } catch (error) {
      console.log('error is ', error);
      done(error);
    }
  }

  // DELETE CATEGORY
  deleteCategoryInDb(job, done) {
    try {
      console.log('jobqueue', 'done ', job.data);
      foodCategory.deleteFoodCategory(job.data);
      done(null, job.data);
    } catch (error) {
      console.log('error is ', error);
      done(error);
    }
  }
}
let categoryWorker = new CategoryWorker();
module.exports = categoryWorker;
