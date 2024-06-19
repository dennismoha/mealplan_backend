-- Table structure for table `foodcategory`
CREATE TABLE foodcategory (
  idFoodCategory SERIAL PRIMARY KEY,
  category_name VARCHAR(45) NOT NULL,
  description TEXT,
  image_url TEXT,
  food_categoryID UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table `fooditems`
CREATE TABLE fooditems (
  idFoodItems SERIAL PRIMARY KEY,
  food_name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  food_itemID UUID NOT NULL DEFAULT uuid_generate_v4(),
  category_id UUID,
  fooditem_cacheID VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES foodcategory (food_categoryID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Table structure for table `fooditemsimages`
CREATE TABLE fooditemsimages (
  idfoodItemsImages SERIAL PRIMARY KEY,
  food_items_image_ID UUID,
  foodItems_ID UUID,
  images_ID UUID,
  FOREIGN KEY (foodItems_ID) REFERENCES fooditems (food_itemID) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (images_ID) REFERENCES images (image_urlID) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table structure for table `images`
CREATE TABLE images (
  idimages SERIAL PRIMARY KEY,
  image_url VARCHAR(45),
  image_urlID UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table `mealmealtype`
CREATE TABLE mealmealtype (
  ID SERIAL PRIMARY KEY,
  meal_mealTypeID UUID NOT NULL DEFAULT uuid_generate_v4(),
  mealsID UUID,
  mealTypeID UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mealsID) REFERENCES meals (mealID) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (mealTypeID) REFERENCES mealtype (mealTypesID) ON UPDATE CASCADE
);

-- Table structure for table `mealplan`
CREATE TABLE mealplan (
  idMealPlan SERIAL PRIMARY KEY,
  day_of_week VARCHAR(255) NOT NULL,
  breakfast VARCHAR(255),
  morning_break VARCHAR(255),
  "Lunch" VARCHAR(255),
  evening_break VARCHAR(255),
  supper VARCHAR(255),
  mealplan_key VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mealplan_key) REFERENCES mealplantime (meal_plan_name) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table structure for table `mealplantime`
CREATE TABLE mealplantime (
  idmealPlanWeek SERIAL PRIMARY KEY,
  meal_plan_name VARCHAR(45) NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table `meals`
CREATE TABLE meals (
  Id SERIAL PRIMARY KEY,
  mealName VARCHAR(255) NOT NULL,
  mealID UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table `mealtype`
CREATE TABLE mealtype (
  idtable1 SERIAL PRIMARY KEY,
  meal_name VARCHAR(255) NOT NULL,
  mealTypesID UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table `recipe`
CREATE TABLE recipe (
  idrecipe SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients TEXT,
  instructions TEXT,
  prep_time INT,
  cook_time INT,
  total_time INT,
  servings INT,
  cuisine VARCHAR(100),
  difficulty VARCHAR(50),
  meal_type VARCHAR(50),
  recipe_ID UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  meal_typeID UUID,
  FOREIGN KEY (meal_typeID) REFERENCES mealtype (mealTypesID) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table structure for table `recipes_images`
CREATE TABLE recipes_images (
  idrecipes_images SERIAL PRIMARY KEY,
  recipes_images_ID UUID NOT NULL DEFAULT uuid_generate_v4(),
  recipes_ID UUID,
  image_ID UUID,
  FOREIGN KEY (recipes_ID) REFERENCES recipe (recipe_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (image_ID) REFERENCES images (image_urlID) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Table structure for table `roles`
CREATE TABLE roles (
  idroles SERIAL PRIMARY KEY,
  role_type VARCHAR(45) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table `users`
CREATE TABLE users (
  idusers SERIAL PRIMARY KEY,
  email VARCHAR(45) NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(45),
  userscol VARCHAR(45),
  reset_token TEXT,
  reset_token_expiration TEXT,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role) REFERENCES roles (role_type)
);
