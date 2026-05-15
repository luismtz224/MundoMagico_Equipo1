-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: mundo_magico
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_clientes` int unsigned NOT NULL AUTO_INCREMENT,
  `NombreCompleto` varchar(150) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_clientes`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Luis M','',''),(2,'Ana Diaz','844-123-4567','anadiaz@gmail.com'),(3,'Sofia Hernandez','844-123-4567','cortessofia925@gmail.com'),(4,'Sofia Hernandez','844-123-4567','cortessofia925@gmail.com'),(5,'Sofia Hernandez','844-123-4567','cortessofia925@gmail.com');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contratos`
--

DROP TABLE IF EXISTS `contratos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contratos` (
  `id_contratos` int unsigned NOT NULL AUTO_INCREMENT,
  `RESERVACIONES_COTIZACIONES_id_cotizaciones` int unsigned NOT NULL,
  `RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes` int unsigned NOT NULL,
  `RESERVACIONES_id_reservaciones` int unsigned NOT NULL,
  `RESERVACIONES_USUARIOS_id_usuario` int unsigned NOT NULL,
  `fecha_firma` date DEFAULT NULL,
  PRIMARY KEY (`id_contratos`,`RESERVACIONES_COTIZACIONES_id_cotizaciones`,`RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`,`RESERVACIONES_id_reservaciones`,`RESERVACIONES_USUARIOS_id_usuario`),
  KEY `RESERVACIONES_id_reservaciones` (`RESERVACIONES_id_reservaciones`,`RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`,`RESERVACIONES_COTIZACIONES_id_cotizaciones`,`RESERVACIONES_USUARIOS_id_usuario`),
  CONSTRAINT `contratos_ibfk_1` FOREIGN KEY (`RESERVACIONES_id_reservaciones`, `RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`, `RESERVACIONES_COTIZACIONES_id_cotizaciones`, `RESERVACIONES_USUARIOS_id_usuario`) REFERENCES `reservaciones` (`id_reservaciones`, `COTIZACIONES_CLIENTES_id_clientes`, `COTIZACIONES_id_cotizaciones`, `USUARIOS_id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contratos`
--

LOCK TABLES `contratos` WRITE;
/*!40000 ALTER TABLE `contratos` DISABLE KEYS */;
/*!40000 ALTER TABLE `contratos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cotizaciones`
--

DROP TABLE IF EXISTS `cotizaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizaciones` (
  `id_cotizaciones` int unsigned NOT NULL AUTO_INCREMENT,
  `CLIENTES_id_clientes` int unsigned NOT NULL,
  `fecha_emision` date DEFAULT NULL,
  `monto_estimado` decimal(10,2) DEFAULT NULL,
  `detalles` text,
  PRIMARY KEY (`id_cotizaciones`,`CLIENTES_id_clientes`),
  KEY `COTIZACIONES_FKIndex1` (`CLIENTES_id_clientes`),
  CONSTRAINT `cotizaciones_ibfk_1` FOREIGN KEY (`CLIENTES_id_clientes`) REFERENCES `clientes` (`id_clientes`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizaciones`
--

LOCK TABLES `cotizaciones` WRITE;
/*!40000 ALTER TABLE `cotizaciones` DISABLE KEYS */;
INSERT INTO `cotizaciones` VALUES (1,1,'2026-05-03',120000.00,'Boda - Anticipo: $1000'),(2,2,'2026-05-03',4500.00,'Bautizo - Anticipo: $1000'),(3,3,'2026-05-04',50000.00,'Boda - Anticipo: $10000'),(4,4,'2026-05-04',50000.00,'Boda - Anticipo: $10000'),(5,5,'2026-05-04',50000.00,'Boda - Anticipo: $10000');
/*!40000 ALTER TABLE `cotizaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `egresos`
--

DROP TABLE IF EXISTS `egresos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `egresos` (
  `id_egreso` int unsigned NOT NULL AUTO_INCREMENT,
  `concepto` varchar(255) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `fecha_egreso` date DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_egreso`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `egresos`
--

LOCK TABLES `egresos` WRITE;
/*!40000 ALTER TABLE `egresos` DISABLE KEYS */;
INSERT INTO `egresos` VALUES (1,'Sonido Especial — Servicio para boda 15 de mayo',5000.00,'2026-05-15','Proveedor');
/*!40000 ALTER TABLE `egresos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id_inventario` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_item` varchar(150) DEFAULT NULL,
  `cantidad_total` int DEFAULT NULL,
  `estado_actual` varchar(50) DEFAULT NULL,
  `en_uso` int DEFAULT '0',
  PRIMARY KEY (`id_inventario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (1,'Silla Tiffany Blanca',200,'Excelente',100),(2,'Mesa Redonda (10 pers)',25,'Bueno',0),(3,'Mantelería Terciopelo',30,'Limpieza requerida',0);
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id_pagos` int unsigned NOT NULL AUTO_INCREMENT,
  `RESERVACIONES_COTIZACIONES_id_cotizaciones` int unsigned NOT NULL,
  `RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes` int unsigned NOT NULL,
  `RESERVACIONES_id_reservaciones` int unsigned NOT NULL,
  `RESERVACIONES_USUARIOS_id_usuario` int unsigned NOT NULL,
  `USUARIOS_id_usuario` int unsigned NOT NULL,
  `Monto` decimal(10,2) DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_pagos`,`RESERVACIONES_COTIZACIONES_id_cotizaciones`,`RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`,`RESERVACIONES_id_reservaciones`,`RESERVACIONES_USUARIOS_id_usuario`,`USUARIOS_id_usuario`),
  KEY `RESERVACIONES_id_reservaciones` (`RESERVACIONES_id_reservaciones`,`RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`,`RESERVACIONES_COTIZACIONES_id_cotizaciones`,`RESERVACIONES_USUARIOS_id_usuario`),
  KEY `USUARIOS_id_usuario` (`USUARIOS_id_usuario`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`RESERVACIONES_id_reservaciones`, `RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`, `RESERVACIONES_COTIZACIONES_id_cotizaciones`, `RESERVACIONES_USUARIOS_id_usuario`) REFERENCES `reservaciones` (`id_reservaciones`, `COTIZACIONES_CLIENTES_id_clientes`, `COTIZACIONES_id_cotizaciones`, `USUARIOS_id_usuario`),
  CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`USUARIOS_id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (2,1,1,1,1,1,1200.00,'2026-05-03','Efectivo',NULL),(3,1,1,1,1,1,1200.00,'2026-05-03','Efectivo',NULL),(4,1,1,1,1,1,1500.00,'2026-05-03','Transferencia',NULL),(5,2,2,2,1,1,1500.00,'2026-05-03','Tarjeta',NULL);
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores_externos`
--

DROP TABLE IF EXISTS `proveedores_externos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores_externos` (
  `id_proveedores` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_empresa` varchar(150) DEFAULT NULL,
  `servicio` varchar(100) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_proveedores`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores_externos`
--

LOCK TABLES `proveedores_externos` WRITE;
/*!40000 ALTER TABLE `proveedores_externos` DISABLE KEYS */;
INSERT INTO `proveedores_externos` VALUES (1,'Sonido Especial','Musica','844-123-4567');
/*!40000 ALTER TABLE `proveedores_externos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporte_danos`
--

DROP TABLE IF EXISTS `reporte_danos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_danos` (
  `id_reportedanos` int unsigned NOT NULL AUTO_INCREMENT,
  `RESERVACIONES_COTIZACIONES_id_cotizaciones` int unsigned NOT NULL,
  `RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes` int unsigned NOT NULL,
  `RESERVACIONES_id_reservaciones` int unsigned NOT NULL,
  `INVENTARIO_id_inventario` int unsigned NOT NULL,
  `RESERVACIONES_USUARIOS_id_usuario` int unsigned NOT NULL,
  `USUARIOS_id_usuario` int unsigned NOT NULL,
  `Descripcion` text,
  `costo_estimado` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_reportedanos`,`RESERVACIONES_COTIZACIONES_id_cotizaciones`,`RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`,`RESERVACIONES_id_reservaciones`,`INVENTARIO_id_inventario`,`RESERVACIONES_USUARIOS_id_usuario`,`USUARIOS_id_usuario`),
  KEY `RESERVACIONES_id_reservaciones` (`RESERVACIONES_id_reservaciones`,`RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`,`RESERVACIONES_COTIZACIONES_id_cotizaciones`,`RESERVACIONES_USUARIOS_id_usuario`),
  KEY `INVENTARIO_id_inventario` (`INVENTARIO_id_inventario`),
  KEY `USUARIOS_id_usuario` (`USUARIOS_id_usuario`),
  CONSTRAINT `reporte_danos_ibfk_1` FOREIGN KEY (`RESERVACIONES_id_reservaciones`, `RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`, `RESERVACIONES_COTIZACIONES_id_cotizaciones`, `RESERVACIONES_USUARIOS_id_usuario`) REFERENCES `reservaciones` (`id_reservaciones`, `COTIZACIONES_CLIENTES_id_clientes`, `COTIZACIONES_id_cotizaciones`, `USUARIOS_id_usuario`),
  CONSTRAINT `reporte_danos_ibfk_2` FOREIGN KEY (`INVENTARIO_id_inventario`) REFERENCES `inventario` (`id_inventario`),
  CONSTRAINT `reporte_danos_ibfk_3` FOREIGN KEY (`USUARIOS_id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporte_danos`
--

LOCK TABLES `reporte_danos` WRITE;
/*!40000 ALTER TABLE `reporte_danos` DISABLE KEYS */;
INSERT INTO `reporte_danos` VALUES (1,1,1,1,1,1,1,'Manchadas con vino',5000.00);
/*!40000 ALTER TABLE `reporte_danos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservaciones`
--

DROP TABLE IF EXISTS `reservaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservaciones` (
  `id_reservaciones` int unsigned NOT NULL AUTO_INCREMENT,
  `COTIZACIONES_CLIENTES_id_clientes` int unsigned NOT NULL,
  `COTIZACIONES_id_cotizaciones` int unsigned NOT NULL,
  `USUARIOS_id_usuario` int unsigned NOT NULL,
  `fecha_evento` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `tipo_evento` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_reservaciones`,`COTIZACIONES_CLIENTES_id_clientes`,`COTIZACIONES_id_cotizaciones`,`USUARIOS_id_usuario`),
  KEY `RESERVACIONES_FKIndex1` (`COTIZACIONES_id_cotizaciones`,`COTIZACIONES_CLIENTES_id_clientes`),
  KEY `RESERVACIONES_FKIndex2` (`USUARIOS_id_usuario`),
  CONSTRAINT `reservaciones_ibfk_1` FOREIGN KEY (`COTIZACIONES_id_cotizaciones`, `COTIZACIONES_CLIENTES_id_clientes`) REFERENCES `cotizaciones` (`id_cotizaciones`, `CLIENTES_id_clientes`),
  CONSTRAINT `reservaciones_ibfk_2` FOREIGN KEY (`USUARIOS_id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservaciones`
--

LOCK TABLES `reservaciones` WRITE;
/*!40000 ALTER TABLE `reservaciones` DISABLE KEYS */;
INSERT INTO `reservaciones` VALUES (1,1,1,1,'2026-04-29','17:07:00','12:30:00','Boda','Confirmado'),(2,2,2,1,'2026-05-06','12:00:00','20:00:00','Bautizo','Cancelado'),(5,5,5,1,'2026-05-15','19:00:00','03:27:00','Boda','Cancelado');
/*!40000 ALTER TABLE `reservaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios_contratados`
--

DROP TABLE IF EXISTS `servicios_contratados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios_contratados` (
  `id_servicios` int unsigned NOT NULL AUTO_INCREMENT,
  `RESERVACIONES_COTIZACIONES_id_cotizaciones` int unsigned NOT NULL,
  `RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes` int unsigned NOT NULL,
  `RESERVACIONES_id_reservaciones` int unsigned NOT NULL,
  `PROVEEDORES_EXTERNOS_id_proveedores` int unsigned NOT NULL,
  `RESERVACIONES_USUARIOS_id_usuario` int unsigned NOT NULL,
  `costo_servicio` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_servicios`,`RESERVACIONES_COTIZACIONES_id_cotizaciones`,`RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`,`RESERVACIONES_id_reservaciones`,`PROVEEDORES_EXTERNOS_id_proveedores`,`RESERVACIONES_USUARIOS_id_usuario`),
  KEY `RESERVACIONES_id_reservaciones` (`RESERVACIONES_id_reservaciones`,`RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`,`RESERVACIONES_COTIZACIONES_id_cotizaciones`,`RESERVACIONES_USUARIOS_id_usuario`),
  KEY `PROVEEDORES_EXTERNOS_id_proveedores` (`PROVEEDORES_EXTERNOS_id_proveedores`),
  CONSTRAINT `servicios_contratados_ibfk_1` FOREIGN KEY (`RESERVACIONES_id_reservaciones`, `RESERVACIONES_COTIZACIONES_CLIENTES_id_clientes`, `RESERVACIONES_COTIZACIONES_id_cotizaciones`, `RESERVACIONES_USUARIOS_id_usuario`) REFERENCES `reservaciones` (`id_reservaciones`, `COTIZACIONES_CLIENTES_id_clientes`, `COTIZACIONES_id_cotizaciones`, `USUARIOS_id_usuario`),
  CONSTRAINT `servicios_contratados_ibfk_2` FOREIGN KEY (`PROVEEDORES_EXTERNOS_id_proveedores`) REFERENCES `proveedores_externos` (`id_proveedores`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios_contratados`
--

LOCK TABLES `servicios_contratados` WRITE;
/*!40000 ALTER TABLE `servicios_contratados` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicios_contratados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int unsigned NOT NULL AUTO_INCREMENT,
  `NombreUsuario` varchar(100) DEFAULT NULL,
  `Contraseña` varchar(255) DEFAULT NULL,
  `tipo_usuario` varchar(50) DEFAULT NULL,
  `NombreCompleto` varchar(150) DEFAULT NULL,
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','1234','Dueña','Administrador',1),(4,'SofiaC','0201','Dueño','Sofia Cortes',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-06 17:54:02
