import React, { useState, useEffect } from 'react';
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

import UsersAdminPage from './admin/UsersAdminPage';
import StatisticsPage from './admin/StatisticsPage';
import ModerationPage from './admin/ModerationPage';

import CommitsPage from './components/CommitsPage';
import FilesPage from './components/FilesPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // Добавлено состояние для роли

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role'); // Получаем роль из localStorage
    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole); // Устанавливаем роль
    }
  }, []);

  return (
    <Router>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        role={role} // Передаем роль в Header
      />
      <Routes>
        <Route
          path="/"
          element={<HomePage isAuthenticated={isAuthenticated} />}
        />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<RegisterPage />} />

        {isAuthenticated ? (
          <>
            <Route path="/profile" element={<MyProfilePage />} />
            <Route path="/users/:username" element={<UserProfilePage />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/chats/:chatId" element={<ChatsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/xakatons" element={<XakatonsPage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/user/:username/commits/:repoName" element={<CommitsPage />} />
            <Route path="/user/:username/files/:repoName" element={<FilesPage />} />


            {/* Администраторские маршруты */}
            {role === 'admin' && (
              <>
                <Route path="/admin/users" element={<UsersAdminPage />} />
                <Route path="/admin/moderation" element={<ModerationPage />} />
                <Route path="/admin/statistics" element={<StatisticsPage />} />
              </>
            )}
          </>
        ) : (
          <Route path="*" element={<HomePage isAuthenticated={isAuthenticated} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;

