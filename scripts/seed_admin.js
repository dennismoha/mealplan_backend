require('dotenv').config();
const { sequelize } = require('../models/orm');
const { bootstrapIdentityData } = require('../models/orm/bootstrap');

(async () => {
  try {
    await sequelize.authenticate();
    const result = await bootstrapIdentityData({ requireAdmin: true });
    console.log(result.created ? 'Administrator created successfully.' : 'Administrator already exists and is active.');
  } catch (error) {
    console.error(`Administrator seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
})();
