import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Импортируем useNavigate для редиректа
import './css-v2/RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gitHubUsername, setGitHubUsername] = useState('');  // Для GitHub Username
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // Для управления модальным окном

    const navigate = useNavigate();  // Для редиректа после успешной регистрации

    const handleRegister = async (e) => {
        e.preventDefault();
        
        try {
            // Регистрация пользователя
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    github_username: gitHubUsername || null,  // Если поле пустое, отправляем null
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message); // Успех
                setShowModal(true); // Показываем модальное окно
                setTimeout(() => {
                    setShowModal(false); // Закрываем модальное окно через 3 секунды
                    navigate('/login'); // Перенаправляем на страницу авторизации
                }, 3000); // 3 секунды для показа модалки
                
                // Запрашиваем репозитории после регистрации
                if (gitHubUsername) {
                    await fetchAndSaveRepositories(gitHubUsername); // Функция для получения репозиториев
                }
            } else {
                setMessage(data.message); // Ошибка
            }
        } catch (err) {
            console.error(err);
            setMessage('Ошибка при отправке данных на сервер.');
        }
    };

    // Функция для получения и сохранения репозиториев
    const fetchAndSaveRepositories = async (githubUsername) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Токен не найден, авторизация требуется.");
                return;
            }

            // Запрос репозиториев по GitHub имени
            const response = await fetch(`http://localhost:5000/repositories/${githubUsername}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                console.error("Ошибка при получении репозиториев:", data.message);
                return;
            }

            const repositories = await response.json();
            
            // Сохраняем репозитории в базе данных
            const saveResponse = await fetch('http://localhost:5000/repositories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    githubUsername,
                    repositories,
                }),
            });

            if (!saveResponse.ok) {
                const data = await saveResponse.json();
                console.error("Ошибка при сохранении репозиториев:", data.message);
            } else {
                console.log("Репозитории успешно сохранены.");
            }

        } catch (error) {
            console.error("Ошибка при запросе или сохранении репозиториев:", error);
        }
    };

    return (
        <main>
            <h1>Регистрация</h1>
            <section>
                <form onSubmit={handleRegister}>
                    <label htmlFor="username">Имя пользователя:</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />

                    <label htmlFor="email">Почта: </label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />

                    <label htmlFor="gitHubUsername">GitHub Username:</label>
                    <input 
                        type="text" 
                        id="gitHubUsername" 
                        value={gitHubUsername} 
                        onChange={(e) => setGitHubUsername(e.target.value)} 
                    /> {/* Убираем required */}

                    <label htmlFor="password">Пароль:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    
                    <button type="submit">Зарегистрироваться</button>
                </form>
                {message && <p>{message}</p>}
            </section>

            {/* Модальное окно */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Регистрация успешна!</h2>
                        <p>Теперь вы можете авторизоваться.</p>
                    </div>
                </div>
            )}
        </main>
    );
};

export default RegisterPage;
