const mysql = require('mysql2');

// setting up mysql pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'meal_plan',
//   password: '@$$Mys256',
//   multipleStatements: true // if abused may enhance grounds for injection as per the documentation
// });

const pool = mysql.createPool({
  host: 'mysql',
  port: '3306',
  user: 'myuser',
  password: 'pass',
  database: 'mealplan'
});

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   port: '8012',
//   database: 'meal_plan',
//   password: 'root',
//   multipleStatements: true // if abused may enhance grounds for injection as per the documentation
// });

module.exports = pool.promise();
