-- Preserve previously free-text plan meals as named dishes. Do not invent recipes.
INSERT INTO mealtype (mealTypesID, meal_name)
SELECT UUID(), legacy.name FROM (SELECT MIN(name) AS name FROM (SELECT `breakfast` AS name FROM mealplan WHERE `breakfast` IS NOT NULL AND TRIM(`breakfast`) <> '' UNION ALL SELECT `morning_break` AS name FROM mealplan WHERE `morning_break` IS NOT NULL AND TRIM(`morning_break`) <> '' UNION ALL SELECT `Lunch` AS name FROM mealplan WHERE `Lunch` IS NOT NULL AND TRIM(`Lunch`) <> '' UNION ALL SELECT `evening_break` AS name FROM mealplan WHERE `evening_break` IS NOT NULL AND TRIM(`evening_break`) <> '' UNION ALL SELECT `supper` AS name FROM mealplan WHERE `supper` IS NOT NULL AND TRIM(`supper`) <> '') names GROUP BY name COLLATE utf8mb4_0900_ai_ci) legacy
WHERE NOT EXISTS (SELECT 1 FROM mealtype d WHERE d.meal_name=legacy.name);
UPDATE mealplan p JOIN mealtype d ON p.`breakfast`=d.meal_name SET p.breakfast_id=d.mealTypesID WHERE p.breakfast_id IS NULL;
UPDATE mealplan p JOIN mealtype d ON p.`morning_break`=d.meal_name SET p.morning_break_id=d.mealTypesID WHERE p.morning_break_id IS NULL;
UPDATE mealplan p JOIN mealtype d ON p.`Lunch`=d.meal_name SET p.lunch_id=d.mealTypesID WHERE p.lunch_id IS NULL;
UPDATE mealplan p JOIN mealtype d ON p.`evening_break`=d.meal_name SET p.evening_break_id=d.mealTypesID WHERE p.evening_break_id IS NULL;
UPDATE mealplan p JOIN mealtype d ON p.`supper`=d.meal_name SET p.supper_id=d.mealTypesID WHERE p.supper_id IS NULL;
