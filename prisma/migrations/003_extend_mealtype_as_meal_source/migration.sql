ALTER TABLE `mealtype`
  ADD COLUMN `local_name` VARCHAR(255) NULL AFTER `meal_name`,
  ADD COLUMN `description` TEXT NULL AFTER `local_name`,
  ADD COLUMN `video_url` TEXT NULL AFTER `image_url`,
  ADD COLUMN `pronunciation_url` TEXT NULL AFTER `video_url`,
  ADD COLUMN `country_id` INT NULL AFTER `pronunciation_url`,
  ADD KEY `idx_mealtype_country_id` (`country_id`),
  ADD CONSTRAINT `mealtype_to_countries` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE `meal_type_food_items` (
  `id` INT NOT NULL AUTO_INCREMENT, `meal_type_id` VARCHAR(36) NOT NULL, `food_item_id` VARCHAR(36) NOT NULL,
  `quantity` VARCHAR(100), `unit` VARCHAR(50), `preparation_notes` TEXT, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`), UNIQUE KEY `unique_meal_type_food` (`meal_type_id`, `food_item_id`), KEY `idx_meal_type_food_item` (`food_item_id`),
  CONSTRAINT `meal_type_food_items_to_mealtype` FOREIGN KEY (`meal_type_id`) REFERENCES `mealtype` (`mealTypesID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `meal_type_food_items_to_fooditems` FOREIGN KEY (`food_item_id`) REFERENCES `fooditems` (`food_itemID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `meal_type_preparation_sources` (
  `id` INT NOT NULL AUTO_INCREMENT, `meal_type_id` VARCHAR(36) NOT NULL, `source_type` VARCHAR(50) NOT NULL, `source_url` TEXT NOT NULL,
  `title` VARCHAR(255), `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`), KEY `idx_meal_type_sources` (`meal_type_id`),
  CONSTRAINT `meal_type_sources_to_mealtype` FOREIGN KEY (`meal_type_id`) REFERENCES `mealtype` (`mealTypesID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `meal_type_images` (
  `id` INT NOT NULL AUTO_INCREMENT, `meal_type_id` VARCHAR(36) NOT NULL, `image_url` TEXT NOT NULL, `image_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`), KEY `idx_meal_type_images` (`meal_type_id`),
  CONSTRAINT `meal_type_images_to_mealtype` FOREIGN KEY (`meal_type_id`) REFERENCES `mealtype` (`mealTypesID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `mealtype` (`meal_name`, `mealTypesID`, `local_name`, `description`, `image_url`, `video_url`, `pronunciation_url`, `country_id`, `created_at`, `updated_at`)
SELECT m.`mealName`, m.`mealID`, m.`local_name`, m.`description`, m.`image_url`, m.`video_url`, m.`pronunciation_url`, m.`country_id`, m.`created_at`, m.`updated_at` FROM `meals` m
WHERE NOT EXISTS (SELECT 1 FROM `mealtype` mt WHERE mt.`meal_name` = m.`mealName` OR mt.`mealTypesID` = m.`mealID`);

UPDATE `mealtype` mt JOIN `mealmealtype` link ON link.`mealTypeID` = mt.`mealTypesID` JOIN `meals` m ON m.`mealID` = link.`mealsID`
SET mt.`local_name` = COALESCE(mt.`local_name`, m.`local_name`), mt.`description` = COALESCE(mt.`description`, m.`description`), mt.`image_url` = COALESCE(mt.`image_url`, m.`image_url`), mt.`video_url` = COALESCE(mt.`video_url`, m.`video_url`), mt.`pronunciation_url` = COALESCE(mt.`pronunciation_url`, m.`pronunciation_url`), mt.`country_id` = COALESCE(mt.`country_id`, m.`country_id`);

INSERT IGNORE INTO `meal_type_food_items` (`meal_type_id`, `food_item_id`, `quantity`, `unit`, `preparation_notes`, `created_at`)
SELECT mt.`mealTypesID`, item.`food_item_id`, item.`quantity`, item.`unit`, item.`preparation_notes`, item.`created_at` FROM `meal_food_items` item JOIN `meals` m ON m.`mealID` = item.`meal_id` JOIN `mealtype` mt ON mt.`mealTypesID` = m.`mealID` OR mt.`meal_name` = m.`mealName`;

INSERT INTO `meal_type_preparation_sources` (`meal_type_id`, `source_type`, `source_url`, `title`, `created_at`)
SELECT mt.`mealTypesID`, source.`source_type`, source.`source_url`, source.`title`, source.`created_at` FROM `meal_preparation_sources` source JOIN `meals` m ON m.`mealID` = source.`meal_id` JOIN `mealtype` mt ON mt.`mealTypesID` = m.`mealID` OR mt.`meal_name` = m.`mealName`;

INSERT INTO `meal_type_images` (`meal_type_id`, `image_url`, `image_order`, `created_at`)
SELECT mt.`mealTypesID`, image.`image_url`, image.`image_order`, image.`created_at` FROM `meal_images` image JOIN `meals` m ON m.`mealID` = image.`meal_id` JOIN `mealtype` mt ON mt.`mealTypesID` = m.`mealID` OR mt.`meal_name` = m.`mealName`;

INSERT INTO `meal_type_countries` (`meal_type_id`, `country_id`)
SELECT DISTINCT mt.`mealTypesID`, m.`country_id` FROM `meals` m JOIN `mealtype` mt ON mt.`mealTypesID` = m.`mealID` OR mt.`meal_name` = m.`mealName`
WHERE m.`country_id` IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `meal_type_countries` existing WHERE existing.`meal_type_id` = mt.`mealTypesID` AND existing.`country_id` = m.`country_id`);
