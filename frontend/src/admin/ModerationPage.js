import React, { useState, useEffect } from "react";
import './ModerationPage.css';

const ModerationPage = () => {
    const [news, setNews] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/admin/news", {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then(response => response.json())
            .then(data => {
                console.log("Новости из API:", data); // Отладка
                setNews(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error("Ошибка при загрузке новостей:", error);
                alert('Произошла ошибка при загрузке новостей. Попробуйте позже.');
            });

        fetch("http://localhost:5000/admin/posts", {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then(response => response.json())
            .then(data => {
                console.log("Посты из API:", data); // Отладка
                setPosts(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error("Ошибка при загрузке постов:", error);
                alert('Произошла ошибка при загрузке постов. Попробуйте позже.');
            });
    }, []);

    const handleDelete = async (id, type) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/${type}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении');
            }

            // Обновляем данные после успешного удаления
            if (type === "news") {
                const data = await fetch("http://localhost:5000/admin/news", {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }).then(response => response.json());
                setNews(data); // Обновляем новости
                alert('Новость удалена');
            } else {
                const data = await fetch("http://localhost:5000/admin/posts", {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }).then(response => response.json());
                setPosts(data); // Обновляем посты
                alert('Пост удалён');
            }
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            alert('Произошла ошибка при удалении. Попробуйте снова.');
        }
    };



    const handleStatusChange = async (id, type, status) => {
        await fetch(`http://localhost:5000/admin/${type}/${id}/status`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });
        if (type === "news") {
            fetch("http://localhost:5000/admin/news")
                .then(response => response.json())
                .then(data => setNews(data));
        } else {
            fetch("http://localhost:5000/admin/posts")
                .then(response => response.json())
                .then(data => setPosts(data));
        }
    };

    const renderModerationCards = (items, type) => {
        if (!Array.isArray(items) || items.length === 0) {
            return <p className="no-items">{type === 'news' ? 'Нет новостей для модерации' : 'Нет постов для модерации'}</p>;
        }

        return items.map((item) => (
            <div key={item.id} className="card">
                {item.image_url && item.image_url !== "null" ? (
                    <img
                        src={`http://localhost:5000${item.image_url}`}
                        alt={item.title}
                    />
                ) : (
                    <div className="no-image">Нет изображения</div>
                )}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p><strong>Автор:</strong> {item.user}</p>
                <p><strong>Статус:</strong> {item.status}</p>
                <div className="moderation-buttons">
                    {item.status === "ожидание" && (
                        <>
                            <button
                                className="accept-btn"
                                onClick={() => handleStatusChange(item.id, type, "принят")}
                            >
                                Принять
                            </button>
                            <button
                                className="reject-btn"
                                onClick={() => handleStatusChange(item.id, type, "отклонен")}
                            >
                                Отклонить
                            </button>
                        </>
                    )}
                    {item.status === "отклонен" && (
                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(item.id, type)}
                        >
                            Удалить
                        </button>
                    )}
                </div>
            </div>
        ));
    };




    return (
        <div>
            <main>
                <section className="moderation-section">
                    <h2>Модерация новостей</h2>
                    <div className="cards-container news-cards">
                        {renderModerationCards(news, "news")}
                    </div>
                </section>

                <section className="moderation-section">
                    <h2>Модерация постов</h2>
                    <div className="cards-container posts-cards">
                        {renderModerationCards(posts, "posts")}
                    </div>
                </section>
            </main>

            <footer>
                <p>&copy; 2024 IT-BIRD. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default ModerationPage;
