import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const StatisticsPage = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/admin/statistics', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error('Ошибка при загрузке статистики:', err);
        }
    };

    const data = {
        labels: stats.map((stat) => stat.date),
        datasets: [
            {
                label: 'Количество пользователей',
                data: stats.map((stat) => stat.count),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h2>Статистика</h2>
            <Bar data={data} />
        </div>
    );
};

export default StatisticsPage;
