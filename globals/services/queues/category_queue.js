const { CATEGORY_UPDATE, CATEGORY_DELETE } = require('../../../constants');
const categoryWorker = require('../../workers/category_worker');
const { BaseQueue } = require('./base-queue');

class CategoryQueue extends BaseQueue {
  constructor() {
    super('categoryQueue');
    // eslint-disable-next-line camelcase
    this.processJob('addCategoriesToDb', 5, categoryWorker.addCategoryToDb);
    this.processJob(CATEGORY_UPDATE, 5, categoryWorker.updateCategoryInDb);
    this.processJob(CATEGORY_DELETE, 5, categoryWorker.deleteCategoryInDb);
  }

  addCategoryJob(name, data) {
    this.addJob(name, data);
  }
}

module.exports = new CategoryQueue();
