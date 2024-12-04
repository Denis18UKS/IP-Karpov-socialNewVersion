import React, { useState, useEffect } from 'react';
import './css-v2/ForumPage.css';

const Forum = () => {
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ title: '', description: '' });
    const [selectedQuestion, setSelectedQuestion] = useState(null); // Выбранный вопрос
    const [answers, setAnswers] = useState([]); // Ответы для выбранного вопроса
    const [newAnswer, setNewAnswer] = useState(''); // Новый ответ
    const userId = 1; // Пример текущего пользователя с ID 1 (можно заменить на реальный ID из авторизации)

    // Получение списка вопросов
    const fetchQuestions = async () => {
        try {
            const response = await fetch('http://localhost:5000/forums');
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error('Ошибка при получении вопросов:', error);
        }
    };

    // Получение ответов для выбранного вопроса
    const fetchAnswers = async (questionId) => {
        try {
            const response = await fetch(`http://localhost:5000/forums/${questionId}/answers`);
            const data = await response.json();
            setAnswers(data);
        } catch (error) {
            console.error('Ошибка при получении ответов:', error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // Добавление нового вопроса
    const addQuestion = async (e) => {
        e.preventDefault();
        if (newQuestion.title && newQuestion.description) {
            try {
                const response = await fetch('http://localhost:5000/forums', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: newQuestion.title,
                        description: newQuestion.description,
                        user_id: userId,
                    }),
                });
                const newQuestionFromDB = await response.json();
                setQuestions((prev) => [...prev, newQuestionFromDB]);
                setShowModal(false);
                setNewQuestion({ title: '', description: '' });
                alert('Вопрос успешно добавлен!');
            } catch (error) {
                console.error('Ошибка при добавлении вопроса:', error);
                alert('Произошла ошибка при добавлении вопроса.');
            }
        }
    };



    // Добавление ответа
    const addAnswer = async (questionId) => {
        try {
            await fetch(`http://localhost:5000/forums/${questionId}/answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer: newAnswer, user_id: userId }),
            });
            setNewAnswer('');
            fetchAnswers(questionId); // Обновляем список ответов
        } catch (error) {
            console.error('Ошибка при добавлении ответа:', error);
        }
    };

    // Закрытие вопроса
    const closeQuestion = async (questionId) => {
        try {
            await fetch(`http://localhost:5000/forums/${questionId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Решён' }),
            });
            fetchQuestions(); // Обновляем список вопросов
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
                                <h3>Тема: {q.question}</h3>
                                <p>Описание: {q.description}</p>
                                <p><strong>Пользователь:</strong> {q.user}</p>
                                <p><strong>Дата:</strong> {new Date(q.created_at).toLocaleDateString()}</p>
                                <p><strong>Статус:</strong> {q.status}</p>
                                <button className="btn" onClick={() => { setSelectedQuestion(q.id); fetchAnswers(q.id); }}>
                                    Посмотреть ответы
                                </button>
                                {q.user_id !== userId && (
                                    <button
                                        className="btn"
                                        onClick={() => {
                                            setSelectedQuestion(q.id);
                                            fetchAnswers(q.id); // Получаем ответы
                                        }}
                                    >
                                        Ответить
                                    </button>
                                )}
                                {(q.user_id === userId || userId === 0) && q.status !== 'Решён' && (
                                    <button className="btn" onClick={() => closeQuestion(q.id)}>
                                        Закрыть вопрос
                                    </button>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            </main>

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

            {selectedQuestion && (
                <div className="modal-forum">
                    <div className="modal-content">
                        <h3>Ответы</h3>
                        <div className="answers">
                            {answers.map((a) => (
                                <div key={a.id} className="answer">
                                    <p><strong>{a.user}</strong>: {a.answer}</p>
                                    <p><small>{new Date(a.created_at).toLocaleString()}</small></p>
                                </div>
                            ))}
                        </div>
                        <textarea
                            placeholder="Напишите свой ответ..."
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            rows={4}
                        ></textarea>
                        <button
                            className="btn"
                            onClick={() => addAnswer(selectedQuestion)}
                            disabled={!newAnswer.trim()}
                        >
                            Отправить ответ
                        </button>
                        <button
                            className="btn cancel-btn"
                            onClick={() => setSelectedQuestion(null)}
                        >
                            Закрыть
                        </button>
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
