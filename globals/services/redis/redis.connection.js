const { BaseCache } = require('./base.cache');

class RedisConnection extends BaseCache {
  constructor() {
    super();
  }

  async connect() {
    try {
      console.log('connecting to redis');
      await this.client.connect();
    } catch (error) {
      console.log('error connecting to redis');
    }
  }

  async redisPingAsync() {
    try {
      await this.client.connect();
      const result = await this.client.ping();
      if (result !== 'PONG') {
        throw new Error('Redis server is not responding properly.');
      }
    } catch (error) {
      throw new Error(`Error pinging Redis server: ${error.message}`);
    }
  }
}

const redisConnection = new RedisConnection();

module.exports = { redisConnection };
