Индивидуальный проект "Разработка социальной сети для профессионалов"
студента группы 21-Веб-1,
Карпова Д.В
Данные о репозиториях будут браться через GitHub API

Вот как должна выглядеть таблица с репозиториями и какая логика должна быть на страницу с пользователями: 
        <div className="users">
            <h1>Список пользователей</h1>
            <ul className="users-list">
                {users.map((user, index) => (
                    <li key={index} onClick={() => fetchRepos(user)}>
                        <img src={`./images/users-avatars/${user.avatar}`} alt={`${user.name} avatar`} />
                        <div>
                            <p>{user.name}</p>
                            <hr />
                            <h6>
                                <i>{user.skills.join(', ')}</i>
                            </h6>
                        </div>
                    </li>
                ))}
            </ul>

            {selectedUser && (
                <div className="user-repos">
                    <h2>Репозитории пользователя: {selectedUser.name}</h2>
                    {loadingRepos ? (
                        <p>Загрузка репозиториев...</p>
                    ) : repos.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Репозиторий</th>
                                    <th>Коммиты</th>
                                    <th>Ветки</th>
                                    <th>Файлы</th>
                                    <th>Действия</th>
                                    <th>Дата создания</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repos.map((repo) => (
                                    <tr key={repo.id}>
                                        <td>
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="repo-link"
                                            >
                                                {repo.name}
                                            </a>
                                        </td>
                                        <td>
                                            <button onClick={() => fetchCommits(repo.name)} className="small-button">
                                                Показать коммиты
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => fetchBranches(repo.name)} className="small-button">
                                                Показать ветки
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => fetchFiles(repo.name)} className="small-button">
                                                Посмотреть файлы
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => window.open(`${repo.html_url}/archive/refs/heads/${repo.default_branch}.zip`)}
                                                className="small-button"
                                            >
                                                Скачать
                                            </button>
                                        </td>
                                        <td>{new Date(repo.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>У пользователя нет репозиториев или превышен лимит запросов</p>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>Репозиторий: {selectedRepo}</h2>
                        {modalType === 'commits' && (
                            loadingCommits ? (
                                <p>Загрузка коммитов...</p>
                            ) : commits.length > 0 ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Автор</th>
                                            <th>Сообщение</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commits.map((commit, index) => (
                                            <tr key={index}>
                                                <td>{commit.commit.author.name}</td>
                                                <td>{commit.commit.message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Коммитов не найдено или произошла ошибка.</p>
                            )
                        )}
                        {modalType === 'files' && (
                            branches.length > 0 ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Имя файла</th>
                                            <th>Тип</th>
                                            <th>Ссылка</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {branches.map((file) => (
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
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Файлов не найдено или произошла ошибка.</p>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;