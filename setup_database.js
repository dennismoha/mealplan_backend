const prisma = require('./models/prisma');
const { redisConnection } = require('./globals/services/redis/redis.connection');
const { bootstrapIdentityData, seedReferenceCountries } = require('./models/bootstrap');

// Function to check database connection
async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('MySQL database is reachable.');
    // await seedReferenceCountries();
    const admin = await bootstrapIdentityData();
    if (admin.created) console.log('Initial administrator account created.');

    // Now check Redis connection
    await redisConnection.redisPingAsync();
    console.log('Redis server is reachable. Starting the application...');

    return;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the application if connection fails
  } finally {
      await prisma.$disconnect(); // Disconnect Prisma Client
    }
}

async function closeDatabaseConnection() {
  await prisma.$disconnect();
  console.log('database pool connection closed success');
  return;
}

// Call the function to check database connection when the application starts
//export default the function to check database connection when the application starts
module.exports = { checkDatabaseConnection, closeDatabaseConnection };
