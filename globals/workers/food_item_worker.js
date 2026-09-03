const foodItemDB = require('../services/db/food_item_db');

class FoodItemWorker {
  async addFoodItemToDb(job, done) {
    try {
      console.log('jobqueue', 'done ');
      await foodItemDB.addFoodItemToDB(job.data);
      done(null, job.data);
    } catch (error) {
      console.log('error is ', error);
      done(error);
    }
  }
  async updateFoodItemToDb(job, done) {
    try {
      console.log('jobqueue', 'done ');
      await foodItemDB.updateFoodItemInDb(job.data);
      done(null, job.data);
    } catch (error) {
      console.log('error is ', error);
      done(error);
    }
  } // delete food item from db
  async deleteFoodItemToDb(job, done) {
    try {
      console.log('jobqueue', 'done ');
      await foodItemDB.deleteFoodItemInDb(job.data);
      done(null, job.data);
    } catch (error) {
      console.log('error is ', error);
      done(error);
    }
  }
}
let foodItemWorker = new FoodItemWorker();
module.exports = foodItemWorker;
