-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Дек 13 2024 г., 01:00
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
-- Структура таблицы `chats`
--

CREATE TABLE `chats` (
  `id` int NOT NULL,
  `user_id_1` int NOT NULL,
  `user_id_2` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `chats`
--

INSERT INTO `chats` (`id`, `user_id_1`, `user_id_2`, `created_at`) VALUES
(16, 19, 21, '2024-12-09 13:55:34'),
(17, 19, 20, '2024-12-09 13:55:34'),
(18, 24, 19, '2024-12-09 16:33:49'),
(19, 19, 23, '2024-12-09 16:52:06'),
(20, 24, 20, '2024-12-09 16:52:26'),
(21, 19, 22, '2024-12-09 17:04:55'),
(22, 22, 21, '2024-12-12 19:39:45'),
(23, 22, 20, '2024-12-12 19:39:46'),
(24, 23, 25, '2024-12-12 20:12:09'),
(25, 23, 26, '2024-12-12 20:12:30'),
(26, 23, 27, '2024-12-12 20:12:44'),
(27, 19, 25, '2024-12-12 20:12:46'),
(28, 22, 26, '2024-12-12 21:47:09'),
(29, 22, 25, '2024-12-12 21:47:10'),
(30, 22, 23, '2024-12-12 21:47:11'),
(31, 22, 27, '2024-12-12 21:47:14'),
(32, 22, 24, '2024-12-12 21:51:20');

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

--
-- Дамп данных таблицы `forums`
--

INSERT INTO `forums` (`id`, `user_id`, `question`, `created_at`, `description`, `status`) VALUES
(9, 23, 'Как интегрировать ИИ для автоматических ответов в Telegram-бот на Python?', '2024-12-12 20:20:08', 'Вопрос касается того, как создать Telegram-бота на Python, который будет использовать искусственный интеллект для автоматической генерации ответов. Требуется решение, которое объединяет библиотеку python-telegram-bot для работы с Telegram API и одну из библиотек для ИИ, таких как transformers или openai, для реализации возможности ответов на сообщения пользователей.', 'Открыт'),
(10, 27, 'Python для начинающих: с чего начать?', '2024-12-12 20:48:09', 'Хочу начать программировать на Python, но не знаю с чего начать', 'Открыт');

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

--
-- Дамп данных таблицы `forum_answers`
--

INSERT INTO `forum_answers` (`id`, `forum_id`, `user_id`, `answer`, `created_at`) VALUES
(8, 10, 23, 'Начать изучение Python лучше с установки интерпретатора Python (с сайта python.org) и простого редактора кода, например, Visual Studio Code. Затем изучите основы: переменные, типы данных, условные операторы, циклы, функции. Используйте ресурсы, такие как курсы на Stepik, Codecademy или книги, например, «Изучаем Python» Марка Лутца. Практикуйтесь, решая задачи на платформах вроде Codewars или LeetCode.', '2024-12-12 23:52:48'),
(9, 9, 19, 'Используйте python-telegram-bot для Telegram API и openai для ИИ. Установите библиотеки:\n\nbash\nКопировать код\npip install python-telegram-bot openai\nНастройте бота через @BotFather. В коде обрабатывайте сообщения, вызывая OpenAI API для генерации ответов, и отправляйте их пользователю.', '2024-12-12 23:56:30');

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

--
-- Дамп данных таблицы `messages`
--

INSERT INTO `messages` (`id`, `chat_id`, `user_id`, `message`, `created_at`) VALUES
(658, 18, 24, 'Привет', '2024-12-09 16:33:57'),
(659, 16, 19, 'dwdwwd', '2024-12-09 16:47:51'),
(660, 17, 19, 'dwdwwd', '2024-12-09 16:47:56'),
(661, 17, 19, 'dwdwdw', '2024-12-09 16:48:06'),
(662, 17, 19, 'dwdwdw', '2024-12-09 16:48:18'),
(663, 18, 19, 'dwdwdw', '2024-12-09 16:48:23'),
(664, 19, 19, 'dwdwdw', '2024-12-09 16:52:07'),
(665, 18, 19, 'wddwdw', '2024-12-09 16:52:12'),
(666, 18, 19, 'dwdw', '2024-12-09 16:52:12'),
(667, 18, 19, 'dwdw', '2024-12-09 16:52:13'),
(668, 18, 19, 'wd', '2024-12-09 16:52:13'),
(669, 18, 19, 'd', '2024-12-09 16:52:13'),
(670, 18, 19, 'd', '2024-12-09 16:52:13'),
(671, 18, 19, 'dw', '2024-12-09 16:52:14'),
(672, 18, 19, 'dw', '2024-12-09 16:52:14'),
(673, 18, 19, 'dw', '2024-12-09 16:52:14'),
(674, 18, 19, 'dw', '2024-12-09 16:52:14'),
(675, 18, 19, 'w', '2024-12-09 16:52:14'),
(676, 18, 19, 'dw', '2024-12-09 16:52:14'),
(677, 17, 19, 'dwwdwddw', '2024-12-09 16:52:23'),
(678, 17, 19, 'dw', '2024-12-09 16:52:24'),
(679, 17, 19, 'dw', '2024-12-09 16:52:24'),
(680, 17, 19, 'dw', '2024-12-09 16:52:24'),
(681, 17, 19, 'dwdwdwdwdw', '2024-12-09 16:52:28'),
(682, 17, 19, 'dw', '2024-12-09 16:52:28'),
(683, 17, 19, 'wd', '2024-12-09 16:52:28'),
(684, 17, 19, 'dw', '2024-12-09 16:52:29'),
(685, 17, 19, 'dw', '2024-12-09 16:52:29'),
(686, 17, 19, 'wd', '2024-12-09 16:52:29'),
(687, 17, 19, 'dw', '2024-12-09 16:52:29'),
(688, 17, 19, 'dw', '2024-12-09 16:52:29'),
(689, 17, 19, 'dw', '2024-12-09 16:52:30'),
(690, 16, 19, 'dwdwdw', '2024-12-09 16:52:38'),
(691, 21, 19, 'wdwwd', '2024-12-09 17:04:57'),
(692, 17, 19, 'wdwwd', '2024-12-12 19:37:17'),
(693, 23, 22, 'efefe', '2024-12-12 19:39:47'),
(694, 21, 22, 'щзцввхц', '2024-12-12 19:39:54'),
(695, 21, 22, 'Привет', '2024-12-12 19:40:00'),
(696, 24, 23, 'Привет', '2024-12-12 20:12:22'),
(697, 25, 23, 'Здравствуйте!', '2024-12-12 20:12:38'),
(698, 31, 22, 'dwdw', '2024-12-12 21:51:02'),
(699, 31, 22, 'wdw', '2024-12-12 21:51:03'),
(700, 31, 22, 'wdwd', '2024-12-12 21:51:04'),
(701, 31, 22, 'wdwd', '2024-12-12 21:51:05'),
(702, 31, 22, 'dwdwdwwd', '2024-12-12 21:51:14'),
(703, 31, 22, 'dw', '2024-12-12 21:51:14'),
(704, 31, 22, 'wd', '2024-12-12 21:51:14'),
(705, 31, 22, 'dw', '2024-12-12 21:51:15'),
(706, 31, 22, 'wd', '2024-12-12 21:51:15'),
(707, 31, 22, 'wd', '2024-12-12 21:51:15'),
(708, 31, 22, 'wd', '2024-12-12 21:51:15'),
(709, 31, 22, 'wd', '2024-12-12 21:51:15'),
(710, 31, 22, 'wd', '2024-12-12 21:51:15'),
(711, 31, 22, 'wd', '2024-12-12 21:51:16'),
(712, 31, 22, 'wd', '2024-12-12 21:51:16'),
(713, 31, 22, 'wd', '2024-12-12 21:51:16'),
(714, 31, 22, 'wd', '2024-12-12 21:51:16'),
(715, 31, 22, 'wd', '2024-12-12 21:51:16');

-- --------------------------------------------------------

--
-- Структура таблицы `news`
--

CREATE TABLE `news` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('ожидание','принят','отклонен') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'ожидание',
  `link` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `author_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `news`
--

INSERT INTO `news` (`id`, `title`, `description`, `status`, `link`, `image_url`, `author_id`, `created_at`) VALUES
(14, 'Фронтендеры, для вас есть прикольный ресурс', '100 упражнений по созданию дизайна по ТЗ с разной степенью сложности.\r\n\r\nНапример вам надо будет создать:\r\nформу обратной связи, \r\nрасписание мероприятий \r\nсканер QR-кодов\r\nИ многое другое\r\n\r\nВсе упражнения бесплатные и нацелены на практику HTML и CSS, также можете добавить JavaScript и фреймворки.', 'ожидание', 'https://app.bigdevsoon.me/challenges', '/uploads/news/1734032982081-0779ef9f-778e-46cf-b515-946cdf940938.jpeg', 26, '2024-12-12 22:49:42'),
(15, 'Screaming Frog SEO Spider', 'Ведущий в отрасли сканер веб-сайтов для Windows, macOS и Linux, которому доверяют тысячи SEO-специалистов и агентств по всему миру при техническом SEO-аудировании сайтов.', 'ожидание', 'https://www.screamingfrog.co.uk/seo-spider/', '/uploads/news/1734033192847-3b04258b-d2c5-47b5-b075-305e1f13152e.jpeg', 26, '2024-12-12 22:53:12'),
(16, '15 Лучших библиотек диаграмм JavaScript в 2024 году', 'Потребность в отображении данных в виде диаграмм или таблиц стала более важной для каждой организации по мере увеличения объёма собираемых данных. Чтобы создать панель управления и диаграммы, понятные каждому, разработчики должны объединить множество записей из базы данных. Однако с появлением библиотек диаграмм визуализация данных улучшилась. Интерактивные диаграммы теперь доступны в библиотеках и плагинах.\r\n\r\nЧтобы упростить вам задачу, мы изучили множество вариантов и выбрали лучшую библиотеку JavaScript для построения диаграмм в соответствии с вашими требованиями.', 'ожидание', 'https://www.atatus.com/blog/javascript-chart-libraries/', '/uploads/news/1734033286647-2b3456ad-b3b4-4279-a3e8-80dfe52f4b14.jpeg', 26, '2024-12-12 22:54:46'),
(17, 'Искусственный интеллект вывел Python в лидеры среди языков программирования', 'Ежегодный отчёт Octoverse от GitHub показывает, как искусственный интеллект (ИИ) меняет мир разработки программного обеспечения, способствуя росту глобального сообщества разработчиков и меняя ландшафт используемых технологий. Вопреки опасениям, что ИИ заменит программистов, отчёт показал обратное — разработчики активно используют ИИ для создания новых моделей и интеграции их в приложения, одновременно участвуя в большом количестве проектов на GitHub.', 'ожидание', 'https://3dnews.ru/1113294/iskusstvenniy-intellekt-vivel-python-v-top-yazikov-programmirovaniya', '/uploads/news/1734034913219-Programmer.jpg', 23, '2024-12-12 23:21:53'),
(18, 'Google Play прекращает все отношения с российскими разработчиками', 'С 26 декабря 2024 года Google Play прекратит делать платежи в адрес разработчиков, чьи банковские счета находятся в России. Доход от продаж по всему миру начисляться не будет.\r\n\r\nТак же станет невозможна монетизация - с указанной даты будут отклоняться все попытки пользователей приобрести платные приложения, сделать покупку или оформить подписку у тех разработчиков, банковский аккаунт которых находится в стране.', 'ожидание', 'https://habr.com/ru/news/866182/', '/uploads/news/1734036888239-b834038e48b05ba9601287f80b39ab26.jpg', 27, '2024-12-12 23:54:48'),
(19, 'Инициатива о регулировании видеоигр вызывает серьёзные вопросы у профессионального сообщества', 'Организация развития видеоигровой индустрии (РВИ) прокомментировала законопроект, предлагающий установить ограничения на разработку и распространение видеоигр в России. Представители индустрии выразили обеспокоенность новыми мерами, которые могут повлиять на развитие рынка и работу российских разработчиков.\r\n\r\nЭксперты РВИ отметили, что обязательная авторизация через портал «Госуслуги» или с использованием мобильного номера создаст серьёзные барьеры. Иностранные платформы, вероятнее всего, откажутся выполнять эти требования, что приведёт к блокировкам и ограничит доступ российских игроков к международным играм. Для разработчиков это может обернуться значительными финансовыми потерями и замедлением роста отрасли.', 'ожидание', 'https://habr.com/ru/news/866178/', '/uploads/news/1734037066759-0298399d155022370718793e31fc51e3.jpg', 27, '2024-12-12 23:57:46'),
(20, '🔥 ChatGPT, Sora и OpenAI API упали и недоступны по всему миру', 'ChatGPT упал: что случилось и как произошедшее может быть связано с Apple? Какие комментарии по поводу случившегося дала OpenAI?', 'ожидание', 'https://tproger.ru/news/--chatgpt--sora-i-openai-api-upali-i-nedostupny-po-vsemu-miru', '/uploads/news/1734039466930-29b0070e-1bcf-4f3f-b213-d6de95ca7d02.webp', 27, '2024-12-13 00:37:46'),
(21, 'SQLite перепишут с C на Rust. Назвали все это Limbo', 'Проект Limbo от команды Turso перепишет SQLite с языка C на Rust, чтобы повысить безопасность и производительность базы данных', 'ожидание', 'https://tproger.ru/news/sqlite-perepiwut-s-c-na-rust--nazvali-vse-eto-limbo', '/uploads/news/1734039884697-6ca70402-5edd-4c4f-92a7-3c5390b647cb.webp', 27, '2024-12-13 00:44:44'),
(22, 'Разработчик написал 25 тыс строк кода... на экране смартфона', 'Разработчик создал плагин для Neovim, написав 25 000 строк кода на смартфоне с помощью Termux. Проект уже собрал 2K звёзд на GitHub, демонстрируя, что даже в ограниченных условиях можно достичь успеха', 'ожидание', 'https://tproger.ru/news/razrabotchik-napisal-25-tys-strok-koda----na-ekrane-smartfona', '/uploads/news/1734039953633-590eaa37-3f1a-4a40-9bbf-5ce4a2c57d2a.webp', 27, '2024-12-13 00:45:53'),
(23, '🔥 ChatGPT, Sora и OpenAI API упали и недоступны по всему миру', 'ChatGPT упал: что случилось и как произошедшее может быть связано с Apple? Какие комментарии по поводу случившегося дала OpenAI?', 'ожидание', 'https://tproger.ru/news/--chatgpt--sora-i-openai-api-upali-i-nedostupny-po-vsemu-miru', '/uploads/news/1734039996153-1734039466930-29b0070e-1bcf-4f3f-b213-d6de95ca7d02.webp', 22, '2024-12-13 00:46:36');

-- --------------------------------------------------------

--
-- Структура таблицы `posts`
--

CREATE TABLE `posts` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('ожидание','принят','отклонен') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'ожидание',
  `image_url` varchar(255) DEFAULT NULL,
  `author_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `posts`
--

INSERT INTO `posts` (`id`, `title`, `description`, `status`, `image_url`, `author_id`, `created_at`) VALUES
(13, 'Развитие искусственного интеллекта в бизнесе', 'Искусственный интеллект активно меняет различные сферы бизнеса. От автоматизации процессов до предсказания трендов и персонализации предложений — AI помогает компаниям улучшать клиентский опыт и повышать эффективность работы. В этом посте мы рассматриваем, как AI уже используется в разных отраслях и какие перспективы открывает для будущего бизнеса.', 'ожидание', '/uploads/posts/1734035878409-1112.jpg', 23, '2024-12-12 23:37:58'),
(14, 'Кибербезопасность: защита данных в цифровую эпоху', 'В мире, где утечка данных и кибератаки становятся все более распространенными, кибербезопасность становится критически важным элементом любой организации. Мы поговорим о самых актуальных угрозах, методах защиты и современных подходах к обеспечению безопасности информации.', 'ожидание', '/uploads/posts/1734035979201-095f930342c37952cc0b4dff22de483e_original.187071.jpg', 23, '2024-12-12 23:39:39'),
(15, 'Технология блокчейн: как она меняет мир финансов', 'Блокчейн — это не только криптовалюты. Технология распределенного реестра имеет потенциал для революции в таких областях, как банки, медицина, логистика и даже голосование. В этом посте мы обсудим, как блокчейн работает и какие возможности открывает для разных секторов экономики.', 'ожидание', '/uploads/posts/1734036077777-i (1).webp', 23, '2024-12-12 23:41:17'),
(16, 'Будущее 5G: как изменится мир с новыми технологиями связи', 'Технология 5G обещает революцию в области мобильной связи. Быстрая скорость интернета, минимальная задержка и улучшенная связь создадут новые возможности для интернета вещей, умных городов и автономных автомобилей. В этом посте мы обсудим, как 5G повлияет на различные отрасли и какие преимущества принесет в повседневную жизнь.', 'ожидание', '/uploads/posts/1734036547215-6ExuXO07yhlAHtB8Whg6jUx_kWWS6QS1x6MCadsgnNc90w1_HX4o0rwkC8F_FtkPwAqJVIbvIXRd_zv77TCAGa1dI12IFrMFQAqBUHMoUr0MKqEQnrwM0de-ZliauSRG9A6lxo3T6HtZAVa8LmPsLsE6bPWPsj3InI42vzGh7dwMsLIoqWufnSweWfi6CGKF5Do5naKEhBgPM1eJnp1.webp', 22, '2024-12-12 23:49:07'),
(17, 'Будущее 5G: как изменится мир с новыми технологиями связи', 'Технология 5G обещает революцию в области мобильной связи. Быстрая скорость интернета, минимальная задержка и улучшенная связь создадут новые возможности для интернета вещей, умных городов и автономных автомобилей. В этом посте мы обсудим, как 5G повлияет на различные отрасли и какие преимущества принесет в повседневную жизнь.', 'ожидание', '/uploads/posts/1734036597464-6ExuXO07yhlAHtB8Whg6jUx_kWWS6QS1x6MCadsgnNc90w1_HX4o0rwkC8F_FtkPwAqJVIbvIXRd_zv77TCAGa1dI12IFrMFQAqBUHMoUr0MKqEQnrwM0de-ZliauSRG9A6lxo3T6HtZAVa8LmPsLsE6bPWPsj3InI42vzGh7dwMsLIoqWufnSweWfi6CGKF5Do5naKEhBgPM1eJnp1.webp', 25, '2024-12-12 23:49:57'),
(18, 'Разработка мобильных приложений: тренды 2024 года', 'Разработка мобильных приложений продолжает развиваться с каждым годом. В 2024 году ожидаются новые тренды, такие как улучшенная интеграция искусственного интеллекта, повышенная безопасность данных и более удобные пользовательские интерфейсы. Мы обсудим, что стоит ожидать от мобильной разработки в этом году и какие технологии будут наиболее востребованы.', 'ожидание', '/uploads/posts/1734036671008-i (2).webp', 27, '2024-12-12 23:51:11'),
(19, 'Влияние искусственного интеллекта на здравоохранение', 'Искусственный интеллект открывает новые горизонты в медицине, начиная от диагностики заболеваний до разработки индивидуализированных методов лечения. В этом посте мы рассмотрим, как AI помогает врачам принимать более точные решения, улучшать качество медицинских услуг и ускорять процессы разработки новых лекарств.', 'ожидание', '/uploads/posts/1734036714599-33p_med_1000.jpg', 23, '2024-12-12 23:51:54'),
(20, 'Облачные технологии: будущее хранения данных', ' Облачные сервисы становятся основой для хранения и обработки данных в современном мире. Они обеспечивают гибкость, масштабируемость и надежность для бизнеса и пользователей. В этом посте мы обсудим, как облачные технологии меняют подход к управлению данными, их преимущества и главные тенденции развития в ближайшие годы.', 'ожидание', '/uploads/posts/1734036804039-i (3).webp', 23, '2024-12-12 23:53:24');

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
(190, 20, '-', 'https://github.com/Denis18UKS/-', '2024-12-09 08:38:01'),
(191, 20, 'BarShik', 'https://github.com/Denis18UKS/BarShik', '2024-12-09 08:38:01'),
(192, 20, 'breadMaket', 'https://github.com/Denis18UKS/breadMaket', '2024-12-09 08:38:01'),
(193, 20, 'Concurs', 'https://github.com/Denis18UKS/Concurs', '2024-12-09 08:38:01'),
(194, 20, 'CurseForgeMyInstances', 'https://github.com/Denis18UKS/CurseForgeMyInstances', '2024-12-09 08:38:01'),
(195, 20, 'GITKonkurs2V-Penza-', 'https://github.com/Denis18UKS/GITKonkurs2V-Penza-', '2024-12-09 08:38:01'),
(196, 20, 'IP-Karpov-social', 'https://github.com/Denis18UKS/IP-Karpov-social', '2024-12-09 08:38:01'),
(197, 20, 'IP-Karpov-socialNewVersion', 'https://github.com/Denis18UKS/IP-Karpov-socialNewVersion', '2024-12-09 08:38:01'),
(198, 20, 'IT-BIRD-social', 'https://github.com/Denis18UKS/IT-BIRD-social', '2024-12-09 08:38:01'),
(199, 20, 'karpov-diplom-project', 'https://github.com/Denis18UKS/karpov-diplom-project', '2024-12-09 08:38:01'),
(200, 20, 'Karpov-Laravel-test', 'https://github.com/Denis18UKS/Karpov-Laravel-test', '2024-12-09 08:38:01'),
(201, 20, 'Kulinar', 'https://github.com/Denis18UKS/Kulinar', '2024-12-09 08:38:01'),
(202, 20, 'kursach', 'https://github.com/Denis18UKS/kursach', '2024-12-09 08:38:01'),
(203, 20, 'LaratestKarpovKarpov', 'https://github.com/Denis18UKS/LaratestKarpovKarpov', '2024-12-09 08:38:01'),
(204, 20, 'Laravel-Test', 'https://github.com/Denis18UKS/Laravel-Test', '2024-12-09 08:38:01'),
(205, 20, 'mdk0502', 'https://github.com/Denis18UKS/mdk0502', '2024-12-09 08:38:01'),
(206, 20, 'MyWorks', 'https://github.com/Denis18UKS/MyWorks', '2024-12-09 08:38:01'),
(207, 20, 'national-day', 'https://github.com/Denis18UKS/national-day', '2024-12-09 08:38:01'),
(208, 20, 'newrepos', 'https://github.com/Denis18UKS/newrepos', '2024-12-09 08:38:01'),
(209, 20, 'NewVersIP-Karpov-social', 'https://github.com/Denis18UKS/NewVersIP-Karpov-social', '2024-12-09 08:38:01'),
(210, 20, 'oz-avaise', 'https://github.com/Denis18UKS/oz-avaise', '2024-12-09 08:38:01'),
(211, 20, 'pinguins', 'https://github.com/Denis18UKS/pinguins', '2024-12-09 08:38:01'),
(212, 20, 'pl_hesablama', 'https://github.com/Denis18UKS/pl_hesablama', '2024-12-09 08:38:01'),
(213, 20, 'prj-management', 'https://github.com/Denis18UKS/prj-management', '2024-12-09 08:38:01'),
(214, 20, 'prj-management-Karpov', 'https://github.com/Denis18UKS/prj-management-Karpov', '2024-12-09 08:38:01'),
(215, 20, 'prj-managements', 'https://github.com/Denis18UKS/prj-managements', '2024-12-09 08:38:01'),
(216, 20, 'prj-managementssss', 'https://github.com/Denis18UKS/prj-managementssss', '2024-12-09 08:38:01'),
(217, 20, 'project-manager', 'https://github.com/Denis18UKS/project-manager', '2024-12-09 08:38:01'),
(218, 20, 'Screen_Build', 'https://github.com/Denis18UKS/Screen_Build', '2024-12-09 08:38:01'),
(219, 20, 'Teacher', 'https://github.com/Denis18UKS/Teacher', '2024-12-09 08:38:01'),
(230, 22, 'API', 'https://github.com/Natalua9/API', '2024-12-09 08:38:52'),
(231, 22, 'BarShik', 'https://github.com/Natalua9/BarShik', '2024-12-09 08:38:52'),
(232, 22, 'DanseStydio', 'https://github.com/Natalua9/DanseStydio', '2024-12-09 08:38:52'),
(233, 22, 'kyrsovay', 'https://github.com/Natalua9/kyrsovay', '2024-12-09 08:38:52'),
(234, 22, 'laravelDemo', 'https://github.com/Natalua9/laravelDemo', '2024-12-09 08:38:52'),
(235, 22, 'Pinguins1', 'https://github.com/Natalua9/Pinguins1', '2024-12-09 08:38:52'),
(236, 22, 'proect_manager', 'https://github.com/Natalua9/proect_manager', '2024-12-09 08:38:52'),
(237, 22, 'test21', 'https://github.com/Natalua9/test21', '2024-12-09 08:38:52'),
(238, 22, 'todolist', 'https://github.com/Natalua9/todolist', '2024-12-09 08:38:52'),
(239, 23, 'fixdiscord', 'https://github.com/AikenOZ/fixdiscord', '2024-12-09 08:39:31'),
(240, 23, 'hakaton_turbo', 'https://github.com/AikenOZ/hakaton_turbo', '2024-12-09 08:39:31'),
(241, 23, 'OZlamclnr', 'https://github.com/AikenOZ/OZlamclnr', '2024-12-09 08:39:31'),
(258, 25, 'barshik', 'https://github.com/Stussy147/barshik', '2024-12-12 16:42:33'),
(259, 25, 'course-paper', 'https://github.com/Stussy147/course-paper', '2024-12-12 16:42:33'),
(260, 25, 'fruitcakeBack', 'https://github.com/Stussy147/fruitcakeBack', '2024-12-12 16:42:33'),
(261, 25, 'golang_tested', 'https://github.com/Stussy147/golang_tested', '2024-12-12 16:42:33'),
(262, 25, 'Penguins', 'https://github.com/Stussy147/Penguins', '2024-12-12 16:42:33'),
(263, 25, 'Test', 'https://github.com/Stussy147/Test', '2024-12-12 16:42:33'),
(264, 25, 'test-laravel', 'https://github.com/Stussy147/test-laravel', '2024-12-12 16:42:33'),
(265, 25, 'test1', 'https://github.com/Stussy147/test1', '2024-12-12 16:42:33'),
(266, 25, 'Test2', 'https://github.com/Stussy147/Test2', '2024-12-12 16:42:33'),
(267, 26, '-3java', 'https://github.com/Lizadmi/-3java', '2024-12-12 16:43:38'),
(268, 26, '-_-', 'https://github.com/Lizadmi/-_-', '2024-12-12 16:43:38'),
(269, 26, 'canvas', 'https://github.com/Lizadmi/canvas', '2024-12-12 16:43:38'),
(270, 26, 'cpc1', 'https://github.com/Lizadmi/cpc1', '2024-12-12 16:43:38'),
(271, 26, 'cpc4JAVA_cpc5JAVA', 'https://github.com/Lizadmi/cpc4JAVA_cpc5JAVA', '2024-12-12 16:43:38'),
(272, 26, 'game', 'https://github.com/Lizadmi/game', '2024-12-12 16:43:38'),
(273, 26, 'game_finish', 'https://github.com/Lizadmi/game_finish', '2024-12-12 16:43:38'),
(274, 26, 'kursach', 'https://github.com/Lizadmi/kursach', '2024-12-12 16:43:38'),
(275, 26, 'kursovoy-15', 'https://github.com/Lizadmi/kursovoy-15', '2024-12-12 16:43:38'),
(276, 26, 'laba1', 'https://github.com/Lizadmi/laba1', '2024-12-12 16:43:38'),
(277, 26, 'laba1Alina', 'https://github.com/Lizadmi/laba1Alina', '2024-12-12 16:43:38'),
(278, 26, 'laba2', 'https://github.com/Lizadmi/laba2', '2024-12-12 16:43:38'),
(279, 26, 'laba2Alina', 'https://github.com/Lizadmi/laba2Alina', '2024-12-12 16:43:38'),
(280, 26, 'laba3', 'https://github.com/Lizadmi/laba3', '2024-12-12 16:43:38'),
(281, 26, 'laba3Alina', 'https://github.com/Lizadmi/laba3Alina', '2024-12-12 16:43:38'),
(282, 26, 'lesson', 'https://github.com/Lizadmi/lesson', '2024-12-12 16:43:38'),
(283, 26, 'lesson2', 'https://github.com/Lizadmi/lesson2', '2024-12-12 16:43:38'),
(284, 26, 'mysite', 'https://github.com/Lizadmi/mysite', '2024-12-12 16:43:38'),
(285, 26, 'php', 'https://github.com/Lizadmi/php', '2024-12-12 16:43:38'),
(286, 26, 'task4', 'https://github.com/Lizadmi/task4', '2024-12-12 16:43:38'),
(287, 26, 'telegramBotTest', 'https://github.com/Lizadmi/telegramBotTest', '2024-12-12 16:43:38'),
(288, 26, 'test21', 'https://github.com/Lizadmi/test21', '2024-12-12 16:43:38'),
(289, 26, 'testBot', 'https://github.com/Lizadmi/testBot', '2024-12-12 16:43:38'),
(290, 26, 'testgit', 'https://github.com/Lizadmi/testgit', '2024-12-12 16:43:38'),
(291, 26, 'test_git', 'https://github.com/Lizadmi/test_git', '2024-12-12 16:43:38'),
(292, 26, 'trueskilllslanding', 'https://github.com/Lizadmi/trueskilllslanding', '2024-12-12 16:43:38'),
(293, 26, 'trueskillsWP', 'https://github.com/Lizadmi/trueskillsWP', '2024-12-12 16:43:38'),
(294, 26, 'uniti_lr_1', 'https://github.com/Lizadmi/uniti_lr_1', '2024-12-12 16:43:38'),
(295, 26, 'uniti_lr_2', 'https://github.com/Lizadmi/uniti_lr_2', '2024-12-12 16:43:38'),
(296, 26, 'uniti_lr_3', 'https://github.com/Lizadmi/uniti_lr_3', '2024-12-12 16:43:38'),
(297, 27, '-', 'https://github.com/Denis18UKS/-', '2024-12-12 16:56:19'),
(298, 27, 'BarShik', 'https://github.com/Denis18UKS/BarShik', '2024-12-12 16:56:19'),
(299, 27, 'bashopera-Karpov', 'https://github.com/Denis18UKS/bashopera-Karpov', '2024-12-12 16:56:19'),
(300, 27, 'breadMaket', 'https://github.com/Denis18UKS/breadMaket', '2024-12-12 16:56:19'),
(301, 27, 'Concurs', 'https://github.com/Denis18UKS/Concurs', '2024-12-12 16:56:19'),
(302, 27, 'CurseForgeMyInstances', 'https://github.com/Denis18UKS/CurseForgeMyInstances', '2024-12-12 16:56:19'),
(303, 27, 'GITKonkurs2V-Penza-', 'https://github.com/Denis18UKS/GITKonkurs2V-Penza-', '2024-12-12 16:56:19'),
(304, 27, 'IP-Karpov-social', 'https://github.com/Denis18UKS/IP-Karpov-social', '2024-12-12 16:56:19'),
(305, 27, 'IP-Karpov-socialNewVersion', 'https://github.com/Denis18UKS/IP-Karpov-socialNewVersion', '2024-12-12 16:56:19'),
(306, 27, 'IT-BIRD-social', 'https://github.com/Denis18UKS/IT-BIRD-social', '2024-12-12 16:56:19'),
(307, 27, 'karpov-diplom-project', 'https://github.com/Denis18UKS/karpov-diplom-project', '2024-12-12 16:56:19'),
(308, 27, 'Karpov-Laravel-test', 'https://github.com/Denis18UKS/Karpov-Laravel-test', '2024-12-12 16:56:19'),
(309, 27, 'Kulinar', 'https://github.com/Denis18UKS/Kulinar', '2024-12-12 16:56:19'),
(310, 27, 'kursach', 'https://github.com/Denis18UKS/kursach', '2024-12-12 16:56:19'),
(311, 27, 'LaratestKarpovKarpov', 'https://github.com/Denis18UKS/LaratestKarpovKarpov', '2024-12-12 16:56:19'),
(312, 27, 'Laravel-Test', 'https://github.com/Denis18UKS/Laravel-Test', '2024-12-12 16:56:19'),
(313, 27, 'mdk0502', 'https://github.com/Denis18UKS/mdk0502', '2024-12-12 16:56:19'),
(314, 27, 'MyWorks', 'https://github.com/Denis18UKS/MyWorks', '2024-12-12 16:56:19'),
(315, 27, 'national-day', 'https://github.com/Denis18UKS/national-day', '2024-12-12 16:56:19'),
(316, 27, 'newrepos', 'https://github.com/Denis18UKS/newrepos', '2024-12-12 16:56:19'),
(317, 27, 'NewVersIP-Karpov-social', 'https://github.com/Denis18UKS/NewVersIP-Karpov-social', '2024-12-12 16:56:19'),
(318, 27, 'oz-avaise', 'https://github.com/Denis18UKS/oz-avaise', '2024-12-12 16:56:19'),
(319, 27, 'pinguins', 'https://github.com/Denis18UKS/pinguins', '2024-12-12 16:56:19'),
(320, 27, 'pl_hesablama', 'https://github.com/Denis18UKS/pl_hesablama', '2024-12-12 16:56:19'),
(321, 27, 'prj-management', 'https://github.com/Denis18UKS/prj-management', '2024-12-12 16:56:19'),
(322, 27, 'prj-management-Karpov', 'https://github.com/Denis18UKS/prj-management-Karpov', '2024-12-12 16:56:19'),
(323, 27, 'prj-managements', 'https://github.com/Denis18UKS/prj-managements', '2024-12-12 16:56:19'),
(324, 27, 'prj-managementssss', 'https://github.com/Denis18UKS/prj-managementssss', '2024-12-12 16:56:19'),
(325, 27, 'project-manager', 'https://github.com/Denis18UKS/project-manager', '2024-12-12 16:56:19'),
(326, 27, 'Screen_Build', 'https://github.com/Denis18UKS/Screen_Build', '2024-12-12 16:56:19'),
(327, 24, '1', 'https://github.com/Viacheslav2005/1', '2024-12-12 22:07:12'),
(328, 24, '2', 'https://github.com/Viacheslav2005/2', '2024-12-12 22:07:12'),
(329, 24, 'BarShik', 'https://github.com/Viacheslav2005/BarShik', '2024-12-12 22:07:12'),
(330, 24, 'Course-paper', 'https://github.com/Viacheslav2005/Course-paper', '2024-12-12 22:07:12'),
(331, 24, 'Individual-project', 'https://github.com/Viacheslav2005/Individual-project', '2024-12-12 22:07:12'),
(332, 24, 'Individual-project-code', 'https://github.com/Viacheslav2005/Individual-project-code', '2024-12-12 22:07:12'),
(333, 24, 'Laba1', 'https://github.com/Viacheslav2005/Laba1', '2024-12-12 22:07:12'),
(334, 24, 'Laba1EGE', 'https://github.com/Viacheslav2005/Laba1EGE', '2024-12-12 22:07:12'),
(335, 24, 'Laravel', 'https://github.com/Viacheslav2005/Laravel', '2024-12-12 22:07:12'),
(336, 24, 'Penguins', 'https://github.com/Viacheslav2005/Penguins', '2024-12-12 22:07:12'),
(337, 24, 'project-manager-front', 'https://github.com/Viacheslav2005/project-manager-front', '2024-12-12 22:07:12'),
(338, 24, 'Test', 'https://github.com/Viacheslav2005/Test', '2024-12-12 22:07:12'),
(339, 24, 'test1', 'https://github.com/Viacheslav2005/test1', '2024-12-12 22:07:12'),
(340, 24, 'Todo_list', 'https://github.com/Viacheslav2005/Todo_list', '2024-12-12 22:07:12'),
(341, 24, 'Vkusnashka', 'https://github.com/Viacheslav2005/Vkusnashka', '2024-12-12 22:07:12'),
(342, 24, 'Weather', 'https://github.com/Viacheslav2005/Weather', '2024-12-12 22:07:12'),
(343, 21, '-', 'https://github.com/Molin1987/-', '2024-12-12 22:12:00'),
(344, 21, 'BARSHIK', 'https://github.com/Molin1987/BARSHIK', '2024-12-12 22:12:00'),
(345, 21, 'demoLaravel', 'https://github.com/Molin1987/demoLaravel', '2024-12-12 22:12:00'),
(346, 21, 'Kursovaya', 'https://github.com/Molin1987/Kursovaya', '2024-12-12 22:12:00'),
(347, 21, 'lab1', 'https://github.com/Molin1987/lab1', '2024-12-12 22:12:00'),
(348, 21, 'Project-manager', 'https://github.com/Molin1987/Project-manager', '2024-12-12 22:12:00'),
(349, 21, 'Scooter24', 'https://github.com/Molin1987/Scooter24', '2024-12-12 22:12:00'),
(350, 21, 'test', 'https://github.com/Molin1987/test', '2024-12-12 22:12:00'),
(351, 21, 'ToDo', 'https://github.com/Molin1987/ToDo', '2024-12-12 22:12:00'),
(352, 21, 'Videohosting', 'https://github.com/Molin1987/Videohosting', '2024-12-12 22:12:00');

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
  `isBlocked` enum('активен','заблокирован') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'активен'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `github_username`, `role`, `created_at`, `updated_at`, `avatar`, `skills`, `isBlocked`) VALUES
(19, 'admin', 'admin@mail.ru', '$2b$10$hmLmKyXtksbnqV8igkuCRetUaVeAJq65kz/.WW5hHPnM7YBCRNIlK', NULL, 'admin', '2024-12-09 11:37:12', '2024-12-09 11:40:08', NULL, NULL, 'активен'),
(20, 'Tester', 'honorxpremium75@gmail.com', '$2b$10$SBrOuQtFpng2q3/.KVZ31uYArU3YeNhBWvRecb8y1u5F0Wny/GqUq', NULL, 'user', '2024-12-09 11:38:00', '2024-12-12 20:06:48', NULL, NULL, 'заблокирован'),
(21, 'Марат', 'marat@mail.ru', '$2b$10$bbWg6JB4d2aMDUtfx5uFsek.MXr16h9FWWO04EcZk9cTIAHt/RBBi', 'Molin1987', 'user', '2024-12-09 11:38:23', '2024-12-12 20:00:23', NULL, NULL, 'заблокирован'),
(22, 'Наталья', 'nat@mail.ru', '$2b$10$FOqGYNc7BZfi01CEKZAoae/YTaeIh5pPSHzhwwmLBBzF7gR3v9qDS', 'Natalua9', 'user', '2024-12-09 11:38:51', '2024-12-12 20:10:01', '/uploads/1734034201220-s4mnDH4OCgA (1).jpg', 'HTML, CSS, JavaScript, Laravel, REST API, PHP\r\nВёрстка сайта, Вёрстка по макету, Создание макетов в Figma, mySQL-phpMyAdmin', 'активен'),
(23, 'Влад', 'vladOZ@mail.ru', '$2b$10$K4h1Ho2EQU9JYkhtuItBD.A.sitCOXE0RFs0LTar7g7O6cUDSVwTu', 'AikenOZ', 'user', '2024-12-09 11:39:30', '2024-12-12 20:11:36', '/uploads/1734034296788-photo_3131942461106137027_c.jpg', 'Python, Создание Телеграмм-Ботов, Создание ИИ', 'активен'),
(24, 'Слава', 'slava@mail.ru', '$2b$10$ORaZ2ZN9x82iZFD3KaTq.u.NVYuzjnbr8QHPdS4WaDLiupv1P/UBO', 'Viacheslav2005', 'user', '2024-12-09 11:40:36', '2024-12-09 17:06:24', NULL, NULL, 'заблокирован'),
(25, 'Динар', 'dinar@mail.ru', '$2b$10$aFXM6ZuEy3D0ZobnTIVTQuKcJ0mhKFM0SPkBDnBCtaULTYzcDjy1.', 'Stussy147', 'user', '2024-12-12 19:42:32', '2024-12-12 20:07:44', '/uploads/1734034064652-photo_5249094143823696018_c.jpg', 'html, css, javascript', 'активен'),
(26, 'Дмитриева Елизавета Константиновна', 'lizadmi@mail.ru', '$2b$10$VXZPS5UodOJqRLLU6omwbeB3kNbgJvUsMRFx7WhCTBfI5TDydY/ma', 'Lizadmi', 'user', '2024-12-12 19:43:36', '2024-12-12 20:06:12', '/uploads/1734033972860-photo_5253862734343297868_c.jpg', 'Laravel, PHP, REST API, AJAX, mySQL', 'активен'),
(27, 'Денис', 'lakos208@gmail.com', '$2b$10$wPqkgFkImMawjXYBgzr.f.D43s7T7jMRBGXyEwVwNu4nQdaKhYxIG', 'Denis18UKS', 'user', '2024-12-13 19:56:18', '2024-12-12 20:04:43', '/uploads/1734033852941-photo_5426996349263535433_c.jpg', 'React, JavaScript, HTML, CSS, AJAX, REST API\r\nPHP, Вёрстка по макету, mySQL-phpMyAdmin', 'активен');

--
-- Индексы сохранённых таблиц
--

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
-- Индексы таблицы `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_id` (`chat_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Индексы таблицы `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

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
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT для таблицы `forums`
--
ALTER TABLE `forums`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `forum_answers`
--
ALTER TABLE `forum_answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=716;

--
-- AUTO_INCREMENT для таблицы `news`
--
ALTER TABLE `news`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT для таблицы `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `repositories`
--
ALTER TABLE `repositories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=353;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

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
-- Ограничения внешнего ключа таблицы `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `repositories`
--
ALTER TABLE `repositories`
  ADD CONSTRAINT `repositories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
