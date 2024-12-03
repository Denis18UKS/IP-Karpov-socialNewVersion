import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Homepage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import MyProfilePage from './components/MyProfilePage'; // Изменено на компонент для своего профиля
import UserProfilePage from './components/UserProfilePage'; // Новый компонент для чужого профиля
import ChatsPage from './components/ChatsPage';
import UsersPage from './components/UsersPage';
import ForumPage from './components/ForumPage';
import XakatonsPage from './components/XakatonsPage';
import Header from './components/Header';
import EditProfilePage from './components/EditProfilePage';
import './style-light.css'; // Светлая тема

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.setAttribute('data-theme', isDarkTheme ? 'light' : 'dark');
  };

  return (
    <Router>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        toggleTheme={toggleTheme}
        isDarkTheme={isDarkTheme}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {isAuthenticated ? (
          <>
            <Route path="/profile" element={<MyProfilePage />} /> {/* Для отображения вашего профиля */}
            <Route path="/users/:username" element={<UserProfilePage />} /> {/* Для чужого профиля */}
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/xakatons" element={<XakatonsPage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </>
        ) : (
          <Route path="*" element={<HomePage />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
