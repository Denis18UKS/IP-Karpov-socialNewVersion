import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './css-v2/MyProfilePage.css'; // Импортируем CSS файл


const MyProfilePage = () => {
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
                const response = await fetch("http://localhost:5000/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Ошибка при загрузке профиля");
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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");  // Удаляем username при выходе
        navigate("/login");
    };

    const handleEditProfile = () => {
        navigate("/profile/edit");
    };

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

    const fetchBranches = async (repoName) => {
        setModalType("branches");
        setIsModalOpen(true);
        try {
            const response = await fetch(
                `https://api.github.com/repos/${user.github_username}/${repoName}/branches`
            );
            const data = await response.json();
            setBranches(data);
            setSelectedRepo(repoName);
        } catch (error) {
            console.error("Ошибка при получении веток:", error);
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

    const handleDeleteAvatar = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/profile/avatar", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setUser(prevState => ({ ...prevState, avatar: null }));
            } else {
                throw new Error("Ошибка при удалении аватара");
            }
        } catch (error) {
            console.error("Ошибка при удалении аватара:", error);
        }
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (!user) {
        return <p>Ошибка загрузки данных пользователя</p>;
    }

    // Получаем имя текущего пользователя из локального хранилища
    const currentUserUsername = localStorage.getItem("username");

    return (
        <div>
            <main id="profile-content">
                <section id="profile-img">
                    <div id="controlling-profile">
                        <img
                            src={user.avatar ? `http://localhost:5000${user.avatar}` : "./images/default-avatar.png"}
                            alt={`${user.username}'s avatar`}
                        />
                        <button onClick={handleEditProfile}>Редактировать профиль</button>
                        {user.avatar && (
                            <button onClick={handleDeleteAvatar} className="delete-avatar-btn">
                                Удалить аватар
                            </button>
                        )}
                    </div>
                    <div id="skills">
                        <h2>{user.username}</h2>
                        <p>Навыки: {user.skills || "Не указаны"}</p>
                        {/* Скрываем кнопку "Написать" для текущего пользователя */}
                        {user.username === currentUserUsername && (
                            <button onClick={() => navigate("/chats")}>Написать</button>
                        )}
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
                                                    <button onClick={() => fetchCommits(repo.name)} className="small-button">
                                                        Показать коммиты
                                                    </button>
                                                </td>
                                                <td>
                                                    <button onClick={() => fetchFiles(repo.name)} className="small-button">
                                                        Посмотреть файлы
                                                    </button>
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
                <div id="bg-blur-modal">
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close-button" onClick={closeModal}>
                                &times;
                            </span>
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfilePage;
