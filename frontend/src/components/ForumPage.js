import React, { useState, useEffect } from 'react';
import './css-v2/ForumPage.css'; // Импортируем CSS файл

const Forum = () => {
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [showAddAnswerModal, setShowAddAnswerModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ title: '', description: '' });
    const [newAnswer, setNewAnswer] = useState('');

    const userId = localStorage.getItem('userId'); // ID текущего пользователя
    const userRole = localStorage.getItem('role'); // Роль пользователя ('user', 'admin')

    // Функция для получения вопросов с сервера
    const fetchQuestions = async () => {
        try {
            const response = await fetch('http://localhost:5000/forums');
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error('Ошибка при получении вопросов:', error);
        }
    };

    // Функция для получения ответов для выбранного вопроса
    const fetchAnswers = async (questionId) => {
        try {
            const response = await fetch(`http://localhost:5000/forums/${questionId}/answers`);
            const data = await response.json();
            setAnswers(data);
            setShowAnswerModal(true); // Открываем модальное окно для просмотра ответов
        } catch (error) {
            console.error('Ошибка при получении ответов:', error);
        }
    };

    useEffect(() => {
        console.log('User ID:', userId);
        console.log('User Role:', userRole);
        fetchQuestions();
    }, []);

    const addQuestion = async (e) => {
        e.preventDefault();
        if (newQuestion.title && newQuestion.description) {
            try {
                const token = localStorage.getItem('token'); // Получаем токен из localStorage

                const response = await fetch('http://localhost:5000/forums', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,  // Отправляем токен в заголовке
                    },
                    body: JSON.stringify({
                        title: newQuestion.title,
                        description: newQuestion.description,
                        user_id: userId, // Используем ID текущего пользователя
                    }),
                });

                const newQuestionFromDB = await response.json();
                if (response.ok) {
                    setQuestions((prev) => [...prev, newQuestionFromDB]);
                    setShowModal(false);
                    setNewQuestion({ title: '', description: '' });
                } else {
                    console.error('Ошибка при добавлении вопроса:', newQuestionFromDB.message);
                }
            } catch (error) {
                console.error('Ошибка при добавлении вопроса:', error);
            }
        }
    };

    const addAnswer = async (e) => {
        e.preventDefault();
        if (newAnswer && selectedQuestion) {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`http://localhost:5000/forums/${selectedQuestion}/answers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,  // Добавляем токен в заголовок
                    },
                    body: JSON.stringify({
                        answer: newAnswer,
                        user_id: userId, // Используем ID текущего пользователя
                        question_id: selectedQuestion,
                    }),
                });

                const newAnswerFromDB = await response.json();
                if (response.ok) {
                    setAnswers((prev) => [...prev, newAnswerFromDB]);
                    setShowAddAnswerModal(false);
                    setNewAnswer('');
                } else {
                    console.error('Ошибка при добавлении ответа:', newAnswerFromDB.message);
                }
            } catch (error) {
                console.error('Ошибка при добавлении ответа:', error);
            }
        }
    };

    const closeQuestion = async (questionId) => {
        try {
            await fetch(`http://localhost:5000/forums/${questionId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Решён' }),
            });
            fetchQuestions();
        } catch (error) {
            console.error('Ошибка при закрытии вопроса:', error);
        }
    };

    return (
        <div className="forum-page">
            <main>
                <section className="forum">
                    <h2>Форум</h2>
                    <p>Добро пожаловать на форум! Задавайте вопросы, делитесь опытом, находите решения.</p>
                    <button className="btn" onClick={() => setShowModal(true)}>
                        Задать вопрос
                    </button>

                    <div className="questions">
                        {questions.map((q) => (
                            <article key={q.id} className={`question ${q.status === 'Решён' ? 'resolved' : ''}`}>
                                <h3>Тема: {q.title}</h3>
                                <p>Описание: {q.description}</p>
                                <p><strong>Пользователь:</strong> {q.user || 'Не указан'}</p>  {/* Имя пользователя */}
                                <p><strong>Дата:</strong> {q.created_at ? new Date(q.created_at).toLocaleDateString() : 'Не указана'}</p>
                                <p><strong>Статус:</strong> {q.status}</p>

                                <button className="btn" onClick={() => { setSelectedQuestion(q.id); fetchAnswers(q.id); }}>
                                    Посмотреть ответы
                                </button>

                                {String(q.user_id) !== String(userId) && (
                                    <button className="btn" onClick={() => { setSelectedQuestion(q.id); setShowAddAnswerModal(true); }}>
                                        Ответить
                                    </button>
                                )}

                                {(String(q.user_id) === String(userId)) && (
                                    <button className="btn" onClick={() => closeQuestion(q.id)}>
                                        Закрыть вопрос
                                    </button>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            {/* Модальное окно для добавления вопроса */}
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
                            <button type="submit" className="btn">Отправить</button>
                            <button type="button" className="btn cancel-btn" onClick={() => setShowModal(false)}>Отмена</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Модальное окно для просмотра ответов */}
            {showAnswerModal && (
                <div className="modal-forum">
                    <div className="modal-content">
                        <h3>Ответы</h3>
                        {answers.map((answer) => (
                            <p key={answer.id}><strong>{answer.user}:</strong> {answer.answer}</p>
                        ))}
                        <button className="btn" onClick={() => setShowAnswerModal(false)}>Закрыть</button>
                    </div>
                </div>
            )}

            {/* Модальное окно для добавления ответа */}
            {showAddAnswerModal && (
                <div className="modal-forum">
                    <div className="modal-content">
                        <h3>Добавить ответ</h3>
                        <form onSubmit={addAnswer}>
                            <textarea
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                required
                            ></textarea>
                            <button type="submit" className="btn">Отправить</button>
                            <button type="button" className="btn cancel-btn" onClick={() => setShowAddAnswerModal(false)}>Отмена</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forum;