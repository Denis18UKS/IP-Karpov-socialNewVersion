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
import { format } from 'date-fns';
import jsPDF from 'jspdf';
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

    const data = {
        labels: statistics.map((item) => {
            const date = new Date(item.date);
            return format(date, 'd MMMM yyyy', { locale: ru });
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

    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Statistics Register Users', 14, 20);

        const tableData = statistics.map((item) => [
            format(new Date(item.date), 'd MMMM yyyy'),
            item.user_count,
        ]);
        doc.autoTable({
            head: [['Date', 'Count Register Users']],
            body: tableData,
            startY: 30,
        });

        doc.save('StatRegUsers.pdf');
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
                        display: 'block',
                        margin: '20px auto',
                        padding: '12px 24px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, background-color 0.3s',
                    }}
                    onMouseOver={(e) =>
                        (e.target.style.backgroundColor = '#218838')
                    }
                    onMouseOut={(e) =>
                        (e.target.style.backgroundColor = '#28a745')
                    }
                    onMouseDown={(e) =>
                        (e.target.style.transform = 'scale(0.95)')
                    }
                    onMouseUp={(e) =>
                        (e.target.style.transform = 'scale(1)')
                    }
                >
                    Скачать статистику в PDF
                </button>
            </div>
        </main>
    );
};

export default StatisticsPage;
