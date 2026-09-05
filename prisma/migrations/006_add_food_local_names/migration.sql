CREATE TABLE `food_item_local_names` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `food_item_id` VARCHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `country_id` INTEGER NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `scope` VARCHAR(20) NOT NULL,
  `tribe_name` VARCHAR(100) NOT NULL DEFAULT '',
  `language_name` VARCHAR(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_food_local_name` (`food_item_id`, `country_id`, `scope`, `tribe_name`, `language_name`, `name`),
  INDEX `food_item_local_names_country_id_idx` (`country_id`),
  CONSTRAINT `food_item_local_names_food_item_id_fkey` FOREIGN KEY (`food_item_id`) REFERENCES `fooditems` (`food_itemID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `food_item_local_names_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
