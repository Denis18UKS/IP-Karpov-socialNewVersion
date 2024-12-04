-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Дек 04 2024 г., 20:16
-- Версия сервера: 8.0.30
-- Версия PHP: 8.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `IT-BIRD-social`
--

-- --------------------------------------------------------

--
-- Структура таблицы `admin_logs`
--

CREATE TABLE `admin_logs` (
  `id` int NOT NULL,
  `admin_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `chats`
--

CREATE TABLE `chats` (
  `id` int NOT NULL,
  `user_id_1` int NOT NULL,
  `user_id_2` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `chats`
--

INSERT INTO `chats` (`id`, `user_id_1`, `user_id_2`, `created_at`) VALUES
(1, 1, 2, '2024-12-03 18:12:23'),
(2, 1, 3, '2024-12-03 18:56:11'),
(3, 4, 1, '2024-12-03 21:16:55'),
(4, 4, 2, '2024-12-03 21:26:01'),
(5, 4, 3, '2024-12-03 21:29:24');

-- --------------------------------------------------------

--
-- Структура таблицы `forums`
--

CREATE TABLE `forums` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `question` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `forums`
--

INSERT INTO `forums` (`id`, `user_id`, `question`, `created_at`, `description`, `status`) VALUES
(1, 1, 'test', '2024-12-04 10:28:37', 'test', 'Открыт'),
(2, 1, 'twwd', '2024-12-04 11:16:15', 'wdwdwd\n', 'Открыт'),
(3, 1, 'wdw', '2024-12-04 11:16:22', 'wdwd', 'Открыт');

-- --------------------------------------------------------

--
-- Структура таблицы `forum_answers`
--

CREATE TABLE `forum_answers` (
  `id` int NOT NULL,
  `forum_id` int NOT NULL,
  `user_id` int NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `hackathons`
--

CREATE TABLE `hackathons` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `registration_link` varchar(255) DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `status` enum('active','completed','upcoming') DEFAULT 'upcoming',
  `participants_limit` int DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `chat_id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `messages`
--

INSERT INTO `messages` (`id`, `chat_id`, `user_id`, `message`, `created_at`) VALUES
(1, 1, 1, 'test', '2024-12-03 18:52:00'),
(2, 3, 4, 'Привет', '2024-12-03 21:21:04'),
(3, 3, 4, 'Привет', '2024-12-03 21:30:49'),
(4, 3, 4, 'Как дела?', '2024-12-03 21:30:55'),
(5, 3, 4, 'Не понял', '2024-12-03 21:31:15'),
(6, 3, 1, 'Привет, норм, у тя?', '2024-12-03 21:39:04'),
(7, 3, 1, 'Ладнооо', '2024-12-03 21:59:17'),
(8, 3, 1, 'цдцвлдцвждцж', '2024-12-03 22:08:37'),
(9, 1, 1, 'дцдцлвжвцд', '2024-12-03 22:08:45'),
(10, 1, 1, 'Ладно', '2024-12-03 22:08:47'),
(11, 1, 1, 'Хрен ', '2024-12-03 22:08:49'),
(12, 1, 1, 'С ним', '2024-12-03 22:08:50'),
(13, 1, 1, 'поойдет', '2024-12-03 22:08:52'),
(14, 2, 1, 'Привет', '2024-12-03 22:09:04'),
(15, 1, 1, 'а где', '2024-12-03 22:46:39'),
(16, 3, 1, 'цвцв', '2024-12-03 23:26:16'),
(17, 3, 1, 'вццвцв', '2024-12-03 23:26:16'),
(18, 3, 1, 'цвцввц', '2024-12-03 23:26:17'),
(19, 3, 1, 'вцвцвц', '2024-12-03 23:26:17'),
(20, 3, 1, 'цвцввццв', '2024-12-03 23:26:18'),
(21, 3, 1, 'цввццв', '2024-12-03 23:26:19'),
(22, 2, 1, 'Ehf', '2024-12-03 23:42:31'),
(23, 2, 1, 'Ура*', '2024-12-03 23:42:33'),
(24, 2, 1, 'Это теперь работает', '2024-12-03 23:42:38'),
(25, 2, 1, 'победа', '2024-12-03 23:42:40'),
(26, 2, 1, 'Ееееееее', '2024-12-03 23:42:43'),
(27, 1, 1, 'Ура, работает!!!!', '2024-12-03 23:42:57');

-- --------------------------------------------------------

--
-- Структура таблицы `repositories`
--

CREATE TABLE `repositories` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `repo_name` varchar(100) NOT NULL,
  `repo_url` varchar(255) NOT NULL,
  `last_synced` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `repositories`
--

INSERT INTO `repositories` (`id`, `user_id`, `repo_name`, `repo_url`, `last_synced`) VALUES
(1, 5, 'fixdiscord', 'https://github.com/AikenOZ/fixdiscord', '2024-12-04 04:44:21'),
(2, 5, 'hakaton_turbo', 'https://github.com/AikenOZ/hakaton_turbo', '2024-12-04 04:44:21'),
(3, 5, 'OZlamclnr', 'https://github.com/AikenOZ/OZlamclnr', '2024-12-04 04:44:21'),
(4, 3, 'API', 'https://github.com/Natalua9/API', '2024-12-04 09:46:32'),
(5, 3, 'BarShik', 'https://github.com/Natalua9/BarShik', '2024-12-04 09:46:32'),
(6, 3, 'DanseStydio', 'https://github.com/Natalua9/DanseStydio', '2024-12-04 09:46:32'),
(7, 3, 'kyrsovay', 'https://github.com/Natalua9/kyrsovay', '2024-12-04 09:46:32'),
(8, 3, 'laravelDemo', 'https://github.com/Natalua9/laravelDemo', '2024-12-04 09:46:32'),
(9, 3, 'Pinguins1', 'https://github.com/Natalua9/Pinguins1', '2024-12-04 09:46:32'),
(10, 3, 'proect_manager', 'https://github.com/Natalua9/proect_manager', '2024-12-04 09:46:32'),
(11, 3, 'test21', 'https://github.com/Natalua9/test21', '2024-12-04 09:46:32'),
(12, 3, 'todolist', 'https://github.com/Natalua9/todolist', '2024-12-04 09:46:32'),
(13, 2, '-', 'https://github.com/Denis18UKS/-', '2024-12-04 09:46:42'),
(14, 2, 'BarShik', 'https://github.com/Denis18UKS/BarShik', '2024-12-04 09:46:42'),
(15, 2, 'breadMaket', 'https://github.com/Denis18UKS/breadMaket', '2024-12-04 09:46:42'),
(16, 2, 'Concurs', 'https://github.com/Denis18UKS/Concurs', '2024-12-04 09:46:42'),
(17, 2, 'CurseForgeMyInstances', 'https://github.com/Denis18UKS/CurseForgeMyInstances', '2024-12-04 09:46:42'),
(18, 2, 'GITKonkurs2V-Penza-', 'https://github.com/Denis18UKS/GITKonkurs2V-Penza-', '2024-12-04 09:46:42'),
(19, 2, 'IP-Karpov-social', 'https://github.com/Denis18UKS/IP-Karpov-social', '2024-12-04 09:46:42'),
(20, 2, 'IP-Karpov-socialNewVersion', 'https://github.com/Denis18UKS/IP-Karpov-socialNewVersion', '2024-12-04 09:46:42'),
(21, 2, 'IT-BIRD-social', 'https://github.com/Denis18UKS/IT-BIRD-social', '2024-12-04 09:46:42'),
(22, 2, 'karpov-diplom-project', 'https://github.com/Denis18UKS/karpov-diplom-project', '2024-12-04 09:46:42'),
(23, 2, 'Karpov-Laravel-test', 'https://github.com/Denis18UKS/Karpov-Laravel-test', '2024-12-04 09:46:42'),
(24, 2, 'Kulinar', 'https://github.com/Denis18UKS/Kulinar', '2024-12-04 09:46:42'),
(25, 2, 'kursach', 'https://github.com/Denis18UKS/kursach', '2024-12-04 09:46:42'),
(26, 2, 'LaratestKarpovKarpov', 'https://github.com/Denis18UKS/LaratestKarpovKarpov', '2024-12-04 09:46:42'),
(27, 2, 'Laravel-Test', 'https://github.com/Denis18UKS/Laravel-Test', '2024-12-04 09:46:42'),
(28, 2, 'mdk0502', 'https://github.com/Denis18UKS/mdk0502', '2024-12-04 09:46:42'),
(29, 2, 'MyWorks', 'https://github.com/Denis18UKS/MyWorks', '2024-12-04 09:46:42'),
(30, 2, 'national-day', 'https://github.com/Denis18UKS/national-day', '2024-12-04 09:46:42'),
(31, 2, 'newrepos', 'https://github.com/Denis18UKS/newrepos', '2024-12-04 09:46:42'),
(32, 2, 'NewVersIP-Karpov-social', 'https://github.com/Denis18UKS/NewVersIP-Karpov-social', '2024-12-04 09:46:42'),
(33, 2, 'oz-avaise', 'https://github.com/Denis18UKS/oz-avaise', '2024-12-04 09:46:42'),
(34, 2, 'pinguins', 'https://github.com/Denis18UKS/pinguins', '2024-12-04 09:46:42'),
(35, 2, 'pl_hesablama', 'https://github.com/Denis18UKS/pl_hesablama', '2024-12-04 09:46:42'),
(36, 2, 'prj-management', 'https://github.com/Denis18UKS/prj-management', '2024-12-04 09:46:42'),
(37, 2, 'prj-management-Karpov', 'https://github.com/Denis18UKS/prj-management-Karpov', '2024-12-04 09:46:42'),
(38, 2, 'prj-managements', 'https://github.com/Denis18UKS/prj-managements', '2024-12-04 09:46:42'),
(39, 2, 'prj-managementssss', 'https://github.com/Denis18UKS/prj-managementssss', '2024-12-04 09:46:42'),
(40, 2, 'project-manager', 'https://github.com/Denis18UKS/project-manager', '2024-12-04 09:46:42'),
(41, 2, 'Screen_Build', 'https://github.com/Denis18UKS/Screen_Build', '2024-12-04 09:46:42'),
(42, 2, 'Teacher', 'https://github.com/Denis18UKS/Teacher', '2024-12-04 09:46:42'),
(43, 4, '-', 'https://github.com/Molin1987/-', '2024-12-04 09:46:55'),
(44, 4, 'BARSHIK', 'https://github.com/Molin1987/BARSHIK', '2024-12-04 09:46:55'),
(45, 4, 'demoLaravel', 'https://github.com/Molin1987/demoLaravel', '2024-12-04 09:46:55'),
(46, 4, 'Kursovaya', 'https://github.com/Molin1987/Kursovaya', '2024-12-04 09:46:55'),
(47, 4, 'lab1', 'https://github.com/Molin1987/lab1', '2024-12-04 09:46:55'),
(48, 4, 'Project-manager', 'https://github.com/Molin1987/Project-manager', '2024-12-04 09:46:55'),
(49, 4, 'Scooter24', 'https://github.com/Molin1987/Scooter24', '2024-12-04 09:46:55'),
(50, 4, 'test', 'https://github.com/Molin1987/test', '2024-12-04 09:46:55'),
(51, 4, 'ToDo', 'https://github.com/Molin1987/ToDo', '2024-12-04 09:46:55'),
(52, 4, 'Videohosting', 'https://github.com/Molin1987/Videohosting', '2024-12-04 09:46:55');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `github_username` varchar(100) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar` varchar(255) DEFAULT NULL,
  `skills` text,
  `github_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `github_username`, `role`, `created_at`, `updated_at`, `avatar`, `skills`, `github_token`) VALUES
(1, 'Денис1', 'honorxpremium75@gmail.com', '$2b$10$HEJ9i2eWvXv7moRo9Ct51evndRQ/aUNpdrUHuQSGTWhnGgfZeLyqu', NULL, 'user', '2024-11-29 06:23:22', '2024-12-03 21:06:00', NULL, 'PHP, React, JavaScript и тд', NULL),
(2, 'Денис', 'lakos208@gmail.com', '$2b$10$Ulun95o8.YWT2PurRKFD1eAL1Ee06oC4BP92P5KFSJn.j93pMOcoy', 'Denis18UKS', 'user', '2024-12-02 05:36:01', '2024-12-02 05:36:01', NULL, NULL, NULL),
(3, 'Наташа', 'nat@mail.ru', '$2b$10$D3PavHm4LJuzZKNL4ImU0e/dg.EM42thE2Zeib0ExVY9eMy6zdcNS', 'Natalua9', 'user', '2024-12-02 07:12:09', '2024-12-03 22:53:46', '/uploads/avatars/1733266426052-s4mnDH4OCgA.jpg', 'Laravel, php, html, css, bootstrap, вёрстка по макету\r\n\r\n', NULL),
(4, 'Марат', 'marat@mail.ru', '$2b$10$.G74puP.cLm39WDj7RjSSeF9XfhhQui5.X6T3QzxaTr3QO5G6ed72', 'Molin1987', 'user', '2024-12-03 21:16:28', '2024-12-03 21:16:28', NULL, NULL, NULL),
(5, 'Влад', 'vladosOZ@mail.ru', '$2b$10$s0p4wp/FRnL0bt80pPC40eUOOLIT45.WrT.WC5CFLUd54mIsV1qKe', 'AikenOZ', 'user', '2024-12-04 07:44:21', '2024-12-04 15:18:14', '/uploads/avatars/1733325494043-photo_2024-10-28_19-11-46.jpg', 'Python, Не пишу код вручную, онли нейросеть\r\nЕсть своя ИИ - OZ-Avaise', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `user_hackathons`
--

CREATE TABLE `user_hackathons` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `hackathon_id` int NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Индексы таблицы `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_1` (`user_id_1`),
  ADD KEY `user_id_2` (`user_id_2`);

--
-- Индексы таблицы `forums`
--
ALTER TABLE `forums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `forum_answers`
--
ALTER TABLE `forum_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `forum_id` (`forum_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `hackathons`
--
ALTER TABLE `hackathons`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_id` (`chat_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `repositories`
--
ALTER TABLE `repositories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Индексы таблицы `user_hackathons`
--
ALTER TABLE `user_hackathons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `hackathon_id` (`hackathon_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `forums`
--
ALTER TABLE `forums`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `forum_answers`
--
ALTER TABLE `forum_answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `hackathons`
--
ALTER TABLE `hackathons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT для таблицы `repositories`
--
ALTER TABLE `repositories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `user_hackathons`
--
ALTER TABLE `user_hackathons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`user_id_1`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`user_id_2`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `forums`
--
ALTER TABLE `forums`
  ADD CONSTRAINT `forums_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `forum_answers`
--
ALTER TABLE `forum_answers`
  ADD CONSTRAINT `forum_answers_ibfk_1` FOREIGN KEY (`forum_id`) REFERENCES `forums` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `forum_answers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `repositories`
--
ALTER TABLE `repositories`
  ADD CONSTRAINT `repositories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_hackathons`
--
ALTER TABLE `user_hackathons`
  ADD CONSTRAINT `user_hackathons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_hackathons_ibfk_2` FOREIGN KEY (`hackathon_id`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
