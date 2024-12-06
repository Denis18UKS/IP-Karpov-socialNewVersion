import React from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group'; // Добавляем TransitionGroup и CSSTransition
import './css-v2/Header.css'; // Импортируем CSS файл

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
    const handleLogout = () => {
        setIsAuthenticated(false);
        // Очистить токен и другую информацию из localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
    };

    return (
        <header>
            <h1>IT-BIRD</h1>
            <nav>
                <TransitionGroup>
                    <CSSTransition
                        in={true}
                        timeout={500}
                        classNames="nav-link"
                        unmountOnExit
                    >
                        <Link to="/">Главная</Link>
                    </CSSTransition>

                    {!isAuthenticated ? (
                        <>
                            <CSSTransition
                                in={true}
                                timeout={500}
                                classNames="nav-link"
                                unmountOnExit
                            >
                                <Link to="/register">Регистрация</Link>
                            </CSSTransition>

                            <CSSTransition
                                in={true}
                                timeout={500}
                                classNames="nav-link"
                                unmountOnExit
                            >
                                <Link to="/login">Вход</Link>
                            </CSSTransition>
                        </>
                    ) : (
                        <>
                            <CSSTransition
                                in={true}
                                timeout={500}
                                classNames="nav-link"
                                unmountOnExit
                            >
                                <Link to="/profile">Мой Профиль</Link>
                            </CSSTransition>

                            <CSSTransition
                                in={true}
                                timeout={500}
                                classNames="nav-link"
                                unmountOnExit
                            >
                                <Link to="/chats">Чаты</Link>
                            </CSSTransition>

                            <CSSTransition
                                in={true}
                                timeout={500}
                                classNames="nav-link"
                                unmountOnExit
                            >
                                <Link to="/users">Пользователи</Link>
                            </CSSTransition>

                            <CSSTransition
                                in={true}
                                timeout={500}
                                classNames="nav-link"
                                unmountOnExit
                            >
                                <Link to="/forum">Форум</Link>
                            </CSSTransition>

                            <CSSTransition
                                in={true}
                                timeout={500}
                                classNames="nav-link"
                                unmountOnExit
                            >
                                <Link to="/xakatons">IT-Хакатоны</Link>
                            </CSSTransition>
                        </>
                    )}
                </TransitionGroup>

                {/* Кнопка выхода отдельно, чтобы она не была затронута анимацией */}
                {isAuthenticated && (
                    <button className="exit-btn" onClick={handleLogout}>
                        Выйти
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;
