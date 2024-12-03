// document.addEventListener('DOMContentLoaded', () => {
//     const themeToggle = document.getElementById('theme-toggle');
//     const themeStyle = document.getElementById('theme-style');
//     const body = document.body;

//     // Устанавливаем текущую тему при загрузке страницы
//     const currentTheme = localStorage.getItem('theme') || detectThemeByTime();
//     setTheme(currentTheme);

//     themeToggle.addEventListener('click', () => {
//         // Определяем текущую и новую тему
//         const newTheme = themeStyle.getAttribute('href') === 'style-light.css' ? 'style-light.css' : 'style-light.css';
//         // Плавный переход при переключении
//         body.classList.add('theme-transition');
//         setTheme(newTheme);
//         // Удаляем класс анимации после завершения
//         setTimeout(() => body.classList.remove('theme-transition'), 500);
//     });

//     function setTheme(theme) {
//         themeStyle.setAttribute('href', theme);
//         themeToggle.textContent = theme === 'style-light.css' ? 'Светлая тема' : 'Тёмная тема';
//         localStorage.setItem('theme', theme);
//     }

//     // Функция для автоматического определения темы по времени суток
//     function detectThemeByTime() {
//         const hour = new Date().getHours();
//         return hour >= 7 && hour < 19 ? 'style-light.css' : 'style-light.css';
//     }
// });
