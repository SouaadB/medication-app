-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: medication_app
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adherence_analyzers`
--

DROP TABLE IF EXISTS `adherence_analyzers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adherence_analyzers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `period` varchar(50) DEFAULT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  `analysis_history` text,
  `alert_threshold` decimal(5,2) DEFAULT '70.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `adherence_analyzers_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adherence_analyzers`
--

LOCK TABLES `adherence_analyzers` WRITE;
/*!40000 ALTER TABLE `adherence_analyzers` DISABLE KEYS */;
/*!40000 ALTER TABLE `adherence_analyzers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (6);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `medication_name` varchar(100) DEFAULT NULL,
  `scheduled_date_time` datetime DEFAULT NULL,
  `actual_date_time` datetime DEFAULT NULL,
  `status` enum('SCHEDULED','CONFIRMED','MISSED','CANCELLED') DEFAULT NULL,
  `dosage` varchar(50) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `history_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medication_intakes`
--

DROP TABLE IF EXISTS `medication_intakes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medication_intakes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `medication_schedule_id` int NOT NULL,
  `scheduled_date_time` datetime NOT NULL,
  `confirmed_date_time` datetime DEFAULT NULL,
  `status` enum('SCHEDULED','CONFIRMED','MISSED','CANCELLED') DEFAULT 'SCHEDULED',
  `medication_name` varchar(100) DEFAULT NULL,
  `dosage` varchar(50) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `medication_schedule_id` (`medication_schedule_id`),
  CONSTRAINT `medication_intakes_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `medication_intakes_ibfk_2` FOREIGN KEY (`medication_schedule_id`) REFERENCES `medication_schedules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medication_intakes`
--

LOCK TABLES `medication_intakes` WRITE;
/*!40000 ALTER TABLE `medication_intakes` DISABLE KEYS */;
/*!40000 ALTER TABLE `medication_intakes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medication_schedules`
--

DROP TABLE IF EXISTS `medication_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medication_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `treatment_id` int NOT NULL,
  `scheduled_date_time` datetime NOT NULL,
  `status` enum('SCHEDULED','CONFIRMED','MISSED','CANCELLED') DEFAULT 'SCHEDULED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `treatment_id` (`treatment_id`),
  KEY `idx_medication_schedules_patient` (`patient_id`),
  KEY `idx_medication_schedules_datetime` (`scheduled_date_time`),
  CONSTRAINT `medication_schedules_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `medication_schedules_ibfk_2` FOREIGN KEY (`treatment_id`) REFERENCES `treatments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medication_schedules`
--

LOCK TABLES `medication_schedules` WRITE;
/*!40000 ALTER TABLE `medication_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `medication_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `medication_schedule_id` int DEFAULT NULL,
  `scheduled_date_time` datetime DEFAULT NULL,
  `message` text,
  `is_sent` tinyint(1) DEFAULT '0',
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `medication_schedule_id` (`medication_schedule_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`medication_schedule_id`) REFERENCES `medication_schedules` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` int NOT NULL,
  `chifa_card_registration_number` varchar(9) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `smartphone_skill_level` enum('BASIC','INTERMEDIATE','ADVANCED') NOT NULL DEFAULT 'BASIC',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `chifa_card_registration_number` (`chifa_card_registration_number`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_chifa_format` CHECK (regexp_like(`chifa_card_registration_number`,_utf8mb4'^[0-9]{9}$'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (22,'123456789','2003-08-20','ADVANCED',1);
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chronic_conditions`
--

DROP TABLE IF EXISTS `chronic_conditions`;
CREATE TABLE `chronic_conditions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chronic_conditions`
--

LOCK TABLES `chronic_conditions` WRITE;
INSERT INTO `chronic_conditions` (`name`) VALUES 
('Diabetes Type 1'), 
('Diabetes Type 2'), 
('Hypertension'), 
('Asthma'), 
('Heart Disease'), 
('Cholesterol');
UNLOCK TABLES;

--
-- Table structure for table `patient_conditions`
--

DROP TABLE IF EXISTS `patient_conditions`;
CREATE TABLE `patient_conditions` (
  `patient_id` int NOT NULL,
  `condition_id` int NOT NULL,
  PRIMARY KEY (`patient_id`,`condition_id`),
  KEY `condition_id` (`condition_id`),
  CONSTRAINT `patient_conditions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `patient_conditions_ibfk_2` FOREIGN KEY (`condition_id`) REFERENCES `chronic_conditions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `reset_codes`
--

DROP TABLE IF EXISTS `reset_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `code` varchar(6) NOT NULL,
  `type` enum('email','sms') NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_code` (`code`),
  KEY `idx_expires` (`expires_at`),
  CONSTRAINT `reset_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_codes`
--

LOCK TABLES `reset_codes` WRITE;
/*!40000 ALTER TABLE `reset_codes` DISABLE KEYS */;
INSERT INTO `reset_codes` VALUES (1,22,'952894','email','2026-02-28 01:40:12',0,'2026-02-28 00:25:11'),(2,22,'321377','sms','2026-02-28 01:41:22',0,'2026-02-28 00:26:21'),(3,22,'203544','email','2026-02-28 02:58:49',1,'2026-02-28 01:43:48'),(4,22,'763064','email','2026-02-28 03:27:47',1,'2026-02-28 02:12:46'),(5,22,'415357','email','2026-02-28 03:34:09',1,'2026-02-28 02:19:08'),(6,22,'459608','email','2026-02-28 03:38:08',1,'2026-02-28 02:23:07'),(7,22,'561470','email','2026-02-28 03:49:40',0,'2026-02-28 02:34:40'),(8,22,'263043','email','2026-02-28 03:50:31',0,'2026-02-28 02:35:31'),(9,22,'551459','email','2026-02-28 03:51:21',0,'2026-02-28 02:36:20'),(10,22,'921500','email','2026-02-28 03:52:36',0,'2026-02-28 02:37:36'),(11,22,'436072','email','2026-02-28 03:56:31',0,'2026-02-28 02:41:30'),(12,22,'638014','email','2026-02-28 03:58:47',0,'2026-02-28 02:43:47'),(13,22,'184113','email','2026-02-28 04:02:47',0,'2026-02-28 02:47:47'),(14,22,'427122','email','2026-02-28 04:08:37',0,'2026-02-28 02:53:36'),(15,22,'169735','email','2026-02-28 04:10:26',0,'2026-02-28 02:55:26'),(16,22,'586693','email','2026-02-28 04:13:18',0,'2026-02-28 02:58:18'),(17,22,'623143','email','2026-02-28 04:14:48',0,'2026-02-28 02:59:48'),(18,22,'625934','email','2026-02-28 04:17:13',0,'2026-02-28 03:02:12'),(19,22,'915589','email','2026-02-28 04:18:17',0,'2026-02-28 03:03:16'),(20,22,'255733','email','2026-02-28 04:18:54',0,'2026-02-28 03:03:53'),(21,22,'132155','email','2026-02-28 04:25:36',1,'2026-02-28 03:10:36'),(22,6,'101244','email','2026-02-28 04:28:00',0,'2026-02-28 03:13:00');
/*!40000 ALTER TABLE `reset_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statistics`
--

DROP TABLE IF EXISTS `statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statistics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `total_patients` int DEFAULT '0',
  `total_admins` int DEFAULT '0',
  `adherence_rate` decimal(5,2) DEFAULT '0.00',
  `calculated_date` date DEFAULT (curdate()),
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statistics`
--

LOCK TABLES `statistics` WRITE;
/*!40000 ALTER TABLE `statistics` DISABLE KEYS */;
/*!40000 ALTER TABLE `statistics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatments`
--

DROP TABLE IF EXISTS `treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `condition_id` int DEFAULT NULL,
  `medication_name` varchar(100) NOT NULL,
  `dosage` varchar(50) DEFAULT NULL,
  `frequency` enum('Once daily','Twice daily','Three times daily','Four times daily','Every 12 hours','Every 8 hours','Every 6 hours','As needed') DEFAULT 'Once daily',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `condition_id` (`condition_id`),
  CONSTRAINT `treatments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `treatments_ibfk_2` FOREIGN KEY (`condition_id`) REFERENCES `chronic_conditions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatments`
--

LOCK TABLES `treatments` WRITE;
/*!40000 ALTER TABLE `treatments` DISABLE KEYS */;
/*!40000 ALTER TABLE `treatments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('patient','admin') DEFAULT 'patient',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'Administrateur Principal','admin@medapp.com','$2b$10$5u.u09XNLhX7sDfL9z9ekuL50QPBAOnkl7Cu6hWiTb9ableRZnlCe','0555555556','admin','2026-02-12 21:01:43','2026-02-27 11:08:10'),(22,'Souad Benameur','souadsoussou712@gmail.com','$2b$10$A2fWvaHCH5Z7/E5eOUO4mu8xIob2ArAqrAz/DEOTijyTPQlU.5KlW','0792411812','patient','2026-02-28 00:20:33','2026-02-28 03:11:41');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-02 15:10:48
