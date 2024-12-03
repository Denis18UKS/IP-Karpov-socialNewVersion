import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css-v2/ChatsPage.css'; // Импортируем CSS файл

const Chats = () => {
    const { chatId } = useParams();
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch('http://localhost:5000/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const usersData = await response.json();
                setUsers(usersData);
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
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
            } catch (error) {
                console.error("Ошибка при загрузке сообщений:", error);
            }
        };

        fetchUsers();
        if (chatId) {
            fetchMessages(chatId);
        }
    }, [chatId]);

    const selectChat = (user) => {
        setSelectedUser(user);
        setMessages([]); // Очистка сообщений при выборе нового чата
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
                    body: JSON.stringify({ chatId, message: newMessage }),
                });

                if (response.ok) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { sender: 'Вы', text: newMessage },
                    ]);
                    setNewMessage('');
                } else {
                    throw new Error('Ошибка при отправке сообщения');
                }
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
            }
        }
    };

    return (
        <div className="chat-page">
            <aside className="user-list">
                <h3>Пользователи</h3>
                <ul>
                    {users.map((user) => (
                        <li key={user.id} onClick={() => selectChat(user)}>
                            <img src={user.avatar} alt={`${user.username} avatar`} />
                            <p>{user.username}</p>
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="chat-box">
                <div className="chat-header">
                    <h2>{selectedUser ? selectedUser.username : 'Выберите пользователя'}</h2>
                </div>
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={message.sender === 'Вы' ? 'message mine' : 'message'}>
                            <strong>{message.sender}:</strong> {message.text}
                        </div>
                    ))}
                </div>
                {selectedUser && (
                    <div className="chat-input-container">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
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