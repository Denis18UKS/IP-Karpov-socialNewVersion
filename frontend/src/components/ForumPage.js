import React, { useState, useEffect } from 'react';
import './css-v2/ForumPage.css'; // Импортируем CSS файл

const Forum = () => {
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ title: '', description: '' });

    // Функция для получения вопросов с сервера
    const fetchQuestions = async () => {
        try {
            const response = await fetch('http://localhost:5000/forums');
            if (!response.ok) {
                throw new Error('Ошибка при получении вопросов');
            }
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error('Ошибка при получении вопросов:', error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const addQuestion = async (e) => {
        e.preventDefault();
        if (newQuestion.title && newQuestion.description) {
            try {
                const response = await fetch('http://localhost:5000/forums', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: newQuestion.title,
                        description: newQuestion.description,
                        user_id: 1, // Замените на фактический ID пользователя, если это доступно
                    }),
                });
                const newQuestionFromDB = await response.json();
                setQuestions((prev) => [...prev, newQuestionFromDB]);
                setShowModal(false);
                setNewQuestion({ title: '', description: '' });
            } catch (error) {
                console.error('Ошибка при добавлении вопроса:', error);
            }
        }
    };

    // Закрытие модального окна при клике вне его
    const handleOutsideClick = (event) => {
        if (event.target.classList.contains("modal-forum")) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            window.addEventListener("click", handleOutsideClick);
        } else {
            window.removeEventListener("click", handleOutsideClick);
        }

        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [showModal]);

    return (
        <div className="forum-page">
            <main>
                <section className="forum">
                    <h2>Форум</h2>
                    <p>Добро пожаловать на форум! Задавайте вопросы, делитесь опытом, находите решения.</p>
                    <button className="btn" onClick={() => setShowModal(true)}>
                        Задать вопрос
                    </button>

                    {/* Список вопросов */}
                    <div className="questions">
                        {questions.map((q) => (
                            <article key={q.id} className={`question ${q.status === 'Решён' ? 'resolved' : ''}`}>
                                <h3>Тема: {q.question}</h3>
                                <p>Описание: {q.description}</p>
                                <p><strong>Пользователь:</strong> {q.user}</p>
                                <p><strong>Дата:</strong> {new Date(q.created_at).toLocaleDateString()}</p>
                                <p><strong>Статус:</strong> {q.status}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            {/* Модальное окно */}
            {showModal && (
                <div className="modal-forum">
                    <div className="modal-content">
                        <h3>Задать вопрос</h3>
                        <form onSubmit={addQuestion}>
                            <label>Тема вопроса</label>
                            <input
                                type="text"
                                value={newQuestion.title}
                                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                                required
                            />
                            <label>Описание</label>
                            <textarea
                                value={newQuestion.description}
                                onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                                required
                            ></textarea>
                            <button type="submit" className="btn">
                                Отправить
                            </button>
                            <button type="button" className="btn cancel-btn" onClick={() => setShowModal(false)}>
                                Отмена
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <footer>
                <p>&copy; 2024 IT-BIRD. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default Forum;
