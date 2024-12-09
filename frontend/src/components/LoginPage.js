import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Для редиректа после авторизации
import './css-v2/LoginPage.css'; // Импортируем CSS файл

const LoginPage = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showBlockedAlert, setShowBlockedAlert] = useState(false); // Состояние для отображения alert
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Состояние для отображения success alert
    const [timer, setTimer] = useState(5); // Таймер на 5 секунд
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Сохраняем токен, userId и роль в localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('role', data.user.role);

                // Показываем alert с успехом
                setShowSuccessAlert(true);

                // Начинаем отсчет времени для редиректа
                const countdown = setInterval(() => {
                    setTimer((prevTimer) => {
                        if (prevTimer === 1) {
                            clearInterval(countdown); // Останавливаем таймер
                            setIsAuthenticated(true); // Устанавливаем аутентификацию
                            if (data.user.role === 'admin') {
                                navigate('/admin/users');
                            } else {
                                navigate('/profile');
                            }
                        }
                        return prevTimer - 1; // Уменьшаем время
                    });
                }, 1000); // Обновляем каждую секунду
            } else {
                if (data.message === 'Ваш аккаунт заблокирован!') {
                    setShowBlockedAlert(true); // Показываем кастомный alert
                } else {
                    setErrorMessage(data.message); // Устанавливаем ошибку из ответа сервера
                }
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Ошибка при отправке данных на сервер.');
        }
    };

    // Закрытие alert и редирект на VK
    const handleAlertClose = () => {
        setShowBlockedAlert(false);
    };

    // Редирект на страницу техподдержки
    const handleContactSupport = () => {
        window.location.href = "https://vk.com/dkarpov2003"; // Перенаправляем на VK
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

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Отображаем сообщение об ошибке */}
            </section>

            {/* Кастомный alert для заблокированных пользователей */}
            {showBlockedAlert && (
                <div className="blocked-alert">
                    <div className="alert-content">
                        <h2>Ваш аккаунт заблокирован</h2>
                        <p>Обратитесь в техподдержку для решения проблемы.</p>
                        <button onClick={handleContactSupport}>Обратиться</button> {/* Кнопка для обращения в техподдержку */}
                        <button onClick={handleAlertClose}>Закрыть</button> {/* Кнопка для закрытия alert */}
                    </div>
                </div>
            )}

            {/* Кастомный alert для успешного входа */}
            {showSuccessAlert && (
                <div className="blocked-alert">
                    <div className="alert-content">
                        <h2>Вход успешен</h2>
                        <p>Через {timer} секунд вас перенаправит в ваш профиль.</p>
                    </div>
                </div>
            )}
        </main>
    );
};

export default LoginPage;
