import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ru } from 'date-fns/locale';

// Регистрация компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale);

const StatisticsPage = () => {
    const [statistics, setStatistics] = useState([]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch('http://localhost:5000/admin/statistics', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await response.json();
                setStatistics(data);
            } catch (err) {
                console.error('Ошибка при загрузке статистики:', err);
            }
        };

        fetchStatistics();
    }, []);

    if (!statistics || statistics.length === 0) {
        return <p>Загрузка...</p>;
    }

    // Формируем данные для диаграммы
    const data = {
        labels: statistics.map((item) => item.date), // Даты для оси X
        datasets: [
            {
                label: 'Количество зарегистрированных пользователей',
                data: statistics.map((item) => item.user_count), // Количество пользователей
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                borderRadius: 5, // Скругленные края колонок
            },
        ],
    };

    // Опции для диаграммы
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Позволяет задавать высоту и ширину вручную
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month', // Группируем по месяцам
                    tooltipFormat: 'MMM yyyy',
                },
                adapters: {
                    date: {
                        locale: ru, // Устанавливаем русский язык для дат
                    },
                },
                title: {
                    display: true,
                    text: 'Месяцы',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    padding: 10,
                },
                grid: {
                    display: false, // Скрыть сетку на оси X
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Количество пользователей',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    padding: 10,
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)', // Цвет сетки
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12,
                    },
                },
            },
            title: {
                display: true,
                text: 'Регистрация пользователей по месяцам',
                font: {
                    size: 16,
                    weight: 'bold',
                },
                padding: 20,
            },
        },
    };

    return (
        <div style={{ width: '90%', maxWidth: '800px', margin: '0 auto', height: '500px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Статистика пользователей</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default StatisticsPage;
