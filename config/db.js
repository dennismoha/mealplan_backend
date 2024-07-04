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


//docker
// const pool = mysql.createPool({
//   host: 'mysql',
//   port: '3306',
//   user: 'myuser',
//   password: 'pass',
//   database: 'mealplan'
// });

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   port: '8012',
//   database: 'meal_plan',
//   password: 'root',
//   multipleStatements: true // if abused may enhance grounds for injection as per the documentation
// });

module.exports = pool.promise();
