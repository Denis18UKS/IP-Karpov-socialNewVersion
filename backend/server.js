const express = require("express");
const mysql = require("mysql2/promise"); // Используем промис-совместимую версию
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const app = express();
const githubRoutes = require('./routes/github');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Добавляем модуль для работы с файловой системой

app.use('/uploads/avatars/', express.static(path.join(__dirname, 'uploads')));
app.use('/github', githubRoutes);

// Логирование запросов
app.use((err, req, res, next) => {
    console.log(`Request URL: ${req.url}`);  // Логируем путь запроса
    next();
    console.error(err.stack);
    res.status(500).json({ message: 'Ошибка сервера' });
});

// Разрешаем CORS для всех доменов
app.use(cors({
    origin: '*',  // Разрешаем доступ с любых источников
    optionsSuccessStatus: 200,  // Для старых браузеров
    methods: 'GET,POST,PUT,DELETE',  // Разрешенные методы
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Разрешенные заголовки
}));

app.use(express.json()); // Для обработки JSON-запросов

// Подключение к базе данных с использованием промисов
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Вспомогательная функция для генерации токена
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// Middleware для проверки токена
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Нет авторизации, токен не предоставлен' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Неверный токен:', err);
        return res.status(401).json({ message: 'Неверный токен или токен истек' });
    }
};

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Регистрация пользователя
app.post('/register', async (req, res) => {
    const { username, email, password, github_username } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Поля username, email и password обязательны!' });
    }

    try {
        // Проверка на существующего пользователя с таким email
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует!' });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Вставка нового пользователя в базу данных
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, github_username) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, github_username || null]
        );

        // Получаем репозитории с GitHub, если github_username передан
        let repositories = [];
        if (github_username) {
            repositories = await fetchRepositories(github_username); // Получаем репозитории с GitHub
        }

        // Сохраняем репозитории в базу данных
        const lastSynced = new Date().toISOString().slice(0, 19).replace('T', ' ');

        for (const repo of repositories) {
            console.log('Сохраняем репозиторий:', repo);  // Логирование каждого репозитория
            await db.query(
                'INSERT INTO repositories (user_id, repo_name, repo_url, last_synced) VALUES (?, ?, ?, ?)',
                [result.insertId, repo.name, repo.html_url, lastSynced]
            );
        }



        // Генерация JWT токена
        const token = generateToken({ id: result.insertId, username, email });

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован!', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при регистрации' });
    }
});

// Функция для получения репозиториев с GitHub
const fetchRepositories = async (githubUsername) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);
        console.log("GitHub Repositories:", response.data);  // Логируем полученные репозитории
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении репозиториев с GitHub:', error.message);
        return [];
    }
};



// Авторизация пользователя
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Поля email и password обязательны!' });
    }

    try {
        // Поиск пользователя по email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Пользователь не найден!' });
        }

        // Проверка пароля
        const validPassword = await bcrypt.compare(password, users[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Неверный пароль!' });
        }

        // Проверяем, есть ли репозитории в базе данных
        const [repos] = await db.query('SELECT * FROM repositories WHERE user_id = ?', [users[0].id]);

        // Если репозиториев нет, загружаем их с GitHub и сохраняем
        if (repos.length === 0 && users[0].github_username) {
            const repositories = await fetchRepositories(users[0].github_username);

            const lastSynced = new Date().toISOString().slice(0, 19).replace('T', ' ');

            for (const repo of repositories) {
                console.log('Сохраняем репозиторий при авторизации:', repo);  // Логирование каждого репозитория
                await db.query(
                    'INSERT INTO repositories (user_id, repo_name, repo_url, last_synced) VALUES (?, ?, ?, ?)',
                    [users[0].id, repo.name, repo.html_url, lastSynced]
                );
            }
        }


        // Генерация JWT
        const token = generateToken({ id: users[0].id, email: users[0].email, username: users[0].username });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка на сервере' });
    }
});


// Маршрут для получения профиля текущего пользователя
app.get('/profile', verifyToken, async (req, res) => {
    const { id } = req.user;

    try {
        const [user] = await db.query(
            'SELECT id, username, email, github_username, avatar, skills FROM users WHERE id = ?',
            [id]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const profile = user[0];
        let repositories = [];

        if (profile.github_username) {
            try {
                const { data } = await axios.get(
                    `https://api.github.com/users/${profile.github_username}/repos`,
                    {
                        headers: {
                            Authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
                        },
                    }
                );

                repositories = data.map(repo => ({
                    name: repo.name,
                    commits: repo.size, // Размер в GitHub API можно использовать как количество коммитов
                }));
            } catch (githubError) {
                console.error('Ошибка при получении репозиториев GitHub:', githubError.message);
            }
        }

        res.status(200).json({ user: profile, repositories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при получении профиля' });
    }
});

// Обновление профиля пользователя
app.put('/profile/update', verifyToken, upload.single('avatar'), async (req, res) => {
    const { id } = req.user;
    const { username, github_username, skills, email } = req.body;
    const avatar = req.file ? `/uploads/avatars/${req.file.filename}` : null;

    try {
        if (github_username !== undefined) {
            const [existingUser] = await db.query(
                'SELECT id FROM users WHERE github_username = ? AND id != ?',
                [github_username, id]
            );
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Этот GitHub username уже используется другим пользователем' });
            }
        }

        const updateFields = [];
        const values = [];

        if (username) updateFields.push('username = ?'), values.push(username);
        if (github_username !== undefined) updateFields.push('github_username = ?'), values.push(github_username.trim() === '' ? null : github_username);
        if (skills) updateFields.push('skills = ?'), values.push(skills);
        if (email) updateFields.push('email = ?'), values.push(email);
        if (avatar) updateFields.push('avatar = ?'), values.push(avatar);

        values.push(id);

        if (updateFields.length > 0) {
            await db.query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, values);
        }

        res.status(200).json({ message: 'Профиль успешно обновлен' });
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Удаление аватара пользователя
app.delete('/profile/avatar', verifyToken, async (req, res) => {
    const { id } = req.user;

    try {
        // Получаем текущего пользователя
        const [user] = await db.query('SELECT avatar FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const avatarPath = user[0].avatar ? path.join(__dirname, user[0].avatar) : null;

        if (avatarPath && fs.existsSync(avatarPath)) {
            // Удаляем файл аватара
            fs.unlinkSync(avatarPath);
        }

        // Обновляем запись в базе данных
        await db.query('UPDATE users SET avatar = NULL WHERE id = ?', [id]);

        res.status(200).json({ message: 'Аватар удален успешно' });
    } catch (error) {
        console.error('Ошибка при удалении аватара:', error);
        res.status(500).json({ message: 'Ошибка при удалении аватара' });
    }
});

// Маршрут для получения профиля другого пользователя
app.get('/users/:username', async (req, res) => {
    const { username } = req.params;
    const decodedUsername = decodeURIComponent(username); // Декодируем имя пользователя

    try {
        // Находим пользователя в базе данных
        const [user] = await db.query(
            'SELECT id, username, email, github_username, avatar, skills FROM users WHERE username = ?',
            [decodedUsername]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const profile = user[0];
        let repositories = [];

        // Загружаем репозитории с GitHub
        if (profile.github_username) {
            try {
                const { data } = await axios.get(
                    `https://api.github.com/users/${profile.github_username}/repos`,
                    {
                        headers: {
                            Authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
                        },
                    }
                );

                repositories = data.map(repo => ({
                    name: repo.name,
                    commits: repo.size, // Размер в GitHub API можно использовать как количество коммитов
                }));
            } catch (githubError) {
                console.error('Ошибка при получении репозиториев GitHub:', githubError.message);
            }
        }

        res.status(200).json({ user: profile, repositories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при получении профиля' });
    }
});


// Защищенный маршрут для получения списка пользователей
app.get('/users', verifyToken, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, email, github_username, avatar, skills FROM users');
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при получении пользователей' });
    }
});

app.get('/chats', verifyToken, async (req, res) => {
    const { id } = req.user;
    try {
        const [chats] = await db.query(
            `SELECT c.id, u1.username AS user1, u2.username AS user2, c.created_at
            FROM chats c
            JOIN users u1 ON c.user_id_1 = u1.id
            JOIN users u2 ON c.user_id_2 = u2.id
            WHERE c.user_id_1 = ? OR c.user_id_2 = ?`,
            [id, id]
        );
        res.json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при получении чатов' });
    }
});


app.post('/messages', verifyToken, async (req, res) => {
    const { chatId, message } = req.body;
    const { id: userId } = req.user;

    if (!message || !chatId) {
        return res.status(400).json({ message: 'Чат и сообщение обязательны' });
    }

    try {
        // Сохранение сообщения в базе данных
        await db.query(
            'INSERT INTO messages (chat_id, user_id, message) VALUES (?, ?, ?)',
            [chatId, userId, message]
        );
        res.status(201).json({ message: 'Сообщение отправлено' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при отправке сообщения' });
    }
});

app.get('/messages/:chatId', verifyToken, async (req, res) => {
    const { chatId } = req.params;
    try {
        const [messages] = await db.query(
            'SELECT m.*, u.username FROM messages m JOIN users u ON m.user_id = u.id WHERE m.chat_id = ? ORDER BY m.created_at',
            [chatId]
        );
        console.log(messages); // Логирование сообщений
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при получении сообщений' });
    }
});



app.post('/chats', verifyToken, async (req, res) => {
    const { userId2 } = req.body; // ID другого пользователя
    const { id: userId1 } = req.user;

    try {
        // Проверяем, существует ли чат
        const [existingChat] = await db.query(
            'SELECT * FROM chats WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)',
            [userId1, userId2, userId2, userId1]
        );

        if (existingChat.length > 0) {
            return res.status(200).json(existingChat[0]); // Возвращаем существующий чат
        }

        // Если нет, создаём новый
        const [result] = await db.query(
            'INSERT INTO chats (user_id_1, user_id_2) VALUES (?, ?)',
            [userId1, userId2]
        );

        res.status(201).json({ id: result.insertId, user_id_1: userId1, user_id_2: userId2 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при создании чата' });
    }
});

// Эндпоинт для получения репозиториев
// Эндпоинт для получения репозиториев
app.get('/repositories/:github_username', verifyToken, async (req, res) => {
    const { github_username } = req.params;

    try {
        // Сначала проверим, есть ли уже данные о репозиториях для этого пользователя в базе данных
        const [existingRepos] = await db.query(
            'SELECT * FROM repositories WHERE user_id = (SELECT id FROM users WHERE github_username = ?) ORDER BY last_synced DESC LIMIT 1',
            [github_username]
        );

        // Если данные о репозиториях существуют и они были синхронизированы недавно (например, в последние 24 часа)
        if (existingRepos.length > 0) {
            const lastSynced = new Date(existingRepos[0].last_synced);
            const hoursSinceLastSync = (new Date() - lastSynced) / (1000 * 60 * 60);

            if (hoursSinceLastSync < 24) {
                // Если данные актуальны (менее 24 часов с последнего запроса), возвращаем их
                return res.json(existingRepos.map(repo => ({
                    repo_name: repo.repo_name,
                    repo_url: repo.repo_url,
                    last_synced: repo.last_synced
                })));
            }
        }

        // Если данных нет или они устарели, делаем запрос к GitHub API
        const { data } = await axios.get(`https://api.github.com/users/${github_username}/repos`);

        // Извлекаем данные из GitHub
        const repoData = data.map(repo => ({
            repo_name: repo.name,
            repo_url: repo.html_url,
            last_synced: new Date()
        }));

        // Удаляем старые записи
        await db.query('DELETE FROM repositories WHERE user_id = (SELECT id FROM users WHERE github_username = ?)', [github_username]);

        // Сохраняем новые репозитории в базу данных
        for (const repo of repoData) {
            await db.query(
                'INSERT INTO repositories (user_id, repo_name, repo_url, last_synced) VALUES ((SELECT id FROM users WHERE github_username = ?), ?, ?, ?)',
                [github_username, repo.repo_name, repo.repo_url, repo.last_synced]
            );
        }

        // Возвращаем данные
        res.status(200).json(repoData);

    } catch (error) {
        console.error('Ошибка при получении репозиториев:', error);
        res.status(500).json({ message: 'Ошибка при получении репозиториев' });
    }
});


// Старт сервера
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
