import React, { useState, useEffect } from "react";
import './css-v2/HomePage.css'; // Импортируем CSS файл

const HomePage = ({ isAuthenticated }) => {
    const [news, setNews] = useState([]);
    const [posts, setPosts] = useState([]);
    const [showMoreNews, setShowMoreNews] = useState(false);
    const [showMorePosts, setShowMorePosts] = useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    // Формы для новостей и постов
    const [newsForm, setNewsForm] = useState({
        title: "",
        description: "",
        image_url: "",
        link: "",
        file: null
    });

    const [postForm, setPostForm] = useState({
        title: "",
        description: "",
        image_url: "",
        file: null
    });

    // Загружаем новости и посты при монтировании компонента
    useEffect(() => {
        fetch("http://localhost:5000/news")
            .then(response => response.json())
            .then(data => setNews(data))
            .catch(error => console.error("Ошибка при загрузке новостей:", error));

        fetch("http://localhost:5000/posts")
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error("Ошибка при загрузке постов:", error));
    }, []);

    const toggleShowMoreNews = () => setShowMoreNews(!showMoreNews);
    const toggleShowMorePosts = () => setShowMorePosts(!showMorePosts);

    // Функция для отправки формы новостей
    const submitNewsForm = () => {
        const formData = new FormData();
        formData.append("title", newsForm.title);
        formData.append("description", newsForm.description);
        formData.append("link", newsForm.link);
        if (newsForm.file) {
            formData.append("file", newsForm.file);
        }

        // Получаем токен из localStorage или другого места
        const token = localStorage.getItem('token');

        fetch("http://localhost:5000/news", {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}` // Добавляем токен в заголовок
            },
        })
            .then((response) => {
                if (response.ok) {
                    alert("Новость добавлена!");
                    setIsNewsModalOpen(false);
                    setNewsForm({ title: "", description: "", image_url: "", link: "", file: null });
                    return fetch("http://localhost:3000/news").then((res) => res.json()).then(setNews);
                } else {
                    alert('Ошибка авторизации. Пожалуйста, войдите в систему.');
                }
            })
            .catch((error) => console.error("Ошибка при добавлении новости:", error));
    };


    // Функция для отправки формы поста
    const submitPostForm = () => {
        const formData = new FormData();
        formData.append("title", postForm.title);
        formData.append("description", postForm.description);
        if (postForm.file) {
            formData.append("file", postForm.file);
        }

        fetch("http://localhost:3000/posts", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    alert("Пост добавлен!");
                    setIsPostModalOpen(false);
                    setPostForm({ title: "", description: "", image_url: "", file: null });
                    return fetch("http://localhost:3000/posts").then((res) => res.json()).then(setPosts);
                }
            })
            .catch((error) => console.error("Ошибка при добавлении поста:", error));
    };

    // В компоненте, где рендерятся новости и посты:
    const renderCards = (items, showMore) => {
        if (items.length === 0) {
            return <p className="no-items">Нет данных</p>;
        }
        const visibleItems = showMore ? items : items.slice(0, 6);
        return visibleItems.map((item) => (
            <div key={item.id} className="card">
                <img src={`http://localhost:5000${item.image_url}`} alt={item.title} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        Подробнее
                    </a>
                )}
                <span>Автор: {item.user}</span>
            </div>
        ));
    };


    // Обработка изменения данных формы новостей
    const handleNewsFormChange = (e) => {
        setNewsForm({ ...newsForm, [e.target.name]: e.target.value });
    };

    // Обработка изменения данных формы постов
    const handlePostFormChange = (e) => {
        setPostForm({ ...postForm, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <main>
                <section className="hero">
                    <h2>Добро пожаловать на наш проект!</h2>
                    <p>Здесь вы можете авторизоваться, зарегистрироваться и просмотреть Мой Профиль.</p>
                </section>

                <section className="news-section">
                    <h2>Новости</h2>
                    <div className="cards-container">{renderCards(news, showMoreNews)}</div>
                    {news.length > 6 && (
                        <button onClick={toggleShowMoreNews}>
                            {showMoreNews ? "Скрыть" : "Показать больше"}
                        </button>
                    )}
                    {/* Условный рендеринг для кнопки "Добавить новость" */}
                    {isAuthenticated && (
                        <button className="add-button-news" onClick={() => setIsNewsModalOpen(true)}>
                            Добавить новость
                        </button>
                    )}
                </section>

                <section className="posts-section">
                    <h2>Посты</h2>
                    <div className="cards-container">{renderCards(posts, showMorePosts)}</div>
                    {posts.length > 6 && (
                        <button onClick={toggleShowMorePosts}>
                            {showMorePosts ? "Скрыть" : "Показать больше"}
                        </button>
                    )}
                    {/* Условный рендеринг для кнопки "Создать пост" */}
                    {isAuthenticated && (
                        <button className="add-button-post" onClick={() => setIsPostModalOpen(true)}>
                            Создать пост
                        </button>
                    )}
                </section>
            </main>

            <footer>
                <p>&copy; 2024 IT-BIRD. Все права защищены.</p>
            </footer>

            {/* Модальное окно для добавления новостей */}
            {isNewsModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Добавить новость</h2>
                        <input
                            type="text"
                            name="title"
                            value={newsForm.title}
                            onChange={handleNewsFormChange}
                            placeholder="Название"
                        />
                        <textarea
                            name="description"
                            value={newsForm.description}
                            onChange={handleNewsFormChange}
                            placeholder="Описание"
                        />
                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={(e) => setNewsForm({ ...newsForm, file: e.target.files[0] })}
                        />
                        <input
                            type="text"
                            name="link"
                            value={newsForm.link}
                            onChange={handleNewsFormChange}
                            placeholder="Ссылка"
                        />
                        <button onClick={submitNewsForm}>Сохранить</button>
                        <button onClick={() => setIsNewsModalOpen(false)}>Отмена</button>
                    </div>
                </div>
            )}

            {/* Модальное окно для добавления постов */}
            {isPostModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Создать пост</h2>
                        <input
                            type="text"
                            name="title"
                            value={postForm.title}
                            onChange={handlePostFormChange}
                            placeholder="Название"
                        />
                        <textarea
                            name="description"
                            value={postForm.description}
                            onChange={handlePostFormChange}
                            placeholder="Описание"
                        />
                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={(e) => setPostForm({ ...postForm, file: e.target.files[0] })}
                        />
                        <button onClick={submitPostForm}>Сохранить</button>
                        <button onClick={() => setIsPostModalOpen(false)}>Отмена</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
