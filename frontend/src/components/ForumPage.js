import React, { useState } from 'react';
import './css-v2/ForumPage.css'; // Импортируем CSS файл

const initialQuestions = [
    {
        id: 1,
        title: 'Как работать с API?',
        description: 'Не могу понять, как правильно обращаться к REST API.',
        user: 'Иван Иванов',
        date: '20.11.2024',
        status: 'Открыт',
        answers: [{ user: 'Максим', text: 'Через AJAX "прикреплён файл/скрин"' }],
    },
    {
        id: 2,
        title: 'Ошибка в JavaScript',
        description: 'У меня возникает ошибка "undefined is not a function". Что это может быть?',
        user: 'Петр Петров',
        date: '19.11.2024',
        status: 'Решён',
        answers: [{ user: 'Максим', text: 'Неизвестная функция' }],
    },
];

const Forum = () => {
    const [questions, setQuestions] = useState(initialQuestions);
    const [showModal, setShowModal] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ title: '', description: '' });

    const addQuestion = (e) => {
        e.preventDefault();
        if (newQuestion.title && newQuestion.description) {
            setQuestions((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    title: newQuestion.title,
                    description: newQuestion.description,
                    user: 'Вы',
                    date: new Date().toLocaleDateString(),
                    status: 'Открыт',
                    answers: [],
                },
            ]);
            setShowModal(false);
            setNewQuestion({ title: '', description: '' });
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

                    {/* Список вопросов */}
                    <div className="questions">
                        {questions.map((q) => (
                            <article key={q.id} className={`question ${q.status === 'Решён' ? 'resolved' : ''}`}>
                                <h3>Тема: {q.title}</h3>
                                <p>Описание: {q.description}</p>
                                <p>
                                    <strong>Пользователь:</strong> {q.user}
                                </p>
                                <p>
                                    <strong>Дата:</strong> {q.date}
                                </p>
                                <p>
                                    <strong>Статус:</strong> {q.status}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            {/* Модальное окно */}
            {showModal && (
                <div className="modal">
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
