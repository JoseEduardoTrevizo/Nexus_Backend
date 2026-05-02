CREATE DATABASE  IF NOT EXISTS `directorio_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `directorio_db`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: directorio_db
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `empresas`
--

DROP TABLE IF EXISTS `empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `industria` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `picture_perfil` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `tamano_empresa` varchar(45) DEFAULT NULL,
  `horario` varchar(255) DEFAULT NULL,
  `ciudad` varchar(150) DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `eslogan` varchar(125) DEFAULT NULL,
  `about` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas`
--

LOCK TABLES `empresas` WRITE;
/*!40000 ALTER TABLE `empresas` DISABLE KEYS */;
INSERT INTO `empresas` VALUES (1,'InTecno solutions','test195@gmail.com','Telecomunicaciones','$2b$12$Kvbg9PJ8MXzAtX7N/IFfjuBApuVD5Ww91MCUcDCqwLyrsIAp9t5rW','625-222-8989',NULL,'https://tecnotronic-web.vercel.app/','1 - 10 empleados','Lunes a Viernes: 10:00 AM - 5:00 PM | Sábados: 10:00 AM - 1:00 PM','Cuauhtemoc, Chihuahua','Boulevard Jorge Castillo km 4.5','Empresa que brinda soluciones tecnológicas.','Empresa líder en desarrollo de software y soluciones tecnologicas en automatizaciones','2026-02-22 03:28:32','2026-04-08 01:40:23'),(2,'Nexum','test1@gmail.com','Tecnologia','$2b$12$rJ/ZsS95TADY7SYSWrYfkutJdhOJgPBfr6nyX4f/n2.eYJATaNXYS',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 04:29:53','2026-04-12 04:29:53'),(3,'ekBalam','test2@gmail.com','Construccion','$2b$12$94UO35O3Ow4.37z/P30JOeRIXP0CM4PnX1cSStCHtc3uCnVZeH4pS',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-12 04:36:28','2026-04-12 04:36:28'),(4,'Nexus','test3@gmail.com','Construccion','$2b$12$c.vfNG31c6kNmoaF3.WLNu911Dsx2./PYuLBoofVASXJqETyIW5kO','6251257856',NULL,NULL,NULL,NULL,NULL,'Fransisco I madero entre 2 y 4',NULL,NULL,'2026-04-19 20:11:44','2026-04-19 20:11:44');
/*!40000 ALTER TABLE `empresas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planes`
--

DROP TABLE IF EXISTS `planes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `precio` int NOT NULL,
  `descripcion` json NOT NULL,
  `promocion` varchar(45) DEFAULT NULL,
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planes`
--

LOCK TABLES `planes` WRITE;
/*!40000 ALTER TABLE `planes` DISABLE KEYS */;
INSERT INTO `planes` VALUES (1,'Plan Básico',349,'[\"Perfil básico en el directorio\", \"Información de contacto\", \"Descripción breve (150-200 palabras)\", \"1-3 imágenes\", \"Enlace a sitio web\", \"Integración Google Maps\"]','0',1),(2,'Plan Pro',699,'[\"Todo lo del plan básico +\", \"4 - 6 imágenes para mostrar\", \"Una vacante al mes\", \"Badge \\\"Recomendado\\\"\", \"Estadisticas basicas\"]','0',1),(3,'Plan Premium',749,'[\"Todo los planes anteriores +\", \"Banner publicitario rotativo en pagina de inicio\", \"Tres vacantes al mes\", \"Posicionamiento destacado en su categoria\\\"\", \"Diferentes ubicaciones\", \"Estadisticas avanzadas\"]','0',1);
/*!40000 ALTER TABLE `planes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suscripciones`
--

DROP TABLE IF EXISTS `suscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suscripciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `empresa_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `estado` enum('activa','cancelada','vencida','trial') DEFAULT 'trial',
  `fecha_inicio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin` datetime DEFAULT NULL,
  `auto_renovacion` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_suscripcion_empresa` (`empresa_id`),
  KEY `fk_suscripcion_plan` (`plan_id`),
  CONSTRAINT `fk_suscripcion_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_suscripcion_plan` FOREIGN KEY (`plan_id`) REFERENCES `planes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suscripciones`
--

LOCK TABLES `suscripciones` WRITE;
/*!40000 ALTER TABLE `suscripciones` DISABLE KEYS */;
INSERT INTO `suscripciones` VALUES (1,1,1,'activa','2026-02-21 21:28:32',NULL,1,'2026-02-22 03:28:32'),(2,2,2,'activa','2026-04-11 22:29:53',NULL,1,'2026-04-12 04:29:53'),(3,3,3,'activa','2026-04-11 22:36:28',NULL,1,'2026-04-12 04:36:28'),(4,4,2,'activa','2026-04-19 14:11:44',NULL,1,'2026-04-19 20:11:44');
/*!40000 ALTER TABLE `suscripciones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-01 17:12:02
