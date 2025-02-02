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
                navigate('/login');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                setCurrentUser(decodedToken);

                const response = await fetch('http://localhost:5000/users', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const usersData = await response.json();
                setUsers(usersData.filter(user => user.id !== decodedToken.id));
                setFilteredUsers(usersData.filter(user => user.id !== decodedToken.id));
            } catch (error) {
                console.error("Ошибка загрузки пользователей:", error);
                navigate('/login');
            }
        };

        fetchUsers();
    }, [navigate]);

    useEffect(() => {
        if (!chatId) return;

        const fetchMessages = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:5000/messages/${chatId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const messagesData = await response.json();
                setMessages(messagesData);
                setUnreadMessagesCount(prev => ({ ...prev, [chatId]: 0 }));
            } catch (error) {
                console.error("Ошибка загрузки сообщений:", error);
            }
        };

        fetchMessages();
    }, [chatId]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onmessage = (event) => {
            const notification = JSON.parse(event.data);

            if (notification.type === 'NEW_MESSAGE') {
                const message = notification.data;
                if (message.chat_id !== chatId) {
                    toast(`Новое сообщение от ${message.username || 'Неизвестный'}`);
                    setUnreadMessagesCount(prev => ({
                        ...prev,
                        [message.chat_id]: (prev[message.chat_id] || 0) + 1
                    }));
                } else {
                    setMessages(prev => [...prev, message]);
                    setShowScrollButton(true);
                }
            }
        };

        return () => socket.close();
    }, [chatId]);

    const selectChat = (user) => {
        if (selectedUser?.id === user.id) return;

        setSelectedUser(user);
        setMessages([]);
        setUnreadMessagesCount(prev => ({ ...prev, [user.id]: 0 }));

        const token = localStorage.getItem("token");
        if (!token) return;

        fetch('http://localhost:5000/chats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId2: user.id }),
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
        if (newMessage.trim() === '') return;

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

                setMessages(prev => [...prev, sentMessage]);
                setNewMessage('');
                scrollToBottom();
            } else {
                throw new Error('Ошибка при отправке сообщения');
            }
        } catch (error) {
            console.error('Ошибка:', error);
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
        setFilteredUsers(users.filter(user => user.username.toLowerCase().includes(query)));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getAvatarUrl = (avatar) => {
        return avatar ? `http://localhost:5000${avatar}` : '/images/default-avatar.png';
    };

    if (!currentUser) return <div>Загрузка...</div>;

    return (
        <div className="chat-page">
            <ToastContainer />

            <aside className="user-list">
                <h3>Пользователи</h3>
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <ul>
                    {filteredUsers.map(user => (
                        <li key={user.id} onClick={() => selectChat(user)} className={selectedUser?.id === user.id ? 'active-chat' : ''}>
                            <img src={getAvatarUrl(user.avatar)} alt="avatar" />
                            <p>{user.username}</p>
                            {unreadMessagesCount[user.id] > 0 && <span className="notification-badge">{unreadMessagesCount[user.id]}</span>}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="chat-box">
                <div className="chat-header">
                    <h2>{selectedUser ? selectedUser.username : 'Выберите пользователя'}</h2>
                </div>

                <div className="chat-messages">
                    {messages.map(message => (
                        <div key={message.id} className={message.user_id === currentUser.id ? 'message mine' : 'message'}>
                            {message.message}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {selectedUser && (
                    <div className="chat-input-container">
                        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Введите сообщение..." />
                        <button onClick={sendMessage}>Отправить</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Chats;
