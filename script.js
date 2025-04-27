document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('input-search');
    const searchField = document.getElementById('search-field');
    const exactMatch = document.getElementById('exact-match');
    const resultsBody = document.getElementById('results-body');
    const noResultsMessage = document.getElementById('no-results');
    const tableHeaders = document.querySelectorAll('th[data-column]');

    let currentData = [];
    let currentSort = { column: null, direction: 'asc' };

    loadStaticData();

    searchInput.addEventListener('input', debounce(searchContacts, 300));
    searchField.addEventListener('change', searchContacts);
    exactMatch.addEventListener('change', searchContacts);

    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            sortTable(column);
        });
    });

    function loadStaticData() {
        const rows = resultsBody.querySelectorAll('tr');
        currentData = Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            return {
                name: cells[0].textContent,
                street: cells[1].textContent,
                city: cells[2].textContent,
                zip: cells[3].textContent,
                tel: cells[4].textContent
            };
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async function searchContacts() {
        const criteria = searchInput.value.trim();
        const field = searchField.value;
        const condition = exactMatch.checked ? 'equals' : 'like';

        if (!criteria) {
            loadStaticData();
            renderTable(currentData);
            noResultsMessage.classList.add('hidden');
            return;
        }

        try {
            const response = await fetch('https://azubi.dv-test.de/search/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: "api_azubi_test",
                    password: "dUb0SkqWH6MHXSsBAKkHmvJa",
                    field: field,
                    criteria: criteria,
                    condition: condition
                })
            });

            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                currentData = data;
                renderTable(data);
                noResultsMessage.classList.add('hidden');
            } else {
                currentData = [];
                resultsBody.innerHTML = '';
                noResultsMessage.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            currentData = [];
            resultsBody.innerHTML = '';
            noResultsMessage.classList.remove('hidden');
        }
    }

    function renderTable(data) {
        resultsBody.innerHTML = '';

        data.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.name || '-'}</td>
                <td>${contact.street || '-'}</td>
                <td>${contact.city || '-'}</td>
                <td>${contact.zip || '-'}</td>
                <td>${contact.tel || '-'}</td>
            `;
            resultsBody.appendChild(row);
        });
    }

    function sortTable(column) {
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }

        const sortedData = [...currentData].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            if (aValue < bValue) return currentSort.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });

        renderTable(sortedData);
        updateSortIcons();
    }

    function updateSortIcons() {
        tableHeaders.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            if (!icon) return;

            const column = header.getAttribute('data-column');
            if (column === currentSort.column) {
                icon.classList.add('active');
                icon.textContent = currentSort.direction === 'asc' ? '▲' : '▼';
            } else {
                icon.classList.remove('active');
                icon.textContent = '▲';
            }
        });
    }
});
