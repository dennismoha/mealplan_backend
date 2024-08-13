const path =require('path')
const cloudinary = require('cloudinary').v2

if(process.env.NODE_ENV === 'production'){
  require('dotenv').config({ path: '.env.production' })
}
require('dotenv').config();


class Config {
  MYSQL_HOST;
  REDIS_HOST;  
  MYSQL_USER;
  MYSQL_DATABASE;
  MYSQL_PASSWORD;
  MYSQL_PORT;
  REDIS_HOST;
  REDIS_PORT;
  REDIS_PASSWORD;
  LOCAL_REDIS_HOST;
  COOKIE_PASSWORD;
  SESSION_NAME;
  PORT;
  BASE_URL;
  CLOUDINARY_NAME;
  CLOUDINARY_API_KEY;
  CLOUDINARY_API_SECRET;

  constructor() {
    this.MYSQL_HOST = process.env.MYSQL_HOST;
    this.REDIS_HOST = process.env.REDIS_HOST;
    this.MYSQL_USER = process.env.MYSQL_USER
    this.MYSQL_DATABASE=process.env.MYSQL_DATABASE
    this.MYSQL_PASSWORD=process.env.MYSQL_PASSWORD
    this.MYSQL_PORT=process.env.MYSQL_PORT
    this.REDIS_HOST=process.env.REDIS_HOST
    this.REDIS_PORT=process.env.REDIS_PORT
    this.REDIS_PASSWORD=process.env.REDIS_PASSWORD
    this.LOCAL_REDIS_HOST=process.env.LOCAL_REDIS_HOST
    this.COOKIE_PASSWORD=process.env.COOKIE_PASSWORD
    this.SESSION_NAME=process.env.SESSION_NAME
    this.PORT = process.env.PORT
    this.BASE_URL = process.env.BASE_URL
    this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
    this.CLOUDINARY_API_KEY=process.env.CLOUDINARY_API_KEY
    this.CLOUDINARY_API_SECRET=process.env.CLOUDINARY_API_SECRET
  }

  // loop through each config to make sure it's key pair exists

  validateConfig() {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`${key} configuration is undefined`);
      }
    }
  }

  cloudinaryConfig(){
    cloudinary.config({
      cloud_name: this.CLOUDINARY_NAME,
      api_key: this.CLOUDINARY_API_KEY,
      api_secret: this.CLOUDINARY_API_SECRET
    })
  }
}

const config = new Config();

module.exports = config;
