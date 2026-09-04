-- Keep the legacy food_name column for existing clients while making the
-- searchable English name explicit. Existing names are treated as English.
ALTER TABLE `fooditems`
ADD COLUMN `english_name` VARCHAR(100) NULL AFTER `food_name`;

UPDATE `fooditems`
SET `english_name` = `food_name`
WHERE `english_name` IS NULL;

CREATE UNIQUE INDEX `EnglishName_UNIQUE` ON `fooditems`(`english_name`);
