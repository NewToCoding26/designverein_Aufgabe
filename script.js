document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('input-search');
    const searchField = document.getElementById('search-field');
    const exactMatch = document.getElementById('exact-match');
    const resultsBody = document.getElementById('results-body');
    const noResultsMessage = document.getElementById('no-results');
    const tableHeaders = document.querySelectorAll('th[data-column]');

    let currentData = [];
    let currentSort = {
        column: null,
        direction: 1
    };

    function searchContacts() {
        const criteria = searchInput.value.trim();
        const field = searchField.value;
        const condition = exactMatch.checked ? 'equals' : 'like';

        if (!criteria) return;

        const payload = {
            user: "api_azubi_test",
            password: "dUb0SkqWH6MHXSsBAKkHmvJa",
            field,
            criteria,
            condition
        };

        fetch('https://azubi.dv-test.de/search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    currentData = data;
                    renderTable(data);
                    noResultsMessage.classList.add('hidden');
                } else {
                    resultsBody.innerHTML = '';
                    noResultsMessage.classList.remove('hidden');
                }
            })
            .catch(error => {
                console.error('Fehler bei der API-Anfrage:', error);
                resultsBody.innerHTML = '';
                noResultsMessage.classList.remove('hidden');
            });
    }

    function renderTable(data) {
        resultsBody.innerHTML = '';
        data.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.street}</td>
                <td>${entry.city}</td>
                <td>${entry.zip}</td>
                <td>${entry.tel}</td>
            `;
            resultsBody.appendChild(row);
        });
    }

    function sortTableBy(column) {
        if (currentSort.column === column) {
            currentSort.direction *= -1;
        } else {
            currentSort.column = column;
            currentSort.direction = 1;
        }

        const sortedData = [...currentData].sort((a, b) => {
            const valA = a[column].toLowerCase();
            const valB = b[column].toLowerCase();
            if (valA < valB) return -1 * currentSort.direction;
            if (valA > valB) return 1 * currentSort.direction;
            return 0;
        });

        renderTable(sortedData);

        document.querySelectorAll('.sort-icon').forEach(icon => icon.classList.remove('active'));
        const activeIcon = document.querySelector(`th[data-column="${column}"] .sort-icon`);
        if (activeIcon) activeIcon.classList.add('active');
    }

    // Suche beim Drücken der Enter-Taste
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchContacts();
        }
    });

    // Tabellenüberschriften klickbar machen für Sortierung
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            sortTableBy(column);
        });
    });
});

