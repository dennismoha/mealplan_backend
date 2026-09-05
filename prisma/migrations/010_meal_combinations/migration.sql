ALTER TABLE `mealtype`
  ADD COLUMN `meal_kind` VARCHAR(20) NOT NULL DEFAULT 'dish',
  ADD COLUMN `serving_instructions` TEXT NULL;
CREATE TABLE `meal_combination_items` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `combination_id` VARCHAR(36) NOT NULL,
  `dish_id` VARCHAR(36) NOT NULL,
  `portions` VARCHAR(100) NULL,
  `notes` TEXT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  UNIQUE INDEX `meal_combination_items_combination_id_dish_id_key` (`combination_id`, `dish_id`),
  INDEX `meal_combination_items_dish_id_idx` (`dish_id`),
  CONSTRAINT `meal_combination_items_combination_id_fkey` FOREIGN KEY (`combination_id`) REFERENCES `mealtype` (`mealTypesID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `meal_combination_items_dish_id_fkey` FOREIGN KEY (`dish_id`) REFERENCES `mealtype` (`mealTypesID`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
