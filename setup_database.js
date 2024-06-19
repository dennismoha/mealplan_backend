const { pool } = require('./config/db');
const { redisConnection } = require('./globals/services/redis/redis.connection');

// Function to check database connection
async function checkDatabaseConnection() {
  try {
    // now get a Promise wrapped instance of that pool
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    console.log('Connected to MySQL database.');

    await connection.ping((pingErr) => {
      connection.release();
      if (!pingErr) {
        return;
      }
      process.exit(1);
    });
    console.log('MySQL database is reachable.');

    connection.release(); // Release the MySQL connection after using it

    // Now check Redis connection
    await redisConnection.redisPingAsync();
    console.log('Redis server is reachable. Starting the application...');

    return;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the application if connection fails
  }
}

async function closeDatabaseConnection() {
  const promisePool = pool.promise();
  promisePool.end((err) => {
    console.log('database pool connection closed err ', err);
    return;
  });
  console.log('database pool connection closed success');
  return;
}

// Call the function to check database connection when the application starts
//export default the function to check database connection when the application starts
module.exports = { checkDatabaseConnection, closeDatabaseConnection };
