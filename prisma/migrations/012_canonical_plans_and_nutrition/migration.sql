ALTER TABLE mealtype ADD COLUMN owner_user_id INT NULL, ADD COLUMN servings INT NOT NULL DEFAULT 1;
ALTER TABLE food_nutrition ADD COLUMN price_per_100g DECIMAL(10,2) NULL, ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'KES';
ALTER TABLE meal_type_food_items ADD COLUMN grams DECIMAL(10,2) NULL;
ALTER TABLE recipe_food_items ADD COLUMN grams DECIMAL(10,2) NULL;
ALTER TABLE meal_combination_items ADD COLUMN portion_multiplier DECIMAL(10,2) NOT NULL DEFAULT 1;
CREATE TABLE legacy_meal_alias (legacy_id VARCHAR(36) PRIMARY KEY, dish_id VARCHAR(36) NOT NULL) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- Existing names are canonical when both tables contain the same dish.
INSERT INTO mealtype (mealTypesID, meal_name, local_name, description, image_url, video_url, pronunciation_url, country_id)
SELECT m.mealID, m.mealName, m.local_name, m.description, m.image_url, m.video_url, m.pronunciation_url, m.country_id
FROM meals m LEFT JOIN mealtype d ON d.meal_name=m.mealName WHERE d.mealTypesID IS NULL;
INSERT INTO legacy_meal_alias SELECT m.mealID, d.mealTypesID FROM meals m JOIN mealtype d ON d.meal_name=m.mealName;
INSERT INTO meal_type_food_items (meal_type_id, food_item_id, quantity, unit, preparation_notes)
SELECT a.dish_id, f.food_item_id, f.quantity, f.unit, f.preparation_notes FROM meal_food_items f JOIN legacy_meal_alias a ON a.legacy_id=f.meal_id
LEFT JOIN meal_type_food_items x ON x.meal_type_id=a.dish_id AND x.food_item_id=f.food_item_id WHERE x.id IS NULL;
INSERT INTO meal_type_preparation_sources (meal_type_id, source_type, source_url, title)
SELECT a.dish_id, s.source_type, s.source_url, s.title FROM meal_preparation_sources s JOIN legacy_meal_alias a ON a.legacy_id=s.meal_id
WHERE NOT EXISTS (SELECT 1 FROM meal_type_preparation_sources x WHERE x.meal_type_id=a.dish_id AND x.source_url=s.source_url);
INSERT INTO meal_type_images (meal_type_id, image_url, image_order)
SELECT a.dish_id, s.image_url, s.image_order FROM meal_images s JOIN legacy_meal_alias a ON a.legacy_id=s.meal_id
WHERE NOT EXISTS (SELECT 1 FROM meal_type_images x WHERE x.meal_type_id=a.dish_id AND x.image_url=s.image_url);
INSERT INTO meal_type_countries (meal_type_id, country_id)
SELECT d.mealTypesID, d.country_id FROM mealtype d WHERE d.country_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM meal_type_countries c WHERE c.meal_type_id=d.mealTypesID AND c.country_id=d.country_id);
ALTER TABLE mealplan ADD COLUMN breakfast_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
UPDATE mealplan p JOIN mealtype d ON p.`breakfast`=d.meal_name SET p.breakfast_id=d.mealTypesID;
ALTER TABLE mealplan ADD CONSTRAINT plan_breakfast_dish FOREIGN KEY (breakfast_id) REFERENCES mealtype(mealTypesID) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE mealplan ADD COLUMN morning_break_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
UPDATE mealplan p JOIN mealtype d ON p.`morning_break`=d.meal_name SET p.morning_break_id=d.mealTypesID;
ALTER TABLE mealplan ADD CONSTRAINT plan_morning_break_dish FOREIGN KEY (morning_break_id) REFERENCES mealtype(mealTypesID) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE mealplan ADD COLUMN lunch_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
UPDATE mealplan p JOIN mealtype d ON p.`Lunch`=d.meal_name SET p.lunch_id=d.mealTypesID;
ALTER TABLE mealplan ADD CONSTRAINT plan_lunch_dish FOREIGN KEY (lunch_id) REFERENCES mealtype(mealTypesID) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE mealplan ADD COLUMN evening_break_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
UPDATE mealplan p JOIN mealtype d ON p.`evening_break`=d.meal_name SET p.evening_break_id=d.mealTypesID;
ALTER TABLE mealplan ADD CONSTRAINT plan_evening_break_dish FOREIGN KEY (evening_break_id) REFERENCES mealtype(mealTypesID) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE mealplan ADD COLUMN supper_id VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
UPDATE mealplan p JOIN mealtype d ON p.`supper`=d.meal_name SET p.supper_id=d.mealTypesID;
ALTER TABLE mealplan ADD CONSTRAINT plan_supper_dish FOREIGN KEY (supper_id) REFERENCES mealtype(mealTypesID) ON DELETE RESTRICT ON UPDATE CASCADE;
