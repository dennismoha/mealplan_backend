-- Preserve application-generated IDs so nested dish links and country links
-- refer to the actual inserted meal. Legacy inserts can still omit an ID.
DROP TRIGGER IF EXISTS `mealtype_BEFORE_INSERT`;
CREATE TRIGGER `mealtype_BEFORE_INSERT` BEFORE INSERT ON `mealtype`
FOR EACH ROW SET NEW.mealTypesID = COALESCE(NULLIF(NEW.mealTypesID, ''), UUID());
