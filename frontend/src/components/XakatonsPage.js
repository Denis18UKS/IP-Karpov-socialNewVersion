import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css-v2/XakatonsPage.css';

const XakatonsPage = () => {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);  

    const parseHackathonsFromSites = async () => {
        const urls = [
            'https://example-hackathon-site.com',
            'https://another-hackathon-site.com'
        ];

        try {
            const promises = urls.map(url => axios.get(`https://cors-anywhere.herokuapp.com/${url}`));
            const responses = await Promise.all(promises);

            const parsedHackathons = responses.flatMap(response => {
                const data = parseSite(response.data);
                return data;
            });

            setHackathons(parsedHackathons);
        } catch (error) {
            setError('Ошибка при загрузке хакатонов. Попробуйте позже.');
            console.error('Ошибка при парсинге хакатонов:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseSite = (html) => {
        const hackathons = [];
        const $ = window.$(html);  // Используем jQuery для парсинга
        $('.hackathon-card').each((index, element) => {
            const title = $(element).find('.hackathon-title').text().trim();
            const description = $(element).find('.hackathon-description').text().trim();
            const startDate = $(element).find('.hackathon-start-date').text().trim();
            const endDate = $(element).find('.hackathon-end-date').text().trim();
            const location = $(element).find('.hackathon-location').text().trim();
            const registrationLink = $(element).find('.hackathon-link').attr('href');
            const organizer = $(element).find('.hackathon-organizer').text().trim();

            hackathons.push({
                title,
                description,
                start_date: startDate,
                end_date: endDate,
                location,
                registration_link: registrationLink,
                organizer,
                status: 'Открыт',
                participants_limit: null,
                tags: '',
            });
        });
        return hackathons;
    };

    useEffect(() => {
        parseHackathonsFromSites();
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <p>Загрузка хакатонов...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <main>
                <section className="hero">
                    <h2>Список IT-Хакатонов</h2>
                    {hackathons.length === 0 ? (
                        <p>Нет доступных хакатонов</p>
                    ) : (
                        <ul>
                            {hackathons.map((hackathon) => (
                                <li key={hackathon.title} className="hackathon-item">
                                    <h3>{hackathon.title}</h3>
                                    <p>{hackathon.description}</p>
                                    <p><strong>Место:</strong> {hackathon.location}</p>
                                    <p><strong>Даты:</strong> {hackathon.start_date} - {hackathon.end_date}</p>
                                    <a href={hackathon.registration_link} target="_blank" rel="noopener noreferrer">
                                        Перейти к регистрации
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
            <footer>
                <p>&copy; 2024 IT-BIRD. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default XakatonsPage;
