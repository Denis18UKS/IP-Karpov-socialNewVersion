import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CommitsPage = () => {
    const { username, repoName } = useParams();
    const navigate = useNavigate(); // Инициализация useNavigate
    const [commits, setCommits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCommits = async () => {
            if (!username || !repoName) {
                setError("Некорректный параметр username или repoName.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repoName)}/commits`
                );

                if (!response.ok) {
                    throw new Error(`Ошибка при получении данных: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setCommits(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Ошибка при получении коммитов:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCommits();
    }, [username, repoName]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div>
            <button onClick={() => navigate(-1)} className="back-button">Назад</button>
            <h2>Коммиты для репозитория: {repoName}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Автор</th>
                        <th>Сообщение</th>
                    </tr>
                </thead>
                <tbody>
                    {commits.length > 0 ? (
                        commits.map((commit, index) => (
                            <tr key={index}>
                                <td>{commit.commit.author.name}</td>
                                <td>{commit.commit.message}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">Коммитов не найдено</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CommitsPage;
