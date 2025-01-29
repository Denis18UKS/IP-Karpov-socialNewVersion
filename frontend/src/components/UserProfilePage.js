import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './css-v2/MyProfilePage.css'; // Импортируем CSS файл
import { Link } from "react-router-dom"
const UserProfilePage = () => {
    const { username } = useParams(); // Получаем имя пользователя из URL
    const [user, setUser] = useState(null);
    const [repositories, setRepositories] = useState([]);
    const [commits, setCommits] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return console.error("Токен не найден, требуется авторизация!");
            }

            try {
                const response = await fetch(`http://localhost:5000/users/${username}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Ошибка при загрузке данных пользователя");
                }

                const data = await response.json();
                setUser(data.user);
                setRepositories(data.repositories || []);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [username]);

    const fetchCommits = async (repoName) => {
        setModalType("commits");
        setIsModalOpen(true);
        try {
            const response = await fetch(
                `https://api.github.com/repos/${user.github_username}/${repoName}/commits`
            );
            const data = await response.json();
            setCommits(Array.isArray(data) ? data : []);
            setSelectedRepo(repoName);
        } catch (error) {
            console.error("Ошибка при получении коммитов:", error);
        }
    };

    const fetchFiles = async (repoName) => {
        setModalType("files");
        setIsModalOpen(true);
        try {
            const response = await fetch(
                `https://api.github.com/repos/${user.github_username}/${repoName}/contents`
            );
            const data = await response.json();
            setBranches(Array.isArray(data) ? data : []);
            setSelectedRepo(repoName);
        } catch (error) {
            console.error("Ошибка при получении файлов:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCommits([]);
        setBranches([]);
        setSelectedRepo(null);
    };

    const handleDownload = (repoName) => {
        fetch(`http://localhost:5000/github/repos/${user.github_username}/${repoName}/download`, {
            method: 'GET',
        })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${repoName}.zip`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => {
                console.error('Ошибка при скачивании репозитория:', error);
            });
    };

    // Закрыть модальное окно при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event) => {
            const modal = document.querySelector('.modal');
            const modalContent = document.querySelector('.modal-content');

            if (modal && !modalContent.contains(event.target)) {
                closeModal();
            }
        };

        // Добавляем обработчик события
        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Убираем обработчик при размонтировании компонента
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return <p>Ошибка загрузки данных пользователя</p>;
    }

    return (
        <div>
            <main id="profile-content">
                <section id="profile-img">
                    <div id="controlling-profile">
                        <img
                            src={user.avatar ? `http://localhost:5000${user.avatar}` : "/images/default-avatar.png"}
                            alt={`${user.username}'s avatar`}
                        />
                    </div>
                    <div id="skills">
                        <h2>{user.username}</h2>
                        <p>Навыки: {user.skills || "Не указаны"}</p>
                    </div>
                </section>

                <hr />

                <section id="repositories">
                    {repositories.length > 0 ? (
                        <>
                            <h2>Репозитории "{user.username}"</h2>
                            <div className="scroll-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Репозиторий</th>
                                            <th>Коммиты</th>
                                            <th>Файлы</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {repositories.map((repo) => (
                                            <tr key={repo.name}>
                                                <td>
                                                    <a
                                                        href={`https://github.com/${user.github_username}/${repo.name}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {repo.name}
                                                    </a>
                                                </td>
                                                <td>
                                                    <Link to={`/user/${user.github_username}/commits/${repo.name}`} className="btn">
                                                        Показать коммиты
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link to={`/user/${user.github_username}/files/${repo.name}`} className="btn">
                                                        Посмотреть файлы
                                                    </Link>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDownload(repo.name)}
                                                        className="small-button"
                                                    >
                                                        Скачать
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <h1>
                            <i>Нет репозиториев</i>
                        </h1>
                    )}
                </section>
            </main>

            <footer>
                <p>&copy; 2024 IT-BIRD</p>
            </footer>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>
                            &times;
                        </span>
                        <section id="table-content">
                            <h2>Репозиторий: {selectedRepo}</h2>
                            {modalType === "commits" && (
                                <table className="table">
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
                            )}
                            {modalType === "files" && (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Имя файла</th>
                                            <th>Тип</th>
                                            <th>Ссылка</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {branches.length > 0 ? (
                                            branches.map((file) => (
                                                <tr key={file.sha}>
                                                    <td>{file.name}</td>
                                                    <td>{file.type}</td>
                                                    <td>
                                                        {file.type === 'file' ? (
                                                            <a href={file.download_url} target="_blank" rel="noopener noreferrer">
                                                                Скачать
                                                            </a>
                                                        ) : (
                                                            <span>Папка</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3">Файлов не найдено</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;
