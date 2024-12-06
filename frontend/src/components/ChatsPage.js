import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css-v2/ChatsPage.css';

const Chats = () => {
    const { chatId } = useParams();
    const [selectedUser, setSelectedUser] = useState(() => {
        const savedUser = localStorage.getItem('selectedUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('messages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
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

        const fetchMessages = async (id) => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:5000/messages/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const messagesData = await response.json();
                setMessages(messagesData);

                if (id !== chatId) {
                    setUnreadMessagesCount((prevState) => ({
                        ...prevState,
                        [id]: messagesData.filter(msg => !msg.read).length,
                    }));
                }
            } catch (error) {
                console.error("Ошибка при загрузке сообщений:", error);
            }
        };

        fetchUsers();
        if (chatId) {
            fetchMessages(chatId);
        }
    }, [chatId, navigate]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onmessage = (event) => {
            const notification = JSON.parse(event.data);

            if (notification.type === 'NEW_MESSAGE') {
                const message = notification.data;

                // Если сообщение уже есть или отправлено текущим пользователем, игнорируем
                if (message.user_id === currentUser.id) return;

                // Если сообщение из другого чата
                if (message.chat_id !== chatId) {
                    toast(`Новое сообщение от ${message.username || 'Неизвестный'}`);
                    setUnreadMessagesCount((prevState) => ({
                        ...prevState,
                        [message.chat_id]: (prevState[message.chat_id] || 0) + 1,
                    }));
                } else {
                    setMessages((prevMessages) => {
                        const newMessages = [...prevMessages, message];
                        localStorage.setItem('messages', JSON.stringify(newMessages));
                        return newMessages;
                    });
                    setShowScrollButton(true);  // Показываем кнопку прокрутки
                }
            }
        };

        return () => {
            socket.close();
        };
    }, [chatId, currentUser]);

    const selectChat = (user) => {
        if (selectedUser && selectedUser.id === user.id) {
            return;
        }

        setSelectedUser(user);
        setMessages([]);
        setUnreadMessagesCount((prevState) => ({ ...prevState, [user.id]: 0 }));

        // Сохраняем выбранного пользователя в localStorage
        localStorage.setItem('selectedUser', JSON.stringify(user));

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

    const sendMessage = async () => {
        if (newMessage.trim()) {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:5000/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ chatId, message: newMessage, username: currentUser.username }),
                });

                if (response.ok) {
                    const sentMessage = {
                        id: Date.now(),
                        chat_id: chatId,
                        user_id: currentUser.id,
                        message: newMessage,
                        created_at: new Date().toISOString(),
                        username: currentUser.username,
                        read: true
                    };

                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, sentMessage];
                        localStorage.setItem('messages', JSON.stringify(updatedMessages));  // Сохраняем сообщения
                        return updatedMessages;
                    });
                    setNewMessage('');
                    scrollToBottom();
                } else {
                    throw new Error('Ошибка при отправке сообщения');
                }
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getAvatarUrl = (avatar) => {
        return avatar ? `http://localhost:5000${avatar}` : '/images/default-avatar.png';
    };

    const handleScrollButtonClick = () => {
        scrollToBottom();
        setShowScrollButton(false);  // Скрыть кнопку после прокрутки
    };

    return (
        <div className="chat-page">
            <ToastContainer />

            <aside className="user-list">
                <h3>Пользователи</h3>
                <input
                    type="text"
                    placeholder="Поиск по имени..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
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
            </aside>

            <main className="chat-box">
                <div className="chat-header">
                    <h2>{selectedUser ? selectedUser.username : 'Выберите пользователя'}</h2>
                </div>

                <div className="chat-messages">
                    {messages.map((message) => (
                        <div key={message.id} className={message.user_id === currentUser.id ? 'message mine' : 'message'}>
                            {message.message || 'Сообщение не найдено'}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {showScrollButton && (
                    <button
                        className="scroll-down-button"
                        onClick={handleScrollButtonClick}  // Обработчик клика на кнопку
                    >
                        ↓
                    </button>
                )}

                {selectedUser && (
                    <div className="chat-input-container">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Введите сообщение..."
                            className="chat-input"
                        />
                        <button className="chat-send btn" onClick={sendMessage}>Отправить</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Chats;
