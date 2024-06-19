const { createClient } = require('redis');

class BaseCache {
  client;

  constructor() {
    if (this.constructor === BaseCache) {
      throw new Error('Cannot instantiate abstract class');
    }
    this.client = createClient({ url: 'redis://redis:6379' });
    this.#cacheError();
  }

  #cacheError() {
    this.client.on('error', (error) => {
      console.log('redis error is ,', error);
    });
  }
}

module.exports = { BaseCache };
