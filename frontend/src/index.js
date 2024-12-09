import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker зарегистрирован:', registration);
    })
    .catch((error) => {
      console.error('Ошибка регистрации Service Worker:', error);
    });
}


// Проверка и запрос разрешения на уведомления
if ('Notification' in window) {
  Notification.requestPermission()
    .then((permission) => {
      if (permission === 'granted') {
        console.log('Уведомления разрешены.');
      } else {
        console.log('Уведомления запрещены.');
      }
    })
    .catch((error) => {
      console.error('Ошибка при запросе разрешения на уведомления:', error);
    });
}

// Тестовая отправка локального уведомления
if ('serviceWorker' in navigator && Notification.permission === 'granted') {
  navigator.serviceWorker.ready
    .then((registration) => {
      registration.showNotification('Добро пожаловать!', {
        body: 'Вы успешно активировали уведомления.',
        icon: '/favicon.ico', // Замените на ваш путь к иконке
        tag: 'welcome-notification', // Уникальный идентификатор уведомления
      });
    })
    .catch((error) => {
      console.error('Ошибка при отправке локального уведомления:', error);
    });
}

reportWebVitals();
