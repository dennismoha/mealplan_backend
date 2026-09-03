const bcrypt = require('bcrypt');
const { Role, User } = require('./index');

const APPLICATION_ROLES = ['user', 'professional', 'admin'];

async function bootstrapIdentityData({ requireAdmin = false } = {}) {
  await Promise.all(APPLICATION_ROLES.map(role_type => Role.findOrCreate({ where: { role_type } })));

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    if (requireAdmin) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required to seed an administrator');
    console.warn('Admin bootstrap skipped: set ADMIN_EMAIL and ADMIN_PASSWORD for fresh deployments.');
    return { created: false, reason: 'credentials-not-configured' };
  }
  if (password.length < 12) throw new Error('ADMIN_PASSWORD must contain at least 12 characters');

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    if (existing.role !== 'admin' || existing.status === 'revoked') await existing.update({ role: 'admin', status: 'active' });
    return { created: false, userId: existing.idusers };
  }

  const user = await User.create({ email, password: await bcrypt.hash(password, 12), role: 'admin', status: 'active' });
  return { created: true, userId: user.idusers };
}

async function ensureOwnershipSchema() {
  const queryInterface = require('./index').sequelize.getQueryInterface();
  const columns = await queryInterface.describeTable('mealplantime');
  if (!columns.owner_user_id) {
    await queryInterface.addColumn('mealplantime', 'owner_user_id', {
      type: require('sequelize').DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'idusers' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addIndex('mealplantime', ['owner_user_id'], { name: 'mealplantime_owner_user_id_idx' });
  }
}

async function ensureFoodCultureSchema() {
  const { sequelize } = require('./index');
  const { DataTypes } = require('sequelize');
  const qi = sequelize.getQueryInterface();
  const tables = (await qi.showAllTables()).map(String);
  const has = name => tables.some(table => table.toLowerCase() === name.toLowerCase());
  const timestamps = { created_at: { type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') }, updated_at: { type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') } };
  if (!has('countries')) await qi.createTable('countries', { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, name: { type: DataTypes.STRING(100), allowNull: false, unique: true }, code: { type: DataTypes.STRING(3), allowNull: false, unique: true }, description: DataTypes.TEXT, image_url: DataTypes.TEXT, ...timestamps });
  if (!has('food_item_countries')) await qi.createTable('food_item_countries', { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, food_item_id: { type: DataTypes.UUID, allowNull: false }, country_id: { type: DataTypes.INTEGER, allowNull: false } });
  if (!has('meal_type_countries')) await qi.createTable('meal_type_countries', { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, meal_type_id: { type: DataTypes.UUID, allowNull: false }, country_id: { type: DataTypes.INTEGER, allowNull: false } });
  if (!has('food_nutrition')) await qi.createTable('food_nutrition', { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, food_item_id: { type: DataTypes.UUID, allowNull: false, unique: true }, serving_size_g: DataTypes.DECIMAL(8,2), energy_kcal: DataTypes.DECIMAL(8,2), protein_g: DataTypes.DECIMAL(8,2), carbohydrates_g: DataTypes.DECIMAL(8,2), fat_g: DataTypes.DECIMAL(8,2), fiber_g: DataTypes.DECIMAL(8,2), source: DataTypes.STRING(255), updated_at: { type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') } });
  if (!has('recipe_food_items')) await qi.createTable('recipe_food_items', { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, recipe_id: { type: DataTypes.UUID, allowNull: false }, food_item_id: { type: DataTypes.UUID, allowNull: false }, quantity: DataTypes.STRING(100), notes: DataTypes.STRING(255) });
  const planColumns = await qi.describeTable('mealplantime');
  if (!planColumns.plan_goal) await qi.addColumn('mealplantime', 'plan_goal', { type: DataTypes.STRING(45), allowNull: false, defaultValue: 'balanced' });
  if (!planColumns.description) await qi.addColumn('mealplantime', 'description', { type: DataTypes.TEXT, allowNull: true });
  let recipeColumns = await qi.describeTable('recipe');
  if (!recipeColumns.idrecipe.autoIncrement) await qi.changeColumn('recipe', 'idrecipe', { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false });
  if (!recipeColumns.owner_user_id) await qi.addColumn('recipe', 'owner_user_id', { type: DataTypes.INTEGER, allowNull: true });
  recipeColumns = await qi.describeTable('recipe');
  if (!recipeColumns.video_url) await qi.addColumn('recipe', 'video_url', { type: DataTypes.TEXT, allowNull: true });
  recipeColumns = await qi.describeTable('recipe');
  if (!recipeColumns.base_recipe_id) await qi.addColumn('recipe', 'base_recipe_id', { type: DataTypes.UUID, allowNull: true });
  const { Country } = require('./index');
  await Promise.all([
    ['Kenya', 'KEN'], ['Mexico', 'MEX'], ['India', 'IND'], ['Italy', 'ITA'], ['Ethiopia', 'ETH']
  ].map(([name, code]) => Country.findOrCreate({ where: { code }, defaults: { name, description: `Explore foods and meals associated with ${name}.` } })));
}

module.exports = { APPLICATION_ROLES, bootstrapIdentityData, ensureOwnershipSchema, ensureFoodCultureSchema };
