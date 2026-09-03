const { sequelize } = require('./models/orm');
const { redisConnection } = require('./globals/services/redis/redis.connection');
const { bootstrapIdentityData, ensureOwnershipSchema, ensureFoodCultureSchema } = require('./models/orm/bootstrap');

// Function to check database connection
async function checkDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('MySQL database is reachable.');
    await ensureOwnershipSchema();
    await ensureFoodCultureSchema();
    const admin = await bootstrapIdentityData();
    if (admin.created) console.log('Initial administrator account created.');

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
  await sequelize.close();
  console.log('database pool connection closed success');
  return;
}

// Call the function to check database connection when the application starts
//export default the function to check database connection when the application starts
module.exports = { checkDatabaseConnection, closeDatabaseConnection };
