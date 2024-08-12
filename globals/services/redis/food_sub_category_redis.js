/* eslint-disable camelcase */
const { BaseCache } = require('./base.cache');
const DatabaseError = require('../../../middlewares/custom_errors/database_error');
const { generateRandomScore } = require('../../helpers/helpers');
const { FOOD_ITEM_SET, FOOD_ITEM_HASH, CATEGORY_SET, CATEGORY_HASH } = require('../../../constants');
const _ = require('lodash');

class CategoryRedis extends BaseCache {
  constructor() {
    super('categoryCache');
  }

  async saveCategoryToCache(key, data) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const { category_name, description, image_url, foodItems } = data; // Changed variables to deal with categories

      const dataToSave = {
        category_name: `${category_name}`,
        description: `${description}`,
        image_url: `${image_url}`,
        category_cacheID: `${key}`,
        foodItems: JSON.stringify(foodItems)
      };

      const multi = this.client.multi();

      let scores = generateRandomScore(1, 10000);

      multi.zAdd(CATEGORY_SET, { score: scores, value: `${key}` });

      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        multi.HSET(`${CATEGORY_HASH}:${key}`, `${itemKey}`, `${itemValue}`);
      }

      multi.exec();
    } catch (error) {
      console.log('error connecting to redis', error);
      throw new DatabaseError('something went wrong');
    }
  }

  async updateSingleCategoryInCache(data) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const { categoryName, description, imageURL, category_cacheID } = data; // Changed variables to deal with categories
      let key = category_cacheID;
      const dataToSave = {
        category_name: `${categoryName}`,
        description: `${description}`,
        image_url: `${imageURL}`,
        category_cacheID: `${category_cacheID}`
      };

      const multi = this.client.multi();
      console.log('the redis key is ', category_cacheID);
      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        multi.HSET(`${CATEGORY_HASH}:${key}`, `${itemKey}`, `${itemValue}`);
      }

      multi.exec();
      const category = await this.client.hGetAll(`${CATEGORY_HASH}:${key}`);
      console.log('updated category is ', category);
      return category;
    } catch (error) {
      console.log('error connecting to redis', error);
      throw new DatabaseError('something went wrong');
    }
  }

  async selectAllCategoriesFromCache(key, start, end) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const categoryKeys = await this.client.zRange(key, start, end);

      const multi = this.client.multi();

      for (const value of categoryKeys) {
        multi.hGetAll(`${CATEGORY_HASH}:${value}`);
      }
      const categories = await multi.exec();

      return categories;
    } catch (error) {
      console.log('error connecting to redis');
      throw error;
    }
  }

  // check if category exists on cache

  async checkIfCategoryExistsOnCache(key) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      console.log('category key is ', key);
      // check if key exists in cache. if it does then the hash exists otherwise it doesn't
      // we use the Zrank to retrieve the index or position of a member in a sorted set
      const numberOfCategoriesInSet = await this.client.zRank(CATEGORY_SET, key);
      console.log('number of categories in set ', numberOfCategoriesInSet);
      if (numberOfCategoriesInSet === null) {
        console.log("doesn't exists");
        return 0;
      }
      console.log(' exists !!!!!');
      return 1;
    } catch (error) {
      console.log('something went wrong in cachecache error');
      throw new Error('Something went wrong please refresh the page');
    }
  }

  async selectSingleCategoryFromCache(key) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      let category = await this.client.HGETALL(`${CATEGORY_HASH}:${key}`);

      //cache miss
      if (_.isEmpty(category)) {
        return;
      }
      category = { ...category, foodItems: JSON.parse(category.foodItems) };

      return category;
    } catch (error) {
      console.log('error connecting to redis');
      throw error;
    }
  }

  async deleteSingleCategoryFromCache(key) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const multi = this.client.multi();
      multi.zRem(CATEGORY_SET, `${key}`);
      multi.del(`${CATEGORY_HASH}:${key}`);
      multi.exec();

      return;
    } catch (error) {
      console.log('error connecting to redis');
      throw error;
    }
  }
}

const categoryRedis = new CategoryRedis();

module.exports = { categoryRedis };
