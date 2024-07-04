const { createClient } = require('redis');
const config = require('../../../config')

class BaseCache {
  client;

  constructor() {
    if (this.constructor === BaseCache) {
      throw new Error('Cannot instantiate abstract class');
    }
   // this.client = createClient({ url: 'redis://redis:6379' }); // this is for using docker 
   // this.client = createClient({ url: 'redis://localhost:6379' });// this is for localhost
   this.client = createClient({ url: config.REDIS_HOST, port:config.REDIS_PORT, password:config.REDIS_PASSWORD});  
    this.#cacheError();
  }

  #cacheError() {
    this.client.on('error', (error) => {
      console.log('redis error is ,', error);
    });
  }
}

module.exports = { BaseCache };
