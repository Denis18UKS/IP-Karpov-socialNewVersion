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
import { format } from 'date-fns'; // Форматирование дат
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
        labels: statistics.map((item) => {
            const date = new Date(item.date);
            return format(date, 'd MMMM yyyy', { locale: ru }); // Форматируем дату как "1 декабря 2024"
        }),
        datasets: [
            {
                label: 'Количество зарегистрированных пользователей',
                data: statistics.map((item) => item.user_count),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                borderRadius: 5,
            },
        ],
    };

    // Опции для диаграммы
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Дата',
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    padding: 10,
                },
                grid: {
                    display: false,
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
                    color: 'rgba(200, 200, 200, 0.2)',
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
                text: 'Регистрация пользователей по дням',
                font: {
                    size: 16,
                    weight: 'bold',
                },
                padding: 20,
            },
        },
    };

    // Генерация PDF
    const downloadPDF = () => {
        const doc = new jsPDF();

        // Используем стандартный шрифт
        doc.setFont('times', 'normal'); // Times поддерживает Unicode

        doc.setFontSize(16);
        doc.text('Statistics Register Users', 10, 10);

        // Подготовка данных для таблицы
        const tableData = statistics.map((item) => [
            format(new Date(item.date), 'd MMMM yyyy'),
            item.user_count,
        ]);

        doc.autoTable({
            head: [['Date', 'Counts Users']],
            body: tableData,
            startY: 20,
        });

        // Сохранение PDF
        doc.save('Статистика_пользователей.pdf');
    };

    return (
        <main>
            <div style={{ width: '90%', maxWidth: '800px', margin: '0 auto', height: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#ff6f91' }}>
                    Статистика пользователей
                </h2>
                <Bar data={data} options={options} />
                <button
                    onClick={downloadPDF}
                    style={{
                        marginTop: '20px',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Скачать статистику в PDF
                </button>
            </div>
        </main>
    );
};

export default StatisticsPage;
