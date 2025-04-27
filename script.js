document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('input-search');
    const searchField = document.getElementById('search-field');
    const exactMatch = document.getElementById('exact-match');
    const resultsBody = document.getElementById('results-body');
    const noResultsMessage = document.getElementById('no-results');
    const tableHeaders = document.querySelectorAll('th[data-column]');

    let currentData = [];
    let currentSort = { column: null, direction: 'asc' };

    // Add event listeners for search
    searchInput.addEventListener('input', debounce(searchContacts, 300));
    searchField.addEventListener('change', searchContacts);
    exactMatch.addEventListener('change', searchContacts);

    // Add event listeners for sorting
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            sortTable(column);
        });
    });

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
            resultsBody.innerHTML = '';
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
        if (!currentData.length) return;

        const direction = (currentSort.column === column && currentSort.direction === 'asc') ? 'desc' : 'asc';
        currentSort = { column, direction };

        currentData.sort((a, b) => {
            let valA = (a[column] || '').toString().toLowerCase();
            let valB = (b[column] || '').toString().toLowerCase();

            if (column === 'zip') {
                valA = parseInt(valA) || 0;
                valB = parseInt(valB) || 0;
                return direction === 'asc' ? valA - valB : valB - valA;
            }

            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        updateSortIcons();
        renderTable(currentData);
    }

    function updateSortIcons() {
        tableHeaders.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            const column = header.getAttribute('data-column');
            if (column === currentSort.column) {
                icon.classList.add('active');
                icon.setAttribute('name', currentSort.direction === 'asc' ? 'arrow-down' : 'arrow-up');
            } else {
                icon.classList.remove('active');
                icon.setAttribute('name', 'arrow-down');
            }
        });
    }
});