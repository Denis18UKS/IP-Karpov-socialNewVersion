import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfilePage = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/users/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Пользователь не найден");
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Ошибка при загрузке профиля:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    if (loading) return <p>Загрузка профиля...</p>;
    if (!user) return <p>Профиль не найден</p>;

    return (
        <div>
            <h1>Профиль пользователя {user.username}</h1>
            <img src={user.avatar || "./images/default-avatar.jpg"} alt={`${user.username}'s avatar`} />
            <h2>{user.username}</h2>
            <p>Навыки: {user.skills || "Не указаны"}</p>
            {/* Здесь можно добавить другие детали профиля */}
        </div>
    );
};

export default UserProfilePage;
