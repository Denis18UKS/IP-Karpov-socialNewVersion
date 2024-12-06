import React, { useState, useEffect } from "react";
import axios from "axios";

const HackathonsPage = () => {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const parseHackathons = async () => {
        try {
            // Запрос на сервер, который использует Puppeteer для парсинга
            const response = await axios.get("http://localhost:5000/hackathons");
            setHackathons(response.data);
        } catch (err) {
            setError("Ошибка при загрузке хакатонов. Попробуйте позже.");
            console.error("Ошибка парсинга:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        parseHackathons();
    }, []);

    if (loading) {
        return <p>Загрузка хакатонов...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Список хакатонов</h1>
            {hackathons.length === 0 ? (
                <p>Нет доступных хакатонов</p>
            ) : (
                <ul>
                    {hackathons.map((hackathon, index) => (
                        <li key={index}>
                            <h2>{hackathon.title}</h2>
                            <p>{hackathon.description}</p>
                            <p>{hackathon.date}</p>
                            <p>{hackathon.location}</p>
                            {hackathon.link && (
                                <a
                                    href={hackathon.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Подробнее
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HackathonsPage;
