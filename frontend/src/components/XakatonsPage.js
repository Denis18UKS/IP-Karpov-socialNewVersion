import React from 'react';
import './css-v2/XakatonsPage.css';

const XakatonsPage = () => {
    return (
        <div>
            {/* Главная страница хакатонов */}
            <main>
                <section className="hero">
                    <h2>Тут будут IT-Хакатоны</h2>
                    <p>Они будут браться автоматически с других сайтов</p>
                </section>
            </main>

            {/* Подвал */}
            <footer>
                <p>&copy; 2024 IT-BIRD. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default XakatonsPage;
