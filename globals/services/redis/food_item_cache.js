/* eslint-disable camelcase */
const { BaseCache } = require('./base.cache');
const DatabaseError = require('../../../middlewares/custom_errors/database_error');
const { generateRandomScore } = require('../../helpers/helpers');
const { FOOD_ITEM_SET, FOOD_ITEM_HASH } = require('../../../constants');

class FoodItemRedis extends BaseCache {
  constructor() {
    super('foodItemCache');
  }

  async saveFoodItemToCache(key, data) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const { food_name, descriptionl, image_url, category_id } = data;
      const dataToSave = {
        food_name: `${food_name}`,
        descriptionl: `${descriptionl}`,
        image_url: `${image_url}`,
        category_id: `${category_id}`,
        fooditem_cachedID: `${key}`
      };

      const multi = this.client.multi();

      let scores = generateRandomScore(1, 10000);

      multi.zAdd(FOOD_ITEM_SET, { score: scores, value: `${key}` });

      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        // eslint-disable-next-line new-cap
        multi.HSET(`${FOOD_ITEM_HASH}:${key}`, `${itemKey}`, `${itemValue}`);
      }

      multi.exec();
    } catch (error) {
      console.log('error connecting to redis', error);
      new DatabaseError('something went wrong');
    }
  }

  // select all food items from cache.
  async selectAllFoodItemFromCache(key, start, end) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const foodItemsKeys = await this.client.zRange(key, start, end);

      const multi = this.client.multi();

      for (const value of foodItemsKeys) {
        multi.hGetAll(`${FOOD_ITEM_HASH}:${value}`);
      }
      const foodItems = await multi.exec();

      return foodItems;
    } catch (error) {
      console.log('error connecting to redis');
    }
  }

  // select one food item from cache.
  async selectSingleFoodItemFromCache(key) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const foodItems = await this.client.HGETALL(`${FOOD_ITEM_HASH}:${key}`);
      console.log('food items is ', foodItems);
      return [];
    } catch (error) {
      console.log('error connecting to redis');
    }
  }

  /*
   update food food item in cache.
   key here will be the cache id

  */
  async updateSingleFoodInFromCache(data) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const { food_name, descriptionl, image_url, category_id, fooditem_cacheID } = data;
      let key = fooditem_cacheID;
      const dataToSave = {
        food_name: `${food_name}`,
        descriptionl: `${descriptionl}`,
        image_url: `${image_url}`,
        category_id: `${category_id}`,
        fooditem_cacheID: `${fooditem_cacheID}`
      };

      const multi = this.client.multi();
      console.log('the redis key is ', fooditem_cacheID);
      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        // eslint-disable-next-line new-cap
        multi.HSET(`${FOOD_ITEM_HASH}:${key}`, `${itemKey}`, `${itemValue}`);
      }

      multi.exec();
      const foodItem = await this.client.hGetAll(`${FOOD_ITEM_HASH}:${key}`);
      console.log('updated food item is ', foodItem);
      return foodItem;
    } catch (error) {
      console.log('error connecting to redis', error);
      new DatabaseError('something went wrong');
    }
  }

  // delete one food item from cache.
  async deleteSingleFoodItemFromCache(key) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const multi = this.client.multi();
      // remove the fooditem key from the set
      multi.zRem(FOOD_ITEM_SET, `${key}`);

      // delete the fooditem in the hash
      multi.del(`${FOOD_ITEM_HASH}:${key}`);
      multi.exec();

      return;
    } catch (error) {
      console.log('error connecting to redis');
    }
  }
}

const foodItemRedis = new FoodItemRedis();

module.exports = { foodItemRedis };
