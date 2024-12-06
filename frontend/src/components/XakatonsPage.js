import React, { useEffect, useState } from "react";
import axios from "axios";

const HackathonsPage = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const [cssLinks, setCssLinks] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHackathons = async () => {
        try {
            const response = await axios.get("http://localhost:5000/hackathons");
            setHtmlContent(response.data.html); // HTML контент
            setCssLinks(response.data.css); // CSS стили
            setImages(response.data.images); // Ссылки на изображения
        } catch (err) {
            setError("Ошибка при загрузке хакатонов. Попробуйте позже.");
            console.error("Ошибка парсинга:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHackathons();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Список хакатонов</h1>
            {/* Подключаем стили */}
            {cssLinks.map((link, index) => (
                <link key={index} rel="stylesheet" href={link} />
            ))}
            {/* Подключаем изображения */}
            {images.map((src, index) => (
                <img key={index} src={src} alt={`Hackathon Image ${index}`} style={{ display: 'none' }} />
            ))}
            {/* Выводим HTML-контент */}
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};

export default HackathonsPage;
