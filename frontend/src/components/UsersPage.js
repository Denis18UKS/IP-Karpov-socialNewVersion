import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  // Импортируем useNavigate
import { Link } from 'react-router-dom';
import './UsersPage.css';

const UsersPage = () => {
    const [users, setUsers] = useState([]);  // Состояние для хранения списка пользователей
    const [loading, setLoading] = useState(true);  // Для отслеживания состояния загрузки пользователей
    const navigate = useNavigate();

    // Загружаем список пользователей с сервера
    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token'); // Получаем токен из localStorage

            if (!token) {
                console.error("Токен не найден, необходима авторизация");
                return; // Если токен не найден, прекращаем выполнение
            }

            try {
                const response = await fetch('http://localhost:5000/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Отправляем токен в заголовке
                    },
                });

                // Проверка ответа
                if (!response.ok) {
                    const data = await response.json();
                    console.error('Ошибка при получении пользователей:', data.message);
                    setUsers([]); // Очистить список, если запрос не успешен
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);  // Обновляем список пользователей
                } else {
                    console.error("Ожидался массив, но получен:", data);
                    setUsers([]);  // В случае ошибки, очищаем список
                }
                setLoading(false); // Останавливаем индикатор загрузки
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
                setLoading(false);
                setUsers([]);  // Очищаем список в случае ошибки
            }
        };

        fetchUsers();
    }, []);  // useEffect вызывается при монтировании компонента

    // Функция обработки клика на пользователя
    const openProfile = (username) => {
        navigate(`/users/${username}`);  // Используем navigate для перехода на страницу профиля
    };


    return (
        <div className="users">
            <ul className="users-list-page">
                {/* Загрузка пользователей */}
                {loading ? (
                    <p>Загрузка пользователей...</p>
                ) : (
                    users.map((user, index) => (
                        <Link key={index} to={`/users/${user.username}`}>
                            <li>
                                <img
                                    src={user.avatar ? `http://localhost:5000${user.avatar}` : "./images/default-avatar.png"}
                                    alt={`${user.username} avatar`}
                                />
                                <div id="name-and-skills">
                                    <p>{user.username}</p>
                                    <hr />
                                    <h6>
                                        <i>{user.skills ? user.skills : "Нет навыков"}</i>
                                    </h6>
                                </div>
                            </li>
                        </Link>
                    ))
                )}
            </ul>

            <footer>
                <p>&copy; 2024 IT-BIRD. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default UsersPage;
