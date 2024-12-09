import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './css-v2/Header.css';

const Header = ({ isAuthenticated, setIsAuthenticated, role }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <h1>IT-BIRD</h1>
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>
            <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
                <TransitionGroup>
                    <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Главная</Link>
                    </CSSTransition>

                    {!isAuthenticated ? (
                        <>
                            <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)}>Регистрация</Link>
                            </CSSTransition>
                            <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Вход</Link>
                            </CSSTransition>
                        </>
                    ) : (
                        <>
                            <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Мой Профиль</Link>
                            </CSSTransition>
                            <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                                <Link to="/chats" onClick={() => setIsMenuOpen(false)}>Чаты</Link>
                            </CSSTransition>
                            <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                                <Link to="/users" onClick={() => setIsMenuOpen(false)}>Пользователи</Link>
                            </CSSTransition>
                            <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                                <Link to="/forum" onClick={() => setIsMenuOpen(false)}>Форум</Link>
                            </CSSTransition>
                            <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                                <Link to="/xakatons" onClick={() => setIsMenuOpen(false)}>IT-Хакатоны</Link>
                            </CSSTransition>
                            
                            {/* Для администратора */}
                            {role === 'admin' && (
                                <>
                                    <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                                        <Link to="/admin/users" onClick={() => setIsMenuOpen(false)}>Управление пользователями</Link>
                                    </CSSTransition>
                                    <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                                        <Link to="/admin/moderation" onClick={() => setIsMenuOpen(false)}>Модерация контента</Link>
                                    </CSSTransition>
                                    <CSSTransition in={true} timeout={500} classNames="nav-link" unmountOnExit>
                                        <Link to="/admin/statistics" onClick={() => setIsMenuOpen(false)}>Статистика</Link>
                                    </CSSTransition>
                                </>
                            )}

                            <button className="exit-btn" onClick={handleLogout}>Выйти</button>
                        </>
                    )}
                </TransitionGroup>
            </nav>
        </header>
    );
};

export default Header;
