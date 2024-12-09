import React, { useState, useEffect } from 'react';
import './UsersAdminPage.css';

const UsersAdminPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/admin/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                if (!response.ok) {
                    throw new Error('Ошибка загрузки пользователей');
                }

                const data = await response.json();
                console.log(data); // Для отладки
                setUsers(data);
            } catch (err) {
                setError(err.message);
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    const handleBlockUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}/block`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при блокировке пользователя');
            }

            setUsers(users.map((user) =>
                user.id === userId ? { ...user, isBlocked: 'заблокирован' } : user
            ));
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}/unblock`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при разблокировке пользователя');
            }

            setUsers(users.map((user) =>
                user.id === userId ? { ...user, isBlocked: 'активен' } : user
            ));
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                const response = await fetch(`http://localhost:5000/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Ошибка при удалении пользователя');
                }

                setUsers(users.filter((user) => user.id !== userId));
            } catch (err) {
                setError(err.message);
                console.error(err);
            }
        }
    };

    return (
        <main>
            <div className='users-management'>
                <h2>Управление пользователями</h2>
                {error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <div className="users-grid">
                        {users.map((user) => (
                            <div key={user.id} className="user-card">
                                <h3>{user.username}</h3>
                                <p>{user.email}</p>
                                {user.isBlocked === 'заблокирован' ? (
                                    <>
                                        <p style={{ color: 'red' }}>Пользователь заблокирован</p>
                                        <div className="button-group">
                                            <button className="unblock" onClick={() => handleUnblockUser(user.id)}>Разблокировать</button>
                                            <button className="delete" onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="button-group">
                                        <button className="block" onClick={() => handleBlockUser(user.id)}>Заблокировать</button>
                                        <button className="delete" onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default UsersAdminPage;
