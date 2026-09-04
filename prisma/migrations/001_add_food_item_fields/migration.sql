-- Add missing fields to fooditems table
ALTER TABLE `fooditems` 
ADD COLUMN `local_name` VARCHAR(255) NULL AFTER `food_name`,
ADD COLUMN `video_url` TEXT NULL AFTER `image_url`,
ADD COLUMN `pronunciation_url` TEXT NULL AFTER `video_url`,
ADD COLUMN `nutrient_description` TEXT NULL AFTER `pronunciation_url`;

-- Add image_url field to foodcategory if it doesn't have one (already exists, but ensuring)
-- Add image_url field to foodsubcategory
ALTER TABLE `foodsubcategory` 
ADD COLUMN `image_url` TEXT NULL AFTER `description`;

-- Create index for easier queries
CREATE INDEX `idx_fooditems_category` ON `fooditems`(`category_id`);
CREATE INDEX `idx_fooditems_country` ON `food_item_countries`(`country_id`);
