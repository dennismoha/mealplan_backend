-- Additive discovery-page fields. Existing data is preserved.
ALTER TABLE mealplantime ADD COLUMN budget_level VARCHAR(20) NOT NULL DEFAULT 'standard';
ALTER TABLE mealplantime ADD COLUMN estimated_cost DECIMAL(10,2) NULL;
ALTER TABLE mealplantime ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'KES';
ALTER TABLE mealplantime ADD COLUMN image_url TEXT NULL;
ALTER TABLE mealtype ADD COLUMN image_url TEXT NULL;
ALTER TABLE recipe ADD COLUMN image_url TEXT NULL;
