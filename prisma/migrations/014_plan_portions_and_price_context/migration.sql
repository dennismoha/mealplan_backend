ALTER TABLE mealplan ADD COLUMN portions JSON NULL;
ALTER TABLE food_nutrition ADD COLUMN price_checked_at DATE NULL, ADD COLUMN price_source VARCHAR(255) NULL, ADD COLUMN price_location VARCHAR(150) NULL;
