import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  // Импортируем useNavigate
import { Link } from 'react-router-dom';
import './UsersPage.css';
// Изменения в UsersPage.js
import { jwtDecode as jwt_decode } from "jwt-decode";



const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Токен не найден, необходима авторизация");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/users", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.error("Ошибка при получении пользователей:", data.message);
                    setUsers([]);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                const decodedToken = jwt_decode(token); // Декодируем токен
                const currentUserId = decodedToken.id; // Получаем ID текущего пользователя

                setUsers(data.filter((user) => user.id !== currentUserId)); // Исключаем текущего пользователя
                setLoading(false);
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
                setLoading(false);
                setUsers([]);
            }
        };

        fetchUsers();
    }, []);

    const openProfile = (username) => {
        navigate(`/users/${username}`);
    };

    return (
        <div className="users">
            <ul className="users-list-page">
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
