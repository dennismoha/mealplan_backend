-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: meal_plan
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.22.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `foodcategory`
--

DROP TABLE IF EXISTS `foodcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foodcategory` (
  `idFoodCategory` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) NOT NULL,
  `description` mediumtext,
  `image_url` text,
  `food_categoryID` varchar(36) NOT NULL,
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idFoodCategory`),
  UNIQUE KEY `category_name_UNIQUE` (`category_name`),
  UNIQUE KEY `food_categoryID_UNIQUE` (`food_categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foodcategory`
--

LOCK TABLES `foodcategory` WRITE;
/*!40000 ALTER TABLE `foodcategory` DISABLE KEYS */;
INSERT INTO `foodcategory` VALUES (2,'veges','this is the fruits category','http://wwww.com','dac91541-f25a-11ee-8de4-f816542ce27d','2024-04-04 11:10:52','2024-04-04 11:10:52');
/*!40000 ALTER TABLE `foodcategory` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `foodcategory_BEFORE_INSERT` BEFORE INSERT ON `foodcategory` FOR EACH ROW BEGIN
	set NEW.food_categoryID = uuid();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `fooditems`
--

DROP TABLE IF EXISTS `fooditems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fooditems` (
  `idFoodItems` int NOT NULL AUTO_INCREMENT,
  `food_name` varchar(100) NOT NULL,
  `descriptionl` text,
  `image_url` text,
  `food_itemID` varchar(36) NOT NULL,
  `category_id` varchar(36) DEFAULT NULL,
  `fooditem_cacheID` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idFoodItems`),
  UNIQUE KEY `Name_UNIQUE` (`food_name`),
  UNIQUE KEY `food_itemID_UNIQUE` (`food_itemID`),
  KEY `foodcategory_idx` (`category_id`),
  CONSTRAINT `foodcategory` FOREIGN KEY (`category_id`) REFERENCES `foodcategory` (`food_categoryID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fooditems`
--

LOCK TABLES `fooditems` WRITE;
/*!40000 ALTER TABLE `fooditems` DISABLE KEYS */;
INSERT INTO `fooditems` VALUES (1,'matoke','Matoke are a carbohydrate based food','http://','3daed462-f55c-11ee-add6-f816542ce27d',NULL,'6747240a-dadd-4ecd-a594-d72391e2cc37','2024-04-08 03:58:21','2024-04-08 03:58:21'),(3,'Eggs','Eggs are a protein based food','http://','4bd1cfb4-f55c-11ee-add6-f816542ce27d',NULL,'0a2aa9fd-cbff-4bab-8664-cbb06d791c98','2024-04-08 03:58:45','2024-04-08 03:58:45');
/*!40000 ALTER TABLE `fooditems` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `fooditems_BEFORE_INSERT` BEFORE INSERT ON `fooditems` FOR EACH ROW BEGIN
	SET NEW.food_itemID = uuid();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `fooditemsimages`
--

DROP TABLE IF EXISTS `fooditemsimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fooditemsimages` (
  `idfoodItemsImages` int NOT NULL AUTO_INCREMENT,
  `food_items_image_ID` varchar(36) DEFAULT NULL,
  `foodItems_ID` varchar(36) DEFAULT NULL,
  `images_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`idfoodItemsImages`),
  KEY `foodItemsToImages_idx` (`images_ID`),
  KEY `foodItemsImagesToFoodItems_idx` (`foodItems_ID`),
  CONSTRAINT `foodItemsImagesToFoodItems` FOREIGN KEY (`foodItems_ID`) REFERENCES `fooditems` (`food_itemID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `foodItemsToImages` FOREIGN KEY (`images_ID`) REFERENCES `images` (`image_urlID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fooditemsimages`
--

LOCK TABLES `fooditemsimages` WRITE;
/*!40000 ALTER TABLE `fooditemsimages` DISABLE KEYS */;
/*!40000 ALTER TABLE `fooditemsimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `idimages` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(45) DEFAULT NULL,
  `image_urlID` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idimages`),
  UNIQUE KEY `image_urlID_UNIQUE` (`image_urlID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `images_BEFORE_INSERT` BEFORE INSERT ON `images` FOR EACH ROW BEGIN
	SET NEW.image_urlID = uuid();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mealmealtype`
--

DROP TABLE IF EXISTS `mealmealtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mealmealtype` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `meal_mealTypeID` varchar(100) NOT NULL,
  `mealsID` varchar(36) DEFAULT NULL,
  `mealTypeID` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `mealtypeName_UNIQUE` (`meal_mealTypeID`),
  KEY `mealtomealTypeID_idx` (`mealTypeID`),
  KEY `mealtomealsID_idx` (`mealsID`),
  CONSTRAINT `mealtomealsID` FOREIGN KEY (`mealsID`) REFERENCES `meals` (`mealID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mealToMealTypeId` FOREIGN KEY (`mealTypeID`) REFERENCES `mealtype` (`mealTypesID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mealmealtype`
--

LOCK TABLES `mealmealtype` WRITE;
/*!40000 ALTER TABLE `mealmealtype` DISABLE KEYS */;
INSERT INTO `mealmealtype` VALUES (1,'378dc59d-8978-11ee-9841-288023d737ea','251419aa-8811-11ee-a935-288023d737ea','d05e5454-8980-11ee-9841-288023d737ea','2023-11-23 18:32:41','2023-11-23 18:32:41'),(2,'fa224989-8980-11ee-9841-288023d737ea','251419aa-8811-11ee-a935-288023d737ea','d05e5454-8980-11ee-9841-288023d737ea','2023-11-23 18:32:41','2023-11-23 18:32:41'),(3,'3248f270-89f2-11ee-9841-288023d737ea','eb82ef95-8926-11ee-9841-288023d737ea','38aa5319-8928-11ee-9841-288023d737ea','2023-11-23 18:32:41','2023-11-23 18:32:41');
/*!40000 ALTER TABLE `mealmealtype` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `mealmealtype_BEFORE_INSERT` BEFORE INSERT ON `mealmealtype` FOR EACH ROW BEGIN
SET NEW.meal_mealTypeID = UUID(); 
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mealplan`
--

DROP TABLE IF EXISTS `mealplan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mealplan` (
  `idMealPlan` int NOT NULL AUTO_INCREMENT,
  `day_of_week` varchar(255) NOT NULL,
  `breakfast` varchar(255) DEFAULT NULL,
  `morning_break` varchar(255) DEFAULT NULL,
  `Lunch` varchar(255) DEFAULT NULL,
  `evening_break` varchar(255) DEFAULT NULL,
  `supper` varchar(255) DEFAULT NULL,
  `mealplan_key` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idMealPlan`,`day_of_week`),
  KEY `mealplankey_idx` (`mealplan_key`),
  CONSTRAINT `mealplankey` FOREIGN KEY (`mealplan_key`) REFERENCES `mealplantime` (`meal_plan_name`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mealplan`
--

LOCK TABLES `mealplan` WRITE;
/*!40000 ALTER TABLE `mealplan` DISABLE KEYS */;
INSERT INTO `mealplan` VALUES (11,'Monday','Biscuits','Fruit','Chicken salad','Yogurt','Grilled fish','week5','2023-11-23 18:32:26','2024-04-11 04:06:19'),(12,'Tuesday','Cocoa','chocolate','Mukimo','milk','Githeri','week5','2023-11-23 18:32:26','2023-11-23 18:32:26'),(13,'Monday','Biscuits','Fruit','Chicken salad','Yogurt','Grilled fish','week2','2023-11-23 18:32:26','2024-04-11 04:06:09'),(14,'Tuesday','maji','chocolate','mukimo','coffee','Githeri avocado','week2','2023-11-23 18:32:26','2023-11-23 18:32:26'),(15,'wednesday','chapo chai','loaf coffee','ugali','cocoa','minji rice','week2','2023-11-23 18:32:26','2023-11-23 18:32:26'),(16,'Thursday','cocoa','juice cola','pizza','coffee','fruits and greens','week2','2023-11-23 18:32:26','2023-11-23 18:32:26'),(27,'friday','cocoa','juice cola','pizza','coffee','fruits and greens','week5','2023-11-23 18:32:26','2023-11-23 18:32:26'),(32,'saturday','cocoa','juice cola','pizza','coffee','fruits and greens','week5','2023-11-23 18:32:26','2023-11-23 18:32:26'),(40,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 03:42:48','2024-04-10 03:42:48'),(41,'Tuesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:00:45','2024-04-10 04:00:45'),(42,'Wednesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:10:56','2024-04-10 04:10:56'),(43,'Thursday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:12:41','2024-04-10 04:12:41'),(44,'Friday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:12:53','2024-04-10 04:12:53'),(45,'Saturday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:13:00','2024-04-10 04:13:00'),(46,'Sunday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:13:07','2024-04-10 04:13:07'),(47,'Sundays','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:13:11','2024-04-10 04:13:11'),(50,'monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:05','2024-04-10 04:28:05'),(51,'Tuesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:14','2024-04-10 04:28:14'),(52,'Wednesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:21','2024-04-10 04:28:21'),(53,'Thursday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:29','2024-04-10 04:28:29'),(54,'Friday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:35','2024-04-10 04:28:35'),(55,'Saturday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:44','2024-04-10 04:28:44'),(56,'Sunday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:50','2024-04-10 04:28:50'),(57,'Wednesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week5','2024-04-11 01:54:27','2024-04-11 01:54:27'),(58,'Thursday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week5','2024-04-11 01:57:30','2024-04-11 01:57:30'),(59,'Thursdas','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week5','2024-04-11 01:57:50','2024-04-11 01:57:50'),(60,'Friday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week2','2024-04-11 02:06:31','2024-04-11 02:06:31'),(61,'Saturday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week2','2024-04-11 02:06:42','2024-04-11 02:06:42'),(63,'Sunday','Biscuits','Fruit','Chicken salad','Yogurt','Grilled fish','week2','2024-04-11 02:43:19','2024-04-11 04:05:45'),(64,'Sunday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','april-week-1','2024-04-11 03:30:31','2024-04-11 03:30:31'),(65,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','april-week-1','2024-04-11 03:32:28','2024-04-11 03:32:28'),(66,'Tuesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','april-week-1','2024-04-11 04:13:16','2024-04-11 04:13:16'),(67,'Sunday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','april-week-2','2024-04-11 04:16:08','2024-04-11 04:16:08'),(68,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','april-week-3','2024-04-11 04:17:28','2024-04-11 04:17:28'),(69,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','april-week-4','2024-04-11 04:18:50','2024-04-11 04:18:50'),(70,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','june-week-1','2024-04-11 04:20:44','2024-04-11 04:20:44'),(71,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','june-week-2','2024-04-11 04:23:01','2024-04-11 04:23:01'),(72,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','june-week-3','2024-04-11 04:51:33','2024-04-11 04:51:33'),(73,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','june-week-4','2024-04-11 04:52:32','2024-04-11 04:52:32'),(74,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','may-week-1','2024-04-11 04:54:40','2024-04-11 04:54:40'),(75,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','may-week-2','2024-04-11 04:55:43','2024-04-11 04:55:43');
/*!40000 ALTER TABLE `mealplan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mealplantime`
--

DROP TABLE IF EXISTS `mealplantime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mealplantime` (
  `idmealPlanWeek` int NOT NULL AUTO_INCREMENT,
  `meal_plan_name` varchar(45) NOT NULL,
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idmealPlanWeek`),
  UNIQUE KEY `meal_plan_name_UNIQUE` (`meal_plan_name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mealplantime`
--

LOCK TABLES `mealplantime` WRITE;
/*!40000 ALTER TABLE `mealplantime` DISABLE KEYS */;
INSERT INTO `mealplantime` VALUES (1,'september week 1',NULL,'2023-11-23 14:45:33'),(2,'week2',NULL,'2023-11-23 14:45:33'),(3,'week3',NULL,'2023-11-23 14:45:33'),(4,'week5',NULL,'2023-11-23 14:47:36'),(7,'week10','2023-11-23 15:22:00','2023-11-23 14:45:33'),(8,'week901','2023-11-23 17:47:53','2023-11-23 14:48:06'),(9,'april-week-1','2024-04-11 06:26:39','2024-04-11 03:26:39'),(10,'april-week-2','2024-04-11 07:15:37','2024-04-11 04:15:37'),(11,'april-week-3','2024-04-11 07:17:20','2024-04-11 04:17:20'),(12,'april-week-4','2024-04-11 07:18:34','2024-04-11 04:18:34'),(13,'june-week-1','2024-04-11 07:20:32','2024-04-11 04:20:32'),(14,'june-week-2','2024-04-11 07:22:44','2024-04-11 04:22:44'),(15,'june-week-3','2024-04-11 07:47:44','2024-04-11 04:47:44'),(16,'june-week-4','2024-04-11 07:52:26','2024-04-11 04:52:26'),(17,'may-week-1','2024-04-11 07:54:27','2024-04-11 04:54:27'),(18,'may-week-2','2024-04-11 07:55:37','2024-04-11 04:55:37'),(19,'april-week-6','2024-05-03 01:30:45','2024-05-02 22:30:45');
/*!40000 ALTER TABLE `mealplantime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meals`
--

DROP TABLE IF EXISTS `meals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meals` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `mealName` varchar(255) NOT NULL,
  `mealID` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `meal_name_UNIQUE` (`mealName`),
  UNIQUE KEY `mealTypeID_UNIQUE` (`mealID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meals`
--

LOCK TABLES `meals` WRITE;
/*!40000 ALTER TABLE `meals` DISABLE KEYS */;
INSERT INTO `meals` VALUES (5,'Lunch','bbbf7f64-82d1-11ee-961d-288023d737ea','2023-11-23 18:32:03','2023-11-23 18:32:03'),(7,'Breakfast','251419aa-8811-11ee-a935-288023d737ea','2023-11-23 18:32:03','2023-11-23 18:32:03'),(9,'supper','eb82ef95-8926-11ee-9841-288023d737ea','2023-11-23 18:32:03','2023-11-23 18:32:03'),(10,'ndengu','fc605bd9-8933-11ee-9841-288023d737ea','2023-11-23 18:32:03','2023-11-23 18:32:03'),(11,'Break','ed98ebe1-8936-11ee-9841-288023d737ea','2023-11-23 18:32:03','2023-11-23 18:32:03');
/*!40000 ALTER TABLE `meals` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `meals_BEFORE_INSERT` BEFORE INSERT ON `meals` FOR EACH ROW BEGIN
SET NEW.mealID = UUID(); 
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mealtype`
--

DROP TABLE IF EXISTS `mealtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mealtype` (
  `idtable1` int NOT NULL AUTO_INCREMENT,
  `meal_name` varchar(255) NOT NULL,
  `mealTypesID` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idtable1`),
  UNIQUE KEY `meal_name_UNIQUE` (`meal_name`),
  UNIQUE KEY `mealTypesID_UNIQUE` (`mealTypesID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mealtype`
--

LOCK TABLES `mealtype` WRITE;
/*!40000 ALTER TABLE `mealtype` DISABLE KEYS */;
INSERT INTO `mealtype` VALUES (1,'Githeri Waru maharagwe','38aa5319-8928-11ee-9841-288023d737ea','2023-11-23 18:31:51','2023-11-23 18:31:51'),(2,'githeri with water','13da8d8e-892c-11ee-9841-288023d737ea','2023-11-23 18:31:51','2023-11-23 18:31:51'),(4,'mchele Njeri','bf27f3a5-8935-11ee-9841-288023d737ea','2023-11-23 18:31:51','2023-11-23 18:31:51'),(5,'tea','d05e5454-8980-11ee-9841-288023d737ea','2023-11-23 18:31:51','2023-11-23 18:31:51');
/*!40000 ALTER TABLE `mealtype` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `mealtype_BEFORE_INSERT` BEFORE INSERT ON `mealtype` FOR EACH ROW BEGIN
   SET NEW.mealTypesID = UUID(); 
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe` (
  `idrecipe` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `ingredients` text,
  `instructions` text,
  `prep_time` int DEFAULT NULL,
  `cook_time` int DEFAULT NULL,
  `total_time` int DEFAULT NULL,
  `servings` int DEFAULT NULL,
  `cuisine` varchar(100) DEFAULT NULL,
  `difficulty` varchar(50) DEFAULT NULL,
  `meal_type` varchar(50) DEFAULT NULL,
  `recipe_ID` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `meal_typeID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`idrecipe`),
  UNIQUE KEY `recipe_ID_UNIQUE` (`recipe_ID`),
  KEY `recipesToMealTypeId_idx` (`meal_typeID`),
  CONSTRAINT `recipesToMealTypeId` FOREIGN KEY (`meal_typeID`) REFERENCES `mealtype` (`mealTypesID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe`
--

LOCK TABLES `recipe` WRITE;
/*!40000 ALTER TABLE `recipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `recipe_BEFORE_INSERT` BEFORE INSERT ON `recipe` FOR EACH ROW BEGIN
	set new.recipe_ID = uuid();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `recipes_images`
--

DROP TABLE IF EXISTS `recipes_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes_images` (
  `idrecipes_images` int NOT NULL AUTO_INCREMENT,
  `recipes_images_ID` varchar(36) DEFAULT NULL,
  `recipes_ID` varchar(36) DEFAULT NULL,
  `image_ID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`idrecipes_images`),
  KEY `recipeToimages_idx` (`image_ID`),
  KEY `recipeImagesToRecipe_idx` (`recipes_ID`),
  CONSTRAINT `recipeImagesToRecipe` FOREIGN KEY (`recipes_ID`) REFERENCES `recipe` (`recipe_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `recipeToimages` FOREIGN KEY (`image_ID`) REFERENCES `images` (`image_urlID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes_images`
--

LOCK TABLES `recipes_images` WRITE;
/*!40000 ALTER TABLE `recipes_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipes_images` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `recipes_images_BEFORE_INSERT` BEFORE INSERT ON `recipes_images` FOR EACH ROW BEGIN
SET NEW.recipes_images_ID = uuid();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `idroles` int NOT NULL AUTO_INCREMENT,
  `role_type` varchar(45) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idroles`),
  UNIQUE KEY `role_type_UNIQUE` (`role_type`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (3,'admin','2023-11-23 18:31:29','2023-11-23 18:31:29'),(4,'user','2023-11-23 18:31:29','2023-11-23 18:31:29');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `idusers` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` text NOT NULL,
  `role` varchar(45) DEFAULT NULL,
  `userscol` varchar(45) DEFAULT NULL,
  `reset_token` text,
  `reset_token_expiration` text,
  `refresh_token` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idusers`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `role_idx` (`role`),
  CONSTRAINT `role` FOREIGN KEY (`role`) REFERENCES `roles` (`role_type`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (9,'maa@mail.com','$2b$10$iBYPxQTgcr0jkD4KYoYWAO4K42x2HfzWV.vROgaZxMhauprUzZoeu','user',NULL,NULL,NULL,NULL,'2023-11-23 18:31:04','2023-11-23 18:31:04'),(10,'mem@mail.com','$2b$10$Fu90cbv5bFJABoUDJBQqtu2efcDUSyHqffPVGElrfuWJkib9OAq3m','user',NULL,NULL,NULL,'','2023-11-23 18:31:04','2023-11-23 18:31:04'),(11,'den@mail.com','$2b$10$N.uiI4CyKgoCLi/31LMacey4.uBgIJE8atLt5YnmBD44Q5ApWLsDy','user',NULL,NULL,NULL,'','2023-11-23 18:31:04','2023-11-23 18:31:04'),(12,'admin@mail.com','$2b$10$BnxsDxbk.xGuM9qqT.zGPeM/4YVbE0kN.ETi3tBqb/U1JL6L6NDe6','admin',NULL,NULL,NULL,'','2023-11-23 18:31:04','2023-11-23 18:31:04'),(13,'admin1@mail.com','$2b$10$LBpvMZwnFKJAMuPdA/DeuuOb68x4vXmjrpL/qaQt5A91EIADQf78a','user',NULL,NULL,NULL,NULL,'2023-11-23 18:31:04','2023-11-23 18:31:04'),(14,'user@mail.com','$2b$10$qdfpEQbfo7QGz35x92gmd.s.uY1JKKNCbhV6sf4oeovzXnUkwGnkK','user',NULL,NULL,NULL,'','2023-11-23 18:31:04','2023-11-23 18:31:04'),(15,'user1@mail.com','$2b$10$6NK9Jjeh/JFGGt6xy7h6C.cVNPfn5pxzNYZvbqYS8vORKBMwBg/Y2','user',NULL,NULL,NULL,'','2023-11-23 18:31:04','2023-11-23 18:31:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'meal_plan'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-17 23:33:21
