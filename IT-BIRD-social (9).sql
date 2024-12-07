-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Дек 07 2024 г., 07:18
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
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `chats`
--

CREATE TABLE `chats` (
  `id` int NOT NULL,
  `user_id_1` int NOT NULL,
  `user_id_2` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `forums`
--

CREATE TABLE `forums` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `question` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `forum_answers`
--

CREATE TABLE `forum_answers` (
  `id` int NOT NULL,
  `forum_id` int NOT NULL,
  `user_id` int NOT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `hackathons`
--

CREATE TABLE `hackathons` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organizer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','completed','upcoming') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'upcoming',
  `participants_limit` int DEFAULT NULL,
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `chat_id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `repositories`
--

CREATE TABLE `repositories` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `repo_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `repo_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_synced` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `repositories`
--

INSERT INTO `repositories` (`id`, `user_id`, `repo_name`, `repo_url`, `last_synced`) VALUES
(135, 13, 'API', 'https://github.com/Natalua9/API', '2024-12-07 00:40:30'),
(136, 13, 'BarShik', 'https://github.com/Natalua9/BarShik', '2024-12-07 00:40:30'),
(137, 13, 'DanseStydio', 'https://github.com/Natalua9/DanseStydio', '2024-12-07 00:40:30'),
(138, 13, 'kyrsovay', 'https://github.com/Natalua9/kyrsovay', '2024-12-07 00:40:30'),
(139, 13, 'laravelDemo', 'https://github.com/Natalua9/laravelDemo', '2024-12-07 00:40:30'),
(140, 13, 'Pinguins1', 'https://github.com/Natalua9/Pinguins1', '2024-12-07 00:40:30'),
(141, 13, 'proect_manager', 'https://github.com/Natalua9/proect_manager', '2024-12-07 00:40:30'),
(142, 13, 'test21', 'https://github.com/Natalua9/test21', '2024-12-07 00:40:30'),
(143, 13, 'todolist', 'https://github.com/Natalua9/todolist', '2024-12-07 00:40:30'),
(144, 14, 'fixdiscord', 'https://github.com/AikenOZ/fixdiscord', '2024-12-07 00:40:54'),
(145, 14, 'hakaton_turbo', 'https://github.com/AikenOZ/hakaton_turbo', '2024-12-07 00:40:54'),
(146, 14, 'OZlamclnr', 'https://github.com/AikenOZ/OZlamclnr', '2024-12-07 00:40:54'),
(147, 15, 'BarShik', 'https://github.com/KhamitovDanil/BarShik', '2024-12-07 00:49:50'),
(148, 15, 'lara-project', 'https://github.com/KhamitovDanil/lara-project', '2024-12-07 00:49:50'),
(149, 15, 'OpenWeatherMap', 'https://github.com/KhamitovDanil/OpenWeatherMap', '2024-12-07 00:49:50'),
(150, 15, 'Penguins', 'https://github.com/KhamitovDanil/Penguins', '2024-12-07 00:49:50'),
(151, 16, 'barshik', 'https://github.com/Stussy147/barshik', '2024-12-07 00:51:47'),
(152, 16, 'course-paper', 'https://github.com/Stussy147/course-paper', '2024-12-07 00:51:47'),
(153, 16, 'fruitcakeBack', 'https://github.com/Stussy147/fruitcakeBack', '2024-12-07 00:51:47'),
(154, 16, 'golang_tested', 'https://github.com/Stussy147/golang_tested', '2024-12-07 00:51:47'),
(155, 16, 'Penguins', 'https://github.com/Stussy147/Penguins', '2024-12-07 00:51:47'),
(156, 16, 'Test', 'https://github.com/Stussy147/Test', '2024-12-07 00:51:47'),
(157, 16, 'test-laravel', 'https://github.com/Stussy147/test-laravel', '2024-12-07 00:51:47'),
(158, 16, 'test1', 'https://github.com/Stussy147/test1', '2024-12-07 00:51:47'),
(159, 16, 'Test2', 'https://github.com/Stussy147/Test2', '2024-12-07 00:51:47'),
(160, 17, '-3java', 'https://github.com/Lizadmi/-3java', '2024-12-07 01:04:18'),
(161, 17, '-_-', 'https://github.com/Lizadmi/-_-', '2024-12-07 01:04:18'),
(162, 17, 'canvas', 'https://github.com/Lizadmi/canvas', '2024-12-07 01:04:18'),
(163, 17, 'cpc1', 'https://github.com/Lizadmi/cpc1', '2024-12-07 01:04:18'),
(164, 17, 'cpc4JAVA_cpc5JAVA', 'https://github.com/Lizadmi/cpc4JAVA_cpc5JAVA', '2024-12-07 01:04:18'),
(165, 17, 'game', 'https://github.com/Lizadmi/game', '2024-12-07 01:04:18'),
(166, 17, 'game_finish', 'https://github.com/Lizadmi/game_finish', '2024-12-07 01:04:18'),
(167, 17, 'kursach', 'https://github.com/Lizadmi/kursach', '2024-12-07 01:04:18'),
(168, 17, 'kursovoy-15', 'https://github.com/Lizadmi/kursovoy-15', '2024-12-07 01:04:18'),
(169, 17, 'laba1', 'https://github.com/Lizadmi/laba1', '2024-12-07 01:04:18'),
(170, 17, 'laba1Alina', 'https://github.com/Lizadmi/laba1Alina', '2024-12-07 01:04:18'),
(171, 17, 'laba2', 'https://github.com/Lizadmi/laba2', '2024-12-07 01:04:18'),
(172, 17, 'laba2Alina', 'https://github.com/Lizadmi/laba2Alina', '2024-12-07 01:04:18'),
(173, 17, 'laba3', 'https://github.com/Lizadmi/laba3', '2024-12-07 01:04:18'),
(174, 17, 'laba3Alina', 'https://github.com/Lizadmi/laba3Alina', '2024-12-07 01:04:18'),
(175, 17, 'lesson', 'https://github.com/Lizadmi/lesson', '2024-12-07 01:04:18'),
(176, 17, 'lesson2', 'https://github.com/Lizadmi/lesson2', '2024-12-07 01:04:18'),
(177, 17, 'mysite', 'https://github.com/Lizadmi/mysite', '2024-12-07 01:04:18'),
(178, 17, 'php', 'https://github.com/Lizadmi/php', '2024-12-07 01:04:18'),
(179, 17, 'task4', 'https://github.com/Lizadmi/task4', '2024-12-07 01:04:18'),
(180, 17, 'telegramBotTest', 'https://github.com/Lizadmi/telegramBotTest', '2024-12-07 01:04:18'),
(181, 17, 'test21', 'https://github.com/Lizadmi/test21', '2024-12-07 01:04:18'),
(182, 17, 'testBot', 'https://github.com/Lizadmi/testBot', '2024-12-07 01:04:18'),
(183, 17, 'testgit', 'https://github.com/Lizadmi/testgit', '2024-12-07 01:04:18'),
(184, 17, 'test_git', 'https://github.com/Lizadmi/test_git', '2024-12-07 01:04:18'),
(185, 17, 'trueskilllslanding', 'https://github.com/Lizadmi/trueskilllslanding', '2024-12-07 01:04:18'),
(186, 17, 'trueskillsWP', 'https://github.com/Lizadmi/trueskillsWP', '2024-12-07 01:04:18'),
(187, 17, 'uniti_lr_1', 'https://github.com/Lizadmi/uniti_lr_1', '2024-12-07 01:04:18'),
(188, 17, 'uniti_lr_2', 'https://github.com/Lizadmi/uniti_lr_2', '2024-12-07 01:04:18'),
(189, 17, 'uniti_lr_3', 'https://github.com/Lizadmi/uniti_lr_3', '2024-12-07 01:04:18');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `github_username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skills` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `github_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `github_username`, `role`, `created_at`, `updated_at`, `avatar`, `skills`, `github_token`) VALUES
(11, 'Tester', 'honorxpremium75@gmail.com', '$2b$10$NZUd3TBdWb6DLfYYFk1o8.10oN6K302rGg.J/xSl8luvQjUArMV5W', NULL, 'user', '2024-12-07 03:17:32', '2024-12-07 03:17:32', NULL, NULL, NULL),
(12, 'Слава', 'slava@mail.ru', '$2b$10$qj3f6hvV9ZiMYH8Inymx2OnUHtFr1VVjHukljIRj0WgJ9cdsf1Rem', 'Viacheslav', 'user', '2024-12-07 03:40:11', '2024-12-07 03:40:11', NULL, NULL, NULL),
(13, 'Наташа', 'nat@mail.ru', '$2b$10$5bZWUXMlqENGyCv1ifGrfuaU70.Ycwl3hWImpQtlE4Q/q3ys9a/9i', 'Natalua9', 'user', '2024-12-07 03:40:30', '2024-12-07 03:40:30', NULL, NULL, NULL),
(14, 'Влад', 'vladoz@mail.ru', '$2b$10$/wEeLXy6xJjp8fw2Qo6H3ueD/U24NJrHaX2/icelOM14sc2CRyQpK', 'AikenOZ', 'user', '2024-12-07 03:40:54', '2024-12-07 03:40:54', NULL, NULL, NULL),
(15, 'Данил', 'danil@mail.ru', '$2b$10$ZAwqhQxxFRHV./n4LScmE.kKZHcWalGokOX75TkmP.6nmkEB3quli', 'KhamitovDanil', 'user', '2024-12-07 03:49:49', '2024-12-07 03:49:49', NULL, NULL, NULL),
(16, 'Динар', 'dinar@mail.ru', '$2b$10$.AJYS74b0g8e1z4FxNGA4.2kYPd0Hm3blnvyoiHXxUtvzaBHwwy82', 'Stussy147', 'user', '2024-12-07 03:51:47', '2024-12-07 03:51:47', NULL, NULL, NULL),
(17, 'Дмитриева Елизавета Константиновна', 'lizadmi@mail.ru', '$2b$10$0TsKDKDyxeTdh83oP2R8F.9vVl1XQ1GHNy8eyXe27QBxhH1AoixA6', 'Lizadmi', 'user', '2024-12-07 04:04:16', '2024-12-07 04:04:16', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `user_hackathons`
--

CREATE TABLE `user_hackathons` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `hackathon_id` int NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `forums`
--
ALTER TABLE `forums`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `forum_answers`
--
ALTER TABLE `forum_answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `hackathons`
--
ALTER TABLE `hackathons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=644;

--
-- AUTO_INCREMENT для таблицы `repositories`
--
ALTER TABLE `repositories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=190;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
