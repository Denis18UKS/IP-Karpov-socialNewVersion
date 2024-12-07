import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css-v2/ChatsPage.css';

const Chats = () => {
    const { chatId } = useParams();
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState({});
    const [showScrollButton, setShowScrollButton] = useState(false);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Токен не найден, требуется авторизация!");
                navigate('/login');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                setCurrentUser(decodedToken);

                const response = await fetch('http://localhost:5000/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const usersData = await response.json();
                const filteredUsers = usersData.filter(user => user.id !== decodedToken.id);
                setUsers(filteredUsers);
                setFilteredUsers(filteredUsers);
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
                navigate('/login');
            }
        };

        fetchUsers();
    }, [navigate]);

    const selectChat = (user) => {
        if (selectedUser && selectedUser.id === user.id) {
            return;
        }

        setSelectedUser(user);
        setMessages([]);

        const token = localStorage.getItem("token");
        if (!token) return;

        const userId2 = user.id;

        fetch('http://localhost:5000/chats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId2 }),
        })
            .then(response => response.json())
            .then(chatData => {
                if (chatData.id) {
                    navigate(`/chats/${chatData.id}`);
                }
            })
            .catch(err => console.error("Ошибка при создании чата", err));
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const getAvatarUrl = (avatar) => {
        return avatar ? `http://localhost:5000${avatar}` : '/images/default-avatar.png';
    };

    return (
        <div className="chat-page">
            <ToastContainer />

            {/* Боковая панель пользователей */}
            <aside className="user-list">
                <h3>Пользователи</h3>
                <input
                    type="text"
                    placeholder="Поиск по имени..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                {filteredUsers.length > 0 ? (
                    <ul>
                        {filteredUsers.map((user) => (
                            <li
                                key={user.id}
                                onClick={() => selectChat(user)}
                                className={selectedUser && selectedUser.id === user.id ? 'active-chat' : ''}
                            >
                                <img src={getAvatarUrl(user.avatar)} alt={`${user.username} avatar`} />
                                <p>{user.username}</p>
                                {unreadMessagesCount[user.id] > 0 && (
                                    <span className="notification-badge">
                                        {unreadMessagesCount[user.id]}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-users">Пользователи не найдены</p>
                )}
            </aside>

            {/* Основной блок чата */}
            <main className="chat-box">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <h2>{selectedUser.username}</h2>
                        </div>

                        <div className="chat-messages">
                            {messages.map((message) => (
                                <div key={message.id} className={message.user_id === currentUser.id ? 'message mine' : 'message'}>
                                    {message.message || 'Сообщение не найдено'}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-container">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Введите сообщение..."
                                className="chat-input"
                            />
                            <button className="chat-send btn">Отправить</button>
                        </div>
                    </>
                ) : (
                    <div className="empty-chat">
                    </div>
                )}
            </main>
        </div>
    );
};

export default Chats;
