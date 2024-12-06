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

    // Модальные функции для получения данных из GitHub
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

    const handleOutsideClick = (event) => {
        if (event.target.classList.contains("modal")) {
            closeModal();
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            window.addEventListener("click", handleOutsideClick);
        } else {
            window.removeEventListener("click", handleOutsideClick);
        }

        return () => {
            window.removeEventListener("click", handleOutsideClick);
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
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>Репозиторий: {selectedRepo}</h2>
                        {/* Ваши модальные данные */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfilePage;
