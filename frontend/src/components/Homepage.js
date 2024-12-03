import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";  // Импортируем контекст

const HomePage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);  // Получаем тему и функцию переключения

    return (
        <div>
            <main>
                <section className="hero">
                    <h2>Добро пожаловать на наш проект!</h2>
                    <p>Здесь вы можете авторизоваться, зарегистрироваться и просмотреть Мой Профиль.</p>
                </section>
            </main>

            {/* Подвал с кнопкой для переключения темы */}
            <footer>
                <p>&copy; 2024 IT-BIRD. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default HomePage;
