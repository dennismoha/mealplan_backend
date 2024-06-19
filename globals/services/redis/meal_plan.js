const { promisify } = require('util');
const { MEAL_PLAN_HASH, MEAL_PLAN_SET_KEY } = require('../../../constants');
const DatabaseError = require('../../../middlewares/custom_errors/database_error');
const { BaseCache } = require('./base.cache');
const { generateRandomScore } = require('../../helpers/helpers');

class MealPlanRedis extends BaseCache {
  constructor() {
    super('mealPlanCache');
  }

  async saveMealPlanToCache(data) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const multi = this.client.multi();

      let scores = generateRandomScore(1, 10000);

      data.forEach((meal) => {
        console.log('meal is meal', meal.mealplankey);
        multi.zAdd(MEAL_PLAN_SET_KEY, { score: scores, value: `${meal.mealplankey}` });
      });

      // then we set the stringify and put it in list

      data.forEach((meal, index) => {
        const strinfigydata = JSON.stringify(data[index]);
        multi.lPush(`${MEAL_PLAN_HASH}:${meal.mealplankey}`, `${strinfigydata}`);
      });

      multi.exec();

      return;
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      throw new DatabaseError('Something went wrong while saving meal plan to cache');
    }
  }

  async getMealPlanFromCache() {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      // retrieve meal plan key from sets

      const mealPlanKeys = await this.client.zRange(MEAL_PLAN_SET_KEY, 0, -1);

      // once we fetch them all we loop through the hashes to fetch everything

      // Check if meal plan data exists
      if (!mealPlanKeys || Object.keys(mealPlanKeys).length === 0) {
        return null; // Meal plan not found in cache
      }

      const multi = this.client.multi();

      for (const value of mealPlanKeys) {
        multi.LRANGE(`${MEAL_PLAN_HASH}:${value}`, 0, -1);
      }
      let mealplans = await multi.exec();
      let mealplanList = [];

      for (const item of mealplans) {
        mealplanList.push(JSON.parse(item));
      }

      return mealplanList;
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      throw new DatabaseError('Something went wrong while getting meal plan from cache');
    }
  }

  async fetchSingleMealPlanFromCache(value) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      // Update meal plan data in hash
      const multi = this.client.multi();
      multi.LRANGE(`${MEAL_PLAN_HASH}:${value}`, 0, -1);

      const mealplan = await multi.exec();
      console.log('mealplan 11111: is ', mealplan);

      return mealplan;
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      throw new DatabaseError('Something went wrong while updating meal plan in cache');
    }
  }

  async updateMealPlanInCache(key, newData) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      // Update meal plan data in hash
      const multi = this.client.multi();

      console.log('the key is ', key);

      let mealplan = await this.fetchSingleMealPlanFromCache(key);
      // mealplan = mealplan;

      // const mealplan = await multi.exec();
      console.log('mealplan in update is ::: ', mealplan);
      return JSON.parse(mealplan);
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      throw new DatabaseError('Something went wrong while updating meal plan in cache');
    }
  }

  async appendMealToCache(data) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const multi = this.client.multi();

      let scores = generateRandomScore(1, 10000);

      multi.zAdd(MEAL_PLAN_SET_KEY, { score: scores, value: `${data.mealplan_key}` });

      // then we set the stringify and put it in list

      const strinfigydata = JSON.stringify(data);
      multi.rPush(`${MEAL_PLAN_HASH}:${data.mealplan_key}`, `${strinfigydata}`);

      multi.exec();

      return;
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      throw new DatabaseError('Something went wrong while appending meal plan to cache');
    }
  }

  async deleteMealPlanFromCache(key) {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      // Delete meal plan data from hash
      await this.client.del(`${MEAL_PLAN_HASH}:${key}`);
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      throw new DatabaseError('Something went wrong while deleting meal plan from cache');
    }
  }
}

const mealPlanRedis = new MealPlanRedis();

module.exports = { mealPlanRedis };
