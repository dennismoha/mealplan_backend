-- Extend meals table with new fields for comprehensive meal creation
ALTER TABLE `meals` 
ADD COLUMN `local_name` VARCHAR(255) NULL AFTER `mealName`,
ADD COLUMN `description` TEXT NULL AFTER `local_name`,
ADD COLUMN `image_url` TEXT NULL AFTER `description`,
ADD COLUMN `video_url` TEXT NULL AFTER `image_url`,
ADD COLUMN `pronunciation_url` TEXT NULL AFTER `video_url`,
ADD COLUMN `country_id` INT NULL AFTER `pronunciation_url`;

-- Create junction table for meals and food items (many-to-many)
CREATE TABLE IF NOT EXISTS `meal_food_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `meal_id` VARCHAR(36) NOT NULL,
  `food_item_id` VARCHAR(36) NOT NULL,
  `quantity` VARCHAR(100),
  `unit` VARCHAR(50),
  `preparation_notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_meal_food` (`meal_id`, `food_item_id`),
  FOREIGN KEY (`meal_id`) REFERENCES `meals` (`mealID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`food_item_id`) REFERENCES `fooditems` (`food_itemID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create junction table for meal preparation sources (YouTube, TikTok, Instagram, etc.)
CREATE TABLE IF NOT EXISTS `meal_preparation_sources` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `meal_id` VARCHAR(36) NOT NULL,
  `source_type` VARCHAR(50) NOT NULL,
  `source_url` TEXT NOT NULL,
  `title` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`meal_id`) REFERENCES `meals` (`mealID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create table for meal images (support for multiple images)
CREATE TABLE IF NOT EXISTS `meal_images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `meal_id` VARCHAR(36) NOT NULL,
  `image_url` TEXT NOT NULL,
  `image_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`meal_id`) REFERENCES `meals` (`mealID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add indexes for better query performance
CREATE INDEX `idx_meal_id` ON `meal_food_items`(`meal_id`);
CREATE INDEX `idx_food_item_id` ON `meal_food_items`(`food_item_id`);
CREATE INDEX `idx_meal_prep_sources` ON `meal_preparation_sources`(`meal_id`);
CREATE INDEX `idx_meal_images` ON `meal_images`(`meal_id`);
CREATE INDEX `idx_meals_country_id` ON `meals`(`country_id`);

ALTER TABLE `meals`
ADD CONSTRAINT `meals_to_countries`
FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
ON DELETE SET NULL ON UPDATE CASCADE;
