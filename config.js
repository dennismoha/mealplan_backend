require('dotenv').config();

class Config {
  MYSQL_HOST;
  REDIS_HOST;

  constructor() {
    this.MYSQL_HOST = process.env.MYSQL_HOST;
    this.REDIS_HOST = process.env.REDIS_HOST;
  }

  // loop through each config to make sure it's key pair exists

  validateConfig() {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`${key} configuration is undefined`);
      }
    }
  }
}

const config = new Config();

module.exports = config;
