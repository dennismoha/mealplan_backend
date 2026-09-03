const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  dialect: 'mysql',
  logging: process.env.LOG_SQL === 'true' ? console.log : false,
  define: { freezeTableName: true },
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

const baseOptions = { sequelize, timestamps: false, freezeTableName: true };

const FoodCategory = sequelize.define('FoodCategory', {
  idFoodCategory: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_name: { type: DataTypes.STRING(45), allowNull: false, unique: true },
  description: DataTypes.TEXT('medium'), image_url: DataTypes.TEXT,
  food_categoryID: { type: DataTypes.UUID, allowNull: false, unique: true, defaultValue: DataTypes.UUIDV4 },
  created_on: DataTypes.DATE, updated_on: DataTypes.DATE,
}, { ...baseOptions, tableName: 'foodcategory' });

const FoodSubcategory = sequelize.define('FoodSubcategory', {
  idFoodSubcategory: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  subcategory_name: { type: DataTypes.STRING(45), allowNull: false, unique: true },
  description: DataTypes.TEXT('medium'),
  foodsubcategory_id: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
  food_category_id: { type: DataTypes.UUID, allowNull: false },
  created_on: DataTypes.DATE, updated_on: DataTypes.DATE,
}, { ...baseOptions, tableName: 'foodsubcategory' });

const FoodItem = sequelize.define('FoodItem', {
  idFoodItems: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  food_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  descriptionl: DataTypes.TEXT, image_url: DataTypes.TEXT,
  food_itemID: { type: DataTypes.UUID, allowNull: false, unique: true, defaultValue: DataTypes.UUIDV4 },
  category_id: DataTypes.UUID, fooditem_cacheID: DataTypes.STRING(100),
  foodsubcategory_id: { type: DataTypes.UUID, allowNull: false },
  created_at: DataTypes.DATE, updated_at: DataTypes.DATE,
}, { ...baseOptions, tableName: 'fooditems' });

const MealPlanTime = sequelize.define('MealPlanTime', {
  idmealPlanWeek: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  meal_plan_name: { type: DataTypes.STRING(45), allowNull: false, unique: true },
  created_on: DataTypes.DATE, updated_at: DataTypes.DATE,
  owner_user_id: DataTypes.INTEGER,
  plan_goal: { type: DataTypes.STRING(45), defaultValue: 'balanced' }, description: DataTypes.TEXT,
}, { ...baseOptions, tableName: 'mealplantime' });

const MealPlan = sequelize.define('MealPlan', {
  idMealPlan: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  day_of_week: { type: DataTypes.STRING(255), allowNull: false },
  breakfast: DataTypes.STRING(255), morning_break: DataTypes.STRING(255),
  Lunch: DataTypes.STRING(255), evening_break: DataTypes.STRING(255), supper: DataTypes.STRING(255),
  mealplan_key: DataTypes.STRING(45), created_at: DataTypes.DATE, updated_at: DataTypes.DATE,
}, { ...baseOptions, tableName: 'mealplan' });

const Meal = sequelize.define('Meal', {
  Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  mealName: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  mealID: { type: DataTypes.UUID, allowNull: false, unique: true, defaultValue: DataTypes.UUIDV4 },
  created_at: DataTypes.DATE, updated_at: DataTypes.DATE,
}, { ...baseOptions, tableName: 'meals' });

const MealType = sequelize.define('MealType', {
  idtable1: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  meal_name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  mealTypesID: { type: DataTypes.UUID, allowNull: false, unique: true, defaultValue: DataTypes.UUIDV4 },
  created_at: DataTypes.DATE, updated_at: DataTypes.DATE,
}, { ...baseOptions, tableName: 'mealtype' });

const MealMealType = sequelize.define('MealMealType', {
  ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  meal_mealTypeID: { type: DataTypes.UUID, allowNull: false, unique: true, defaultValue: DataTypes.UUIDV4 },
  mealsID: DataTypes.UUID, mealTypeID: { type: DataTypes.UUID, allowNull: false },
  created_at: DataTypes.DATE, updated_at: DataTypes.DATE,
}, { ...baseOptions, tableName: 'mealmealtype' });

const Recipe = sequelize.define('Recipe', {
  idrecipe: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, title: { type: DataTypes.STRING(255), allowNull: false },
  description: DataTypes.TEXT, ingredients: DataTypes.TEXT, instructions: DataTypes.TEXT,
  prep_time: DataTypes.INTEGER, cook_time: DataTypes.INTEGER, total_time: DataTypes.INTEGER,
  servings: DataTypes.INTEGER, cuisine: DataTypes.STRING(100), difficulty: DataTypes.STRING(50),
  meal_type: DataTypes.STRING(50), recipe_ID: { type: DataTypes.UUID, allowNull: false, unique: true, defaultValue: DataTypes.UUIDV4 },
  created_at: DataTypes.DATE, updated_at: DataTypes.DATE, meal_typeID: DataTypes.UUID,
  owner_user_id: DataTypes.INTEGER, video_url: DataTypes.TEXT, base_recipe_id: DataTypes.UUID,
}, { ...baseOptions, tableName: 'recipe' });

const Role = sequelize.define('Role', {
  idroles: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  role_type: { type: DataTypes.STRING(45), allowNull: false, unique: true },
  created_at: DataTypes.DATE, updated_at: DataTypes.DATE,
}, { ...baseOptions, tableName: 'roles' });

const User = sequelize.define('User', {
  idusers: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(45), allowNull: false, unique: true },
  password: { type: DataTypes.TEXT, allowNull: false }, role: DataTypes.STRING(45),
  status: { type: DataTypes.STRING(45), field: 'userscol', defaultValue: 'active' },
  reset_token: DataTypes.TEXT, reset_token_expiration: DataTypes.TEXT,
  refresh_token: DataTypes.TEXT, created_at: DataTypes.DATE, updated_at: DataTypes.DATE,
}, { ...baseOptions, tableName: 'users' });

const Country = sequelize.define('Country', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, name: { type: DataTypes.STRING(100), allowNull: false, unique: true }, code: { type: DataTypes.STRING(3), allowNull: false, unique: true }, description: DataTypes.TEXT, image_url: DataTypes.TEXT, created_at: DataTypes.DATE, updated_at: DataTypes.DATE,
}, { ...baseOptions, tableName: 'countries' });
const FoodItemCountry = sequelize.define('FoodItemCountry', { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, food_item_id: DataTypes.UUID, country_id: DataTypes.INTEGER }, { ...baseOptions, tableName: 'food_item_countries' });
const MealTypeCountry = sequelize.define('MealTypeCountry', { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, meal_type_id: DataTypes.UUID, country_id: DataTypes.INTEGER }, { ...baseOptions, tableName: 'meal_type_countries' });
const FoodNutrition = sequelize.define('FoodNutrition', { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, food_item_id: { type: DataTypes.UUID, allowNull: false, unique: true }, serving_size_g: DataTypes.DECIMAL(8, 2), energy_kcal: DataTypes.DECIMAL(8, 2), protein_g: DataTypes.DECIMAL(8, 2), carbohydrates_g: DataTypes.DECIMAL(8, 2), fat_g: DataTypes.DECIMAL(8, 2), fiber_g: DataTypes.DECIMAL(8, 2), source: DataTypes.STRING(255), updated_at: DataTypes.DATE }, { ...baseOptions, tableName: 'food_nutrition' });
const RecipeFoodItem = sequelize.define('RecipeFoodItem', { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, recipe_id: DataTypes.UUID, food_item_id: DataTypes.UUID, quantity: DataTypes.STRING(100), notes: DataTypes.STRING(255) }, { ...baseOptions, tableName: 'recipe_food_items' });

FoodCategory.hasMany(FoodSubcategory, { foreignKey: 'food_category_id', sourceKey: 'food_categoryID', as: 'subcategories' });
FoodSubcategory.belongsTo(FoodCategory, { foreignKey: 'food_category_id', targetKey: 'food_categoryID', as: 'category' });
FoodCategory.hasMany(FoodItem, { foreignKey: 'category_id', sourceKey: 'food_categoryID', as: 'foodItems' });
FoodItem.belongsTo(FoodCategory, { foreignKey: 'category_id', targetKey: 'food_categoryID', as: 'category' });
FoodSubcategory.hasMany(FoodItem, { foreignKey: 'foodsubcategory_id', sourceKey: 'foodsubcategory_id', as: 'foodItems' });
FoodItem.belongsTo(FoodSubcategory, { foreignKey: 'foodsubcategory_id', targetKey: 'foodsubcategory_id', as: 'subcategory' });
MealPlanTime.hasMany(MealPlan, { foreignKey: 'mealplan_key', sourceKey: 'meal_plan_name', as: 'days' });
MealPlan.belongsTo(MealPlanTime, { foreignKey: 'mealplan_key', targetKey: 'meal_plan_name', as: 'interval' });
Meal.belongsToMany(MealType, { through: MealMealType, foreignKey: 'mealsID', otherKey: 'mealTypeID', sourceKey: 'mealID', targetKey: 'mealTypesID', as: 'mealTypes' });
MealType.belongsToMany(Meal, { through: MealMealType, foreignKey: 'mealTypeID', otherKey: 'mealsID', sourceKey: 'mealTypesID', targetKey: 'mealID', as: 'mealSlots' });
MealMealType.belongsTo(Meal, { foreignKey: 'mealsID', targetKey: 'mealID', as: 'meal' });
MealMealType.belongsTo(MealType, { foreignKey: 'mealTypeID', targetKey: 'mealTypesID', as: 'mealType' });
MealType.hasMany(Recipe, { foreignKey: 'meal_typeID', sourceKey: 'mealTypesID', as: 'recipes' });
Recipe.belongsTo(MealType, { foreignKey: 'meal_typeID', targetKey: 'mealTypesID', as: 'mealTypeDetails' });
Role.hasMany(User, { foreignKey: 'role', sourceKey: 'role_type', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role', targetKey: 'role_type', as: 'roleDetails' });
User.hasMany(MealPlanTime, { foreignKey: 'owner_user_id', as: 'ownedMealPlans' });
MealPlanTime.belongsTo(User, { foreignKey: 'owner_user_id', as: 'owner' });
Country.belongsToMany(FoodItem, { through: FoodItemCountry, foreignKey: 'country_id', otherKey: 'food_item_id', as: 'foodItems' });
FoodItem.belongsToMany(Country, { through: FoodItemCountry, foreignKey: 'food_item_id', otherKey: 'country_id', as: 'countries' });
Country.belongsToMany(MealType, { through: MealTypeCountry, foreignKey: 'country_id', otherKey: 'meal_type_id', as: 'mealTypes' });
MealType.belongsToMany(Country, { through: MealTypeCountry, foreignKey: 'meal_type_id', otherKey: 'country_id', as: 'countries' });
FoodItem.hasOne(FoodNutrition, { foreignKey: 'food_item_id', sourceKey: 'food_itemID', as: 'nutrition' });
Recipe.belongsToMany(FoodItem, { through: RecipeFoodItem, foreignKey: 'recipe_id', otherKey: 'food_item_id', sourceKey: 'recipe_ID', targetKey: 'food_itemID', as: 'foodItems' });
FoodItem.belongsToMany(Recipe, { through: RecipeFoodItem, foreignKey: 'food_item_id', otherKey: 'recipe_id', sourceKey: 'food_itemID', targetKey: 'recipe_ID', as: 'recipes' });
User.hasMany(Recipe, { foreignKey: 'owner_user_id', as: 'recipes' });

module.exports = { sequelize, FoodCategory, FoodSubcategory, FoodItem, MealPlanTime, MealPlan, Meal, MealType, MealMealType, Recipe, Role, User, Country, FoodItemCountry, MealTypeCountry, FoodNutrition, RecipeFoodItem };
