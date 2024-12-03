import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './EditProfilePage.css'

const EditProfilePage = () => {
    const [avatar, setAvatar] = useState(null);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [githubUsername, setGithubUsername] = useState("");
    const [skills, setSkills] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Пользователь не авторизован!");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Ошибка при загрузке профиля");
                }

                const data = await response.json();
                const user = data.user;

                setEmail(user.email || "");
                setUsername(user.username || "");
                setGithubUsername(user.github_username || "");
                setSkills(user.skills || "");
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProfile();
    }, []);

    const handleAvatarChange = (event) => {
        setAvatar(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Пользователь не авторизован!");
            return;
        }

        const formData = new FormData();
        if (avatar) formData.append("avatar", avatar);
        formData.append("email", email);
        formData.append("username", username);
        formData.append("github_username", githubUsername);
        formData.append("skills", skills);

        try {
            const response = await fetch("http://localhost:5000/profile/update", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Ошибка при обновлении профиля");
            }

            const data = await response.json();
            setSuccessMessage("Профиль успешно обновлен!");
            setError(null);

            setTimeout(() => {
                navigate("/profile");
            }, 2000); // Переход на страницу профиля через 2 секунды
        } catch (error) {
            setError(error.message);
            setSuccessMessage(null);
        }
    };

    return (
        <div className="edit-profile-container">
            <h1>Редактирование профиля</h1>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-group">
                    <label>Загрузить аватар:</label>
                    <input type="file" onChange={handleAvatarChange} className="file-input" />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Имя пользователя"
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>GitHub Username:</label>
                    <input
                        type="text"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="GitHub Username"
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Навыки:</label>
                    <textarea
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="Введите навыки через запятую"
                        className="textarea-field"
                    ></textarea>
                </div>

                <button type="submit" className="submit-btn">Сохранить изменения</button>
            </form>

            <button onClick={() => navigate("/profile")} className="cancel-btn">Отмена</button>
        </div>
    );
};

export default EditProfilePage;
