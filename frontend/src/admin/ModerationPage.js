import React, { useState, useEffect } from 'react';

const ModerationPage = () => {
    const [news, setNews] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchNews();
        fetchPosts();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/admin/news', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setNews(data);
        } catch (err) {
            console.error('Ошибка при загрузке новостей:', err);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch('/admin/posts', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            console.error('Ошибка при загрузке постов:', err);
        }
    };

    const handleStatusChange = async (id, type, status) => {
        try {
            await fetch(`/admin/${type}/${id}/status`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (type === 'news') fetchNews();
            else fetchPosts();
        } catch (err) {
            console.error('Ошибка при обновлении статуса:', err);
        }
    };

    return (
        <div>
            <h2>Модерация контента</h2>
            <section>
                <h3>Новости</h3>
                {news.map((item) => (
                    <div key={item.id}>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <button onClick={() => handleStatusChange(item.id, 'news', 'accepted')}>Принять</button>
                        <button onClick={() => handleStatusChange(item.id, 'news', 'rejected')}>Отклонить</button>
                    </div>
                ))}
            </section>
            <section>
                <h3>Посты</h3>
                {posts.map((item) => (
                    <div key={item.id}>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <button onClick={() => handleStatusChange(item.id, 'posts', 'accepted')}>Принять</button>
                        <button onClick={() => handleStatusChange(item.id, 'posts', 'rejected')}>Отклонить</button>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default ModerationPage;
