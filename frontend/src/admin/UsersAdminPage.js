import React, { useState, useEffect } from 'react';

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
                setUsers(data);
            } catch (err) {
                setError(err.message);
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <main>
            <div className='users-management'>
                <h2>Управление пользователями</h2>
                {error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                <p>{user.username} ({user.email})</p>
                                {/* Добавьте функциональность управления */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
};

export default UsersAdminPage;
