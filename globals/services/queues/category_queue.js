const { CATEGORY_UPDATE, CATEGORY_DELETE, CATEGORY_ADD_TO_DB } = require('../../../constants');
const categoryWorker = require('../../workers/category_worker');
const { BaseQueue } = require('./base-queue');

class CategoryQueue extends BaseQueue {
  constructor() {
    super('categoryQueue');
    // eslint-disable-next-line camelcase
    this.processJob(CATEGORY_ADD_TO_DB, 5, categoryWorker.addCategoryToDb);
    this.processJob(CATEGORY_UPDATE, 5, categoryWorker.updateCategoryInDb);
    this.processJob(CATEGORY_DELETE, 5, categoryWorker.deleteCategoryInDb);
  }

  addCategoryJob(name, data) {
    this.addJob(name, data);
  }
}

module.exports = new CategoryQueue();
