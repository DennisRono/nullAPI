DROP TABLE IF EXISTS `contact`;

CREATE TABLE `contact` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` tinytext,
  `Email` varchar(45) DEFAULT NULL,
  `Phone` int DEFAULT NULL,
  `Website` varchar(100) DEFAULT NULL,
  `Brief` longtext,
  `Assets` varchar(255) DEFAULT NULL,
  `MessageID` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Email_UNIQUE` (`Email`),
  UNIQUE KEY `MessageID_UNIQUE` (`MessageID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

LOCK TABLES `contact` WRITE;
INSERT INTO `contact` VALUES (1,'Ramsey Noah','dennisrkibet@gmail.com',747116710,'http://denniskibet.com','How to Open Sticky Notes in Windows 11. Open Windows Search by clicking the \'Search\' button in the taskbar and type \'Sticky Notes\' in the search bar. Then, click on the app name from search results or click on \'Open\' on the right side of the search results to launch the Sticky Notes app','my-image.png','l8qb4scaq3t6szxdp7c');

UNLOCK TABLES
