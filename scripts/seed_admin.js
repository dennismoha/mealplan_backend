require('dotenv').config();
const prisma = require('../models/prisma');
const { bootstrapIdentityData } = require('../models/bootstrap');

(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const result = await bootstrapIdentityData({ requireAdmin: true });
    console.log(result.created ? 'Administrator created successfully.' : 'Administrator already exists and is active.');
  } catch (error) {
    console.error(`Administrator seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
