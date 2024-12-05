import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Для редиректа после авторизации
import './css-v2/LoginPage.css'; // Импортируем CSS файл

const LoginPage = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Для редиректа на главную страницу или панель пользователя после авторизации

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // Сохраняем токен, userId и роль в localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('role', data.user.role);

                setIsAuthenticated(true);
                navigate('/profile');
            } else {
                setErrorMessage(data.message);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Ошибка при отправке данных на сервер.');
        }
    };


    return (
        <main>
            <h1>Вход</h1>
            <section>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Почта:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Войти</button>
                </form>

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Вывод ошибки, если есть */}
            </section>
        </main>
    );
};

export default LoginPage;
