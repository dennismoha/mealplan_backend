-- Additive milestone 4–7 migration. Existing rows are preserved.
ALTER TABLE mealplantime ADD COLUMN plan_goal VARCHAR(45) NOT NULL DEFAULT 'balanced';
ALTER TABLE mealplantime ADD COLUMN description TEXT NULL;
ALTER TABLE recipe MODIFY idrecipe INT NOT NULL AUTO_INCREMENT;
ALTER TABLE recipe ADD COLUMN owner_user_id INT NULL;
ALTER TABLE recipe ADD COLUMN video_url TEXT NULL;
ALTER TABLE recipe ADD COLUMN base_recipe_id CHAR(36) NULL;

CREATE TABLE countries (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(3) NOT NULL UNIQUE,
  description TEXT NULL,
  image_url TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE food_item_countries (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, food_item_id CHAR(36) NOT NULL, country_id INT NOT NULL, UNIQUE KEY food_country_unique (food_item_id,country_id));
CREATE TABLE meal_type_countries (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, meal_type_id CHAR(36) NOT NULL, country_id INT NOT NULL, UNIQUE KEY meal_country_unique (meal_type_id,country_id));
CREATE TABLE food_nutrition (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, food_item_id CHAR(36) NOT NULL UNIQUE, serving_size_g DECIMAL(8,2), energy_kcal DECIMAL(8,2), protein_g DECIMAL(8,2), carbohydrates_g DECIMAL(8,2), fat_g DECIMAL(8,2), fiber_g DECIMAL(8,2), source VARCHAR(255), updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
CREATE TABLE recipe_food_items (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, recipe_id CHAR(36) NOT NULL, food_item_id CHAR(36) NOT NULL, quantity VARCHAR(100), notes VARCHAR(255), UNIQUE KEY recipe_food_unique (recipe_id,food_item_id));
