-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 12, 2026 at 09:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rfid_tapsys`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `type` enum('IN','OUT') NOT NULL,
  `timestamp` datetime NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `studentId`, `type`, `timestamp`, `date`) VALUES
(164, 1, 'IN', '2025-10-23 10:46:21', '2025-10-23'),
(165, 6, 'IN', '2025-10-23 10:50:13', '2025-10-23'),
(166, 5, 'IN', '2025-10-23 10:50:26', '2025-10-23'),
(167, 5, 'OUT', '2025-10-23 11:24:51', '2025-10-23'),
(168, 5, 'IN', '2025-10-23 11:28:31', '2025-10-23'),
(169, 1, 'OUT', '2025-10-23 11:28:36', '2025-10-23'),
(170, 6, 'OUT', '2025-10-23 11:28:43', '2025-10-23'),
(171, 6, 'IN', '2025-10-23 11:28:55', '2025-10-23'),
(172, 1, 'IN', '2025-10-23 11:29:00', '2025-10-23'),
(173, 5, 'OUT', '2025-10-23 11:29:05', '2025-10-23'),
(174, 5, 'IN', '2025-10-23 11:29:20', '2025-10-23'),
(175, 5, 'OUT', '2025-10-23 11:29:24', '2025-10-23'),
(176, 1, 'OUT', '2025-10-23 11:29:27', '2025-10-23'),
(177, 5, 'IN', '2025-10-23 11:29:31', '2025-10-23'),
(178, 1, 'IN', '2025-10-23 11:29:35', '2025-10-23'),
(179, 1, 'OUT', '2025-10-23 11:29:41', '2025-10-23'),
(180, 5, 'OUT', '2025-10-23 11:29:45', '2025-10-23'),
(181, 1, 'IN', '2025-10-23 11:29:49', '2025-10-23'),
(182, 5, 'IN', '2025-10-23 11:30:11', '2025-10-23'),
(183, 5, 'OUT', '2025-10-23 11:30:14', '2025-10-23'),
(184, 5, 'IN', '2025-10-23 11:30:18', '2025-10-23'),
(185, 5, 'OUT', '2025-10-23 11:30:21', '2025-10-23'),
(186, 5, 'IN', '2025-10-23 11:30:28', '2025-10-23'),
(187, 5, 'OUT', '2025-10-23 11:30:33', '2025-10-23'),
(188, 1, 'OUT', '2025-10-23 11:30:37', '2025-10-23'),
(189, 1, 'IN', '2025-10-23 11:30:46', '2025-10-23'),
(190, 1, 'OUT', '2025-10-23 11:32:26', '2025-10-23'),
(191, 5, 'IN', '2025-10-23 11:32:34', '2025-10-23'),
(192, 1, 'IN', '2025-10-23 11:32:38', '2025-10-23'),
(193, 1, 'OUT', '2025-10-23 11:32:41', '2025-10-23'),
(194, 1, 'IN', '2025-10-23 11:32:45', '2025-10-23'),
(195, 1, 'OUT', '2025-10-23 11:32:49', '2025-10-23'),
(196, 6, 'OUT', '2025-10-23 11:32:53', '2025-10-23'),
(197, 1, 'IN', '2025-10-23 11:32:57', '2025-10-23'),
(198, 6, 'IN', '2025-10-23 11:33:01', '2025-10-23'),
(199, 5, 'OUT', '2025-10-23 11:33:05', '2025-10-23'),
(200, 1, 'OUT', '2025-10-23 11:33:09', '2025-10-23'),
(201, 1, 'IN', '2025-10-23 12:43:55', '2025-10-23'),
(202, 6, 'OUT', '2025-10-23 12:47:29', '2025-10-23'),
(203, 6, 'IN', '2025-10-23 12:54:57', '2025-10-23'),
(204, 5, 'IN', '2025-10-23 12:57:08', '2025-10-23'),
(205, 6, 'OUT', '2025-10-23 12:59:08', '2025-10-23'),
(206, 1, 'OUT', '2025-10-23 12:59:18', '2025-10-23'),
(207, 5, 'OUT', '2025-10-23 12:59:26', '2025-10-23'),
(208, 6, 'IN', '2025-10-23 13:01:42', '2025-10-23'),
(209, 1, 'IN', '2025-10-23 13:01:47', '2025-10-23'),
(210, 5, 'IN', '2025-10-23 13:01:51', '2025-10-23'),
(211, 1, 'OUT', '2025-10-23 13:06:47', '2025-10-23'),
(212, 5, 'OUT', '2025-10-23 13:06:51', '2025-10-23'),
(213, 6, 'OUT', '2025-10-23 13:06:56', '2025-10-23'),
(214, 1, 'IN', '2025-10-23 13:07:51', '2025-10-23'),
(215, 6, 'IN', '2025-10-23 13:07:58', '2025-10-23'),
(216, 5, 'IN', '2025-10-23 13:08:06', '2025-10-23'),
(217, 6, 'OUT', '2025-10-23 14:27:20', '2025-10-23'),
(218, 5, 'OUT', '2025-10-23 14:27:35', '2025-10-23'),
(219, 1, 'OUT', '2025-10-23 14:27:43', '2025-10-23'),
(220, 6, 'IN', '2025-10-23 14:28:32', '2025-10-23'),
(221, 1, 'IN', '2025-10-23 14:28:47', '2025-10-23'),
(222, 5, 'IN', '2025-10-23 14:29:19', '2025-10-23'),
(223, 6, 'OUT', '2025-10-23 14:29:36', '2025-10-23'),
(224, 1, 'OUT', '2025-10-23 14:29:47', '2025-10-23'),
(225, 5, 'OUT', '2025-10-23 14:30:19', '2025-10-23'),
(226, 6, 'IN', '2025-10-23 14:30:45', '2025-10-23'),
(227, 1, 'IN', '2025-10-23 14:30:59', '2025-10-23'),
(228, 5, 'IN', '2025-10-23 14:32:21', '2025-10-23'),
(229, 6, 'OUT', '2025-10-23 14:33:06', '2025-10-23'),
(230, 1, 'OUT', '2025-10-23 14:33:10', '2025-10-23'),
(231, 5, 'OUT', '2025-10-23 14:33:46', '2025-10-23'),
(240, 6, 'IN', '2025-10-24 19:01:05', '2025-10-24'),
(246, 1, 'IN', '2025-10-24 19:09:56', '2025-10-24'),
(247, 6, 'OUT', '2025-10-24 19:10:02', '2025-10-24'),
(248, 5, 'IN', '2025-10-24 19:10:07', '2025-10-24'),
(249, 5, 'IN', '2026-01-12 16:03:48', '2026-01-12');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `departmentId` int(11) NOT NULL,
  `acronym` varchar(15) NOT NULL,
  `departmentName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`departmentId`, `acronym`, `departmentName`) VALUES
(1, 'BSCS', 'Bachelor of Science in Computer Science'),
(2, 'BSIT', 'Bachelor of Science in Information Technology'),
(3, 'BSSW', 'Bachelor of Science in Social Work'),
(4, 'BECED', 'Bachelor of Early Childhood Education');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `rfidTag` varchar(50) DEFAULT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `middleInitial` varchar(1) DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `guardianName` varchar(100) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `year` tinyint(4) NOT NULL CHECK (`year` between 1 and 4),
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `rfidTag`, `firstName`, `lastName`, `middleInitial`, `birthDate`, `address`, `guardianName`, `departmentId`, `year`, `photo`) VALUES
(1, '0005811274', 'Gina', 'Macaraig', 'M', '2025-10-20', 'Lipakan', 'Mar', 2, 2, '/uploads/9637ecd5-dd65-4401-b02a-3571e5d07966-1761200381599.jpeg'),
(5, '0005812869', 'Jana', 'Kin', 'M', '2025-10-23', 'Lipakan', 'Mel', 2, 1, '/uploads/bc38bc96-2b91-496d-ab45-423e06b5ddd9-1761115406044.jpeg'),
(6, '0005808537', 'Geo', 'Ong', NULL, '2025-10-06', 'Palawan', 'Ong', 2, 4, '/uploads/geo-1761186582483.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `studentId` (`studentId`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`departmentId`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rfidTag` (`rfidTag`),
  ADD KEY `departmentId` (`departmentId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=250;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `departmentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`departmentId`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
