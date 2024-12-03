import React, { createContext, useState, useEffect } from 'react';

// Создаем контекст
export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    // Получаем текущую тему из localStorage или по умолчанию устанавливаем светлую
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'style-light.css');

    // Функция для переключения темы
    const toggleTheme = () => {
        const newTheme = theme === 'style-light.css' ? 'style-light.css' : 'style-light.css';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);  // Сохраняем выбранную тему в localStorage
    };

    // При изменении темы применяем ее к body
    useEffect(() => {
        document.body.setAttribute('data-theme', theme === 'style-light.css' ? 'light' : 'dark');
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
