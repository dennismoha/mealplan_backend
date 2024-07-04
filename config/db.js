const mysql = require('mysql2');
const config = require('../config')



const pool = mysql.createPool({
  host: config.MYSQL_HOST,
  user: config.MYSQL_USER,
  port: config.MYSQL_PORT,
  database: config.MYSQL_DATABASE,
  password: config.MYSQL_PASSWORD,
  multipleStatements: true // if abused may enhance grounds for injection as per the documentation
});




module.exports = pool.promise();
