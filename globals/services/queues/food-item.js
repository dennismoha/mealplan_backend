const { FOODITEMQUEUE, UPDATEFOODITEMQUEUE, DELETEFOODITEMQUEUE } = require('../../../constants');
const foodItemWorker = require('../../workers/food_item_worker');

const { BaseQueue } = require('./base-queue');

class FoodItemQueue extends BaseQueue {
  constructor() {
    super('FOODITEMQUEUE');
    // eslint-disable-next-line camelcase
    this.processJob(FOODITEMQUEUE, 5, foodItemWorker.addFoodItemToDb);
    this.processJob(UPDATEFOODITEMQUEUE, 5, foodItemWorker.updateFoodItemToDb);
    this.processJob(DELETEFOODITEMQUEUE, 5, foodItemWorker.deleteFoodItemToDb);
  }

  addFoodItemJob(name, data) {
    this.addJob(name, data);
  }
}

module.exports = new FoodItemQueue();
