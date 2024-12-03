import React, { useState } from 'react';

const users = [
    { id: 1, name: 'Максим', avatar: './images/users-avatars/Maksim.jpg' },
    { id: 2, name: 'Вика', avatar: './images/users-avatars/Vika.jpg' },
    { id: 3, name: 'Никита', avatar: './images/users-avatars/Nikita.jpg' },
    { id: 4, name: 'Алексей', avatar: './images/users-avatars/ALeksei.jpg' },
];

const Chats = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const selectChat = (user) => {
        setSelectedUser(user);
        setMessages([]); // Очистка сообщений при выборе нового чата
    };

    const sendMessage = () => {
        if (newMessage.trim()) {
            setMessages((prevMessages) => [...prevMessages, { sender: 'Вы', text: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <div className="chat-page">
            <main className="chat-main">
                {/* Список пользователей */}
                <aside className="user-list">
                    <h3>Пользователи</h3>
                    <ul>
                        {users.map((user) => (
                            <li key={user.id} onClick={() => selectChat(user)}>
                                <img src={user.avatar} alt={`${user.name} avatar`} />
                                <p>{user.name}</p>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Окно чата */}
                <section className="chat-box">
                    <div className="chat-header">
                        <h2>{selectedUser ? selectedUser.name : 'Выберите пользователя'}</h2>
                    </div>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <p key={index}>
                                <strong>{message.sender}:</strong> {message.text}
                            </p>
                        ))}
                    </div>
                </section>

                {/* Поле ввода сообщения */}
                {selectedUser && (
                    <div className="chat-input-container">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Введите сообщение..."
                            className="chat-input"
                        />
                        <button className="chat-send btn" onClick={sendMessage}>
                            Отправить
                        </button>
                    </div>
                )}
            </main>

            <footer>
                <p>&copy; 2024 IT-BIRD. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default Chats;
