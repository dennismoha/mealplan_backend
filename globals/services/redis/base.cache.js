const { createClient } = require("redis");
const config = require("../../../config");

class BaseCache {
  client;

  constructor() {
    if (this.constructor === BaseCache) {
      throw new Error("Cannot instantiate abstract class");
    }

    if (process.env.NODE_ENV === "development") {
      // Code specific to development environment
      console.log("Running in development mode");
      this.client = createClient({ url: 'redis://redis:6379' }); // this is for using docker
    } else{
      // Code specific to production environment
      this.client = createClient({
        url: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
      });
      console.log("Running in production mode");
    }

    // this.client = createClient({ url: 'redis://redis:6379' }); // this is for using docker
    // this.client = createClient({ url: 'redis://localhost:6379' });// this is for localhost
 
    this.#cacheError();
  }

  #cacheError() {
    this.client.on("error", (error) => {
      console.log("redis error is ,", error);
    });
  }
}

module.exports = { BaseCache };
