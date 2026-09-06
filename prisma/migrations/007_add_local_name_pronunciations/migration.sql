ALTER TABLE `food_item_local_names`
  ADD COLUMN `pronunciation_url` TEXT NULL,
  ADD COLUMN `pronunciation_public_id` VARCHAR(255) NULL;
