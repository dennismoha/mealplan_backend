-- Earlier installations used MySQL-generated constraint names. Discover each
-- existing food reference before replacing its cascade rule.
SET @meal_food_fk = (SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'meal_food_items'
    AND COLUMN_NAME = 'food_item_id' AND REFERENCED_TABLE_NAME = 'fooditems' LIMIT 1);
SET @meal_food_sql = CONCAT('ALTER TABLE `meal_food_items` ',
  IF(@meal_food_fk IS NULL, '', CONCAT('DROP FOREIGN KEY `', REPLACE(@meal_food_fk, '`', '``'), '`, ')),
  'ADD CONSTRAINT `meal_food_items_to_fooditems_restrict` FOREIGN KEY (`food_item_id`) REFERENCES `fooditems` (`food_itemID`) ON DELETE RESTRICT ON UPDATE CASCADE');
PREPARE meal_food_statement FROM @meal_food_sql;
EXECUTE meal_food_statement;
DEALLOCATE PREPARE meal_food_statement;

SET @meal_type_food_fk = (SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'meal_type_food_items'
    AND COLUMN_NAME = 'food_item_id' AND REFERENCED_TABLE_NAME = 'fooditems' LIMIT 1);
SET @meal_type_food_sql = CONCAT('ALTER TABLE `meal_type_food_items` ',
  IF(@meal_type_food_fk IS NULL, '', CONCAT('DROP FOREIGN KEY `', REPLACE(@meal_type_food_fk, '`', '``'), '`, ')),
  'ADD CONSTRAINT `meal_type_food_items_to_fooditems_restrict` FOREIGN KEY (`food_item_id`) REFERENCES `fooditems` (`food_itemID`) ON DELETE RESTRICT ON UPDATE CASCADE');
PREPARE meal_type_food_statement FROM @meal_type_food_sql;
EXECUTE meal_type_food_statement;
DEALLOCATE PREPARE meal_type_food_statement;
