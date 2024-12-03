import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify'; // Импорт toast и ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Импорт стилей для Toastify
import './css-v2/ChatsPage.css';

const Chats = () => {
    const { chatId } = useParams();
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState({});
    const navigate = useNavigate();

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

                // Обновление количества непрочитанных сообщений
                if (id !== chatId) {
                    setUnreadMessagesCount((prevState) => ({
                        ...prevState,
                        [id]: messagesData.filter(msg => !msg.read).length, // Для каждого чата сохраняем количество непрочитанных сообщений
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

    const selectChat = (user) => {
        if (selectedUser && selectedUser.id === user.id) {
            // Если выбран тот же пользователь, не перезапрашиваем сообщения
            return;
        }

        setSelectedUser(user);
        setMessages([]); // Очистка сообщений только при изменении чата
        setUnreadMessagesCount((prevState) => ({ ...prevState, [user.id]: 0 })); // Обнуляем количество непрочитанных сообщений при открытии чата

        const token = localStorage.getItem("token");
        if (!token) return;

        const decodedToken = jwtDecode(token);
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
                    body: JSON.stringify({ chatId, message: newMessage }),
                });

                if (response.ok) {
                    const sentMessage = {
                        id: Date.now(),
                        chat_id: chatId,
                        user_id: currentUser.id,
                        message: newMessage,
                        created_at: new Date().toISOString(),
                        username: currentUser.username,
                        read: true // Помечаем сообщение как прочитанное
                    };

                    setMessages((prevMessages) => [...prevMessages, sentMessage]);
                    setNewMessage('');
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
            e.preventDefault(); // Отменяем стандартное поведение (перевод строки в input)
            sendMessage(); // Отправляем сообщение
        }
    };

    // Функция для обработки аватара
    const getAvatarUrl = (avatar) => {
        if (avatar) {
            return `http://localhost:5000${avatar}`; // Абсолютный путь на сервер
        } else {
            return '/images/default-avatar.png'; // Путь к дефолтному изображению
        }
    };


    // Обработка новых сообщений для всплывающих уведомлений
    useEffect(() => {
        if (messages.length > 0 && messages[messages.length - 1].user_id !== currentUser.id) {
            const lastMessage = messages[messages.length - 1];

            // Показ уведомления только если чат не открыт и сообщение не прочитано
            if (chatId !== lastMessage.chat_id && !lastMessage.read) {
                toast(`Новое сообщение от ${selectedUser?.username}`);
            }
        }
    }, [messages, selectedUser, chatId, currentUser]);

    return (
        <div className="chat-page">
            <ToastContainer /> {/* Добавьте контейнер для уведомлений */}

            <aside className="user-list">
                <h3>Пользователи</h3>
                <ul>
                    {users.map((user) => (
                        <li key={user.id} onClick={() => selectChat(user)}>
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
                            <strong>{message.user_id === currentUser.id ? 'Вы' : message.username}:</strong> {message.message || 'Сообщение не найдено'}
                        </div>
                    ))}
                </div>

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
