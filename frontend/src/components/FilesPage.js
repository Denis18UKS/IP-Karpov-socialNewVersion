import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FilesPage = () => {
    const { username, repoName } = useParams();
    const navigate = useNavigate(); // Инициализация useNavigate
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents`);
                const data = await response.json();
                setFiles(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Ошибка при получении файлов:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [username, repoName]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <button onClick={() => navigate(-1)} className="back-button">Назад</button>
            <h2>Файлы для репозитория: {repoName}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Имя файла</th>
                        <th>Тип</th>
                        <th>Ссылка</th>
                    </tr>
                </thead>
                <tbody>
                    {files.length > 0 ? (
                        files.map((file) => (
                            <tr key={file.sha}>
                                <td>{file.name}</td>
                                <td>{file.type}</td>
                                <td>
                                    {file.type === 'file' ? (
                                        <a href={file.download_url} target="_blank" rel="noopener noreferrer">
                                            Скачать
                                        </a>
                                    ) : (
                                        <span>Папка</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Файлов не найдено</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FilesPage;
