const foodItemDB = require('../services/db/food_item_db');

class FoodItemWorker {
  addFoodItemToDb(job, done) {
    try {
      console.log('jobqueue', 'done ');
      foodItemDB.addFoodItemToDB(job.data);
      done(null, job.data);
    } catch (error) {
      console.log('error is ', error);
      done(error);
    }
  }
  updateFoodItemToDb(job, done) {
    try {
      console.log('jobqueue', 'done ');
      foodItemDB.updateFoodItemInDb(job.data);
      done(null, job.data);
    } catch (error) {
      console.log('error is ', error);
      done(error);
    }
  } // delete food item from db
  deleteFoodItemToDb(job, done) {
    try {
      console.log('jobqueue', 'done ');
      foodItemDB.deleteFoodItemInDb(job.data);
      done(null, job.data);
    } catch (error) {
      console.log('error is ', error);
      done(error);
    }
  }
}
let foodItemWorker = new FoodItemWorker();
module.exports = foodItemWorker;
