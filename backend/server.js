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
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);  // Логируем путь запроса
    next();
});

// Разрешаем CORS для всех доменов
app.use(cors({
    origin: '*',  // Разрешаем доступ с любых источников
    optionsSuccessStatus: 200,  // Для старых браузеров
    methods: 'GET,POST,PUT,DELETE',  // Разрешенные методы
    allowedHeaders: 'Content-Type,Authorization', // Разрешенные заголовки
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

        const token = generateToken({ id: result.insertId, username, email });

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован!', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при регистрации' });
    }
});

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

// Старт сервера
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
