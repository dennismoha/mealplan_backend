CREATE DATABASE  IF NOT EXISTS `meal_plan` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `meal_plan`;
-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: meal_plan
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

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
-- Dumping data for table `foodcategory`
--

LOCK TABLES `foodcategory` WRITE;
/*!40000 ALTER TABLE `foodcategory` DISABLE KEYS */;
INSERT INTO `foodcategory` VALUES (2,'veges','this is the fruits category','http://wwww.com','dac91541-f25a-11ee-8de4-f816542ce27d','2024-04-04 11:10:52','2024-04-04 11:10:52'),(7,'snackersss','this is the snackersss category','http://wwww.com','36f428a9-3e09-11ef-ba87-f816542ce27d','2024-07-09 18:37:56','2024-07-09 18:37:56'),(8,'fruits','this is the snackersss category','http://wwww.com','c3794f7f-3e0c-11ef-ba87-f816542ce27d','2024-07-09 19:03:21','2024-07-09 19:03:21'),(9,'sample category','this is the snackersss category','http://wwww.com','16740789-3e10-11ef-ba87-f816542ce27d','2024-07-09 19:27:08','2024-07-09 19:27:08'),(10,'snacks','this is the snackersss category','http://wwww.com','c647c4f3-3e11-11ef-ba87-f816542ce27d','2024-07-09 19:39:13','2024-07-09 19:39:13'),(11,'cereals','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','16f2058c-3e12-11ef-ba87-f816542ce27d','2024-07-09 19:41:28','2024-07-09 19:41:28'),(12,'soghurm','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','305b8643-3e12-11ef-ba87-f816542ce27d','2024-07-09 19:42:11','2024-07-09 19:42:11'),(13,'apples','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','41785e36-3e12-11ef-ba87-f816542ce27d','2024-07-09 19:42:40','2024-07-09 19:42:40'),(14,'mangoes','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','55763a71-3e12-11ef-ba87-f816542ce27d','2024-07-09 19:43:13','2024-07-09 19:43:13'),(15,'melons','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','87c1fc10-3e1e-11ef-ba87-f816542ce27d','2024-07-09 21:10:31','2024-07-09 21:10:31'),(16,'avocados','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','08eed13b-3e1f-11ef-ba87-f816542ce27d','2024-07-09 21:14:08','2024-07-09 21:14:08'),(17,'matunda','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','50f09375-549a-11ef-a3b0-f816542ce27d','2024-08-07 11:52:03','2024-08-07 11:52:03'),(18,'f','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','36f74399-549e-11ef-a3b0-f816542ce27d','2024-08-07 12:19:57','2024-08-07 12:19:57'),(19,'ff','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','dbf1ac4d-549f-11ef-a3b0-f816542ce27d','2024-08-07 12:31:43','2024-08-07 12:31:43'),(20,'fsf','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','edc4e20f-549f-11ef-a3b0-f816542ce27d','2024-08-07 12:32:13','2024-08-07 12:32:13'),(21,'tea','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','0393d7ea-54a0-11ef-a3b0-f816542ce27d','2024-08-07 12:32:50','2024-08-07 12:32:50'),(22,'teas','fruits are vey rich in vitamin D','https://www.orange.com/orange.jpeg','1470b0f1-54a0-11ef-a3b0-f816542ce27d','2024-08-07 12:33:18','2024-08-07 12:33:18');
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
-- Dumping data for table `fooditemsimages`
--

LOCK TABLES `fooditemsimages` WRITE;
/*!40000 ALTER TABLE `fooditemsimages` DISABLE KEYS */;
/*!40000 ALTER TABLE `fooditemsimages` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `mealplan`
--

LOCK TABLES `mealplan` WRITE;
/*!40000 ALTER TABLE `mealplan` DISABLE KEYS */;
INSERT INTO `mealplan` VALUES (11,'Monday','Biscuits','Fruit','Chicken salad','Yogurt','Grilled fish','week5','2023-11-23 18:32:26','2024-04-11 04:06:19'),(12,'Tuesday','Cocoa','chocolate','Mukimo','milk','Githeri','week5','2023-11-23 18:32:26','2023-11-23 18:32:26'),(13,'Monday','Biscuits','Fruit','Chicken salad','Yogurt','Grilled fish','week2','2023-11-23 18:32:26','2024-04-11 04:06:09'),(14,'Tuesday','maji','chocolate','mukimo','coffee','Githeri avocado','week2','2023-11-23 18:32:26','2023-11-23 18:32:26'),(15,'wednesday','chapo chai','loaf coffee','ugali','cocoa','minji rice','week2','2023-11-23 18:32:26','2023-11-23 18:32:26'),(16,'Thursday','cocoa','juice cola','pizza','coffee','fruits and greens','week2','2023-11-23 18:32:26','2023-11-23 18:32:26'),(27,'friday','cocoa','juice cola','pizza','coffee','fruits and greens','week5','2023-11-23 18:32:26','2023-11-23 18:32:26'),(32,'saturday','cocoa','juice cola','pizza','coffee','fruits and greens','week5','2023-11-23 18:32:26','2023-11-23 18:32:26'),(40,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 03:42:48','2024-04-10 03:42:48'),(41,'Tuesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:00:45','2024-04-10 04:00:45'),(42,'Wednesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:10:56','2024-04-10 04:10:56'),(43,'Thursday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:12:41','2024-04-10 04:12:41'),(44,'Friday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:12:53','2024-04-10 04:12:53'),(45,'Saturday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:13:00','2024-04-10 04:13:00'),(46,'Sunday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:13:07','2024-04-10 04:13:07'),(47,'Sundays','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week10','2024-04-10 04:13:11','2024-04-10 04:13:11'),(50,'monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:05','2024-04-10 04:28:05'),(51,'Tuesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:14','2024-04-10 04:28:14'),(52,'Wednesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:21','2024-04-10 04:28:21'),(53,'Thursday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:29','2024-04-10 04:28:29'),(55,'Saturday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:44','2024-04-10 04:28:44'),(56,'Sunday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week3','2024-04-10 04:28:50','2024-04-10 04:28:50'),(57,'Wednesday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week5','2024-04-11 01:54:27','2024-04-11 01:54:27'),(58,'Thursday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week5','2024-04-11 01:57:30','2024-04-11 01:57:30'),(59,'Thursdas','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week5','2024-04-11 01:57:50','2024-04-11 01:57:50'),(60,'Friday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week2','2024-04-11 02:06:31','2024-04-11 02:06:31'),(61,'Saturday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','week2','2024-04-11 02:06:42','2024-04-11 02:06:42'),(63,'Sunday','Biscuits','Fruit','Chicken salad','Yogurt','Grilled fish','week2','2024-04-11 02:43:19','2024-04-11 04:05:45'),(65,'Monday','toast and cocoa','cocoa','rice and beans','porridge','Githeri','april-week-1','2024-04-11 03:32:28','2024-08-07 07:27:02'),(67,'Sunday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','sample100','2024-04-11 04:16:08','2024-04-11 04:16:08'),(68,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','april-week-3','2024-04-11 04:17:28','2024-04-11 04:17:28'),(69,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','april-week-4','2024-04-11 04:18:50','2024-04-11 04:18:50'),(70,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','june-week-1','2024-04-11 04:20:44','2024-04-11 04:20:44'),(71,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','june-week-2','2024-04-11 04:23:01','2024-04-11 04:23:01'),(72,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','june-week-3','2024-04-11 04:51:33','2024-04-11 04:51:33'),(73,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','june-week-4','2024-04-11 04:52:32','2024-04-11 04:52:32'),(74,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','may-week-1','2024-04-11 04:54:40','2024-04-11 04:54:40'),(75,'Monday','Eggs and toast','Fruit','Chicken salad','Yogurt','Grilled fish','may-week-2','2024-04-11 04:55:43','2024-04-11 04:55:43'),(86,'Monday','tea and bread','cocoa','rice and beans','porridge','Githeri','sample','2024-08-06 00:05:24','2024-08-06 00:05:24'),(87,'Tuesday','tea and bread','cocoa','rice and beans','porridge','Githeri','sample','2024-08-06 00:06:10','2024-08-06 00:06:10');
/*!40000 ALTER TABLE `mealplan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `mealplantime`
--

LOCK TABLES `mealplantime` WRITE;
/*!40000 ALTER TABLE `mealplantime` DISABLE KEYS */;
INSERT INTO `mealplantime` VALUES (1,'september week 1',NULL,'2023-11-23 14:45:33'),(2,'week2',NULL,'2023-11-23 14:45:33'),(3,'week3',NULL,'2023-11-23 14:45:33'),(4,'week5',NULL,'2023-11-23 14:47:36'),(7,'week10','2023-11-23 15:22:00','2023-11-23 14:45:33'),(8,'week901','2023-11-23 17:47:53','2023-11-23 14:48:06'),(9,'april-week-1','2024-04-11 06:26:39','2024-04-11 03:26:39'),(10,'sample100','2024-04-11 07:15:37','2024-08-06 21:00:11'),(11,'april-week-3','2024-04-11 07:17:20','2024-04-11 04:17:20'),(12,'april-week-4','2024-04-11 07:18:34','2024-04-11 04:18:34'),(13,'june-week-1','2024-04-11 07:20:32','2024-04-11 04:20:32'),(14,'june-week-2','2024-04-11 07:22:44','2024-04-11 04:22:44'),(15,'june-week-3','2024-04-11 07:47:44','2024-04-11 04:47:44'),(16,'june-week-4','2024-04-11 07:52:26','2024-04-11 04:52:26'),(17,'may-week-1','2024-04-11 07:54:27','2024-04-11 04:54:27'),(18,'may-week-2','2024-04-11 07:55:37','2024-04-11 04:55:37'),(20,'sample','2024-08-06 03:05:10','2024-08-06 20:23:19');
/*!40000 ALTER TABLE `mealplantime` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (3,'admin','2023-11-23 18:31:29','2023-11-23 18:31:29'),(4,'user','2023-11-23 18:31:29','2023-11-23 18:31:29');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Dumping routines for database 'meal_plan'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-12 16:19:43
