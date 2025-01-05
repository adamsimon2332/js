document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('user-form');
    const usernameInput = document.getElementById('username-input');
    const userCards = document.getElementById('user-cards');
    const themeToggle = document.getElementById('theme-toggle');

    const API_URL = 'https://www.codewars.com/api/v1/users/';
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let darkMode = localStorage.getItem('darkMode') === 'true';

    const renderUsers = () => {
        userCards.innerHTML = '';
        users.forEach(user => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h2>${user.username}</h2>
                <p><strong>Név:</strong> ${user.name || 'N/A'}</p>
                <p><strong>Klan:</strong> ${user.clan || 'N/A'}</p>
                <p><strong>Nyelvek:</strong> ${Array.isArray(user.languages) ? user.languages.join(', ') : 'N/A'}</p>
                <p><strong>Rang:</strong> ${user.rank}</p>
                <p><strong>Honor:</strong> ${user.honor}</p>
            `;
            userCards.appendChild(card);
        });
    };

    const fetchUser = async (username) => {
        try {
            const response = await fetch(`${API_URL}${username}`);
            if (!response.ok) throw new Error('Felhasználó nem található');
            const data = await response.json();

            const languages = data.ranks?.languages
                ? Object.keys(data.ranks.languages)
                : ['N/A'];

            const user = {
                username: data.username || 'N/A',
                name: data.name || 'N/A',
                clan: data.clan || 'N/A',
                languages,
                rank: data.ranks?.overall?.name || 'N/A',
                honor: data.honor || 0
            };

            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            fetchUser(username);
            usernameInput.value = '';
        }
    });

    themeToggle.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', darkMode);

        themeToggle.textContent = darkMode ? '🌙 Mód váltása' : '🌞 Mód váltása';
    });

    if (darkMode) {
        document.body.classList.add('dark');
        themeToggle.textContent = '🌙 Mód váltása';
    } else {
        themeToggle.textContent = '🌞 Mód váltása';
    }

    renderUsers();
});
