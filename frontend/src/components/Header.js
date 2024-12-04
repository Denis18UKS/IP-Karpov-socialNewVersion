import React from 'react';
import { Link } from 'react-router-dom';
import './css-v2/Header.css'; // Импортируем CSS файл

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <header>
            <h1>IT-BIRD</h1>
            <nav>
                <Link to="/">Главная</Link>
                {!isAuthenticated ? (
                    <>
                        <Link to="/register">Регистрация</Link>
                        <Link to="/login">Вход</Link>
                    </>
                ) : (
                    <>
                        <Link to="/profile">Мой Профиль</Link>
                        <Link to="/chats">Чаты</Link>
                        <Link to="/users">Пользователи</Link>
                        <Link to="/forum">Форум</Link>
                        <Link to="/xakatons">IT-Хакатоны</Link>
                        <button className='exit-btn' onClick={handleLogout}>Выйти</button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
