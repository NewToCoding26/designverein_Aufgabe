document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('button-search');
    const searchInput = document.getElementById('input-search');
    const searchField = document.getElementById('search-field');
    const exactMatch = document.getElementById('exact-match');
    const resultsBody = document.getElementById('results-body');
    const noResultsMessage = document.getElementById('no-results');
    const spinner = document.querySelector('.spinner');
    const buttonText = document.querySelector('.button-text');

    let currentData = [];
    let currentSort = {
        column: null,
        direction: 'asc'
    };

    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.classList.add('active');
    });

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    document.querySelectorAll('th').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.dataset.column;
            const icon = th.querySelector('.sort-icon');
            
            document.querySelectorAll('.sort-icon').forEach(otherIcon => {
                if (otherIcon !== icon) {
                    otherIcon.classList.remove('asc', 'desc');
                }
            });

            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }

            icon.classList.remove('asc', 'desc');
            icon.classList.add(currentSort.direction);

            if (currentData.length > 0) {
                sortData();
                updateTable();
            }
        });
    });

    async function performSearch() {
        const searchTerm = searchInput.value.trim();
        const field = searchField.value;
        const isExactMatch = exactMatch.checked;

        if (!searchTerm) {
            alert('Please enter a search term');
            return;
        }

        try {
            searchButton.disabled = true;
            spinner.classList.remove('hidden');
            buttonText.classList.add('hidden');

            const requestData = {
                user: "api_azubi_test",
                password: "dUb0SkqWH6MHXSsBAKkHmvJa",
                field: field,
                criteria: searchTerm,
                condition: isExactMatch ? 'equals' : 'like'
            };

            const response = await fetch("https://azubi.dv-test.de/search/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            currentData = Array.isArray(data) ? data : [];
            currentSort.column = null;
            currentSort.direction = 'asc';

            document.querySelectorAll('.sort-icon').forEach(icon => {
                icon.classList.remove('asc', 'desc');
            });

            updateTable();
            
            if (currentData.length === 0) {
                noResultsMessage.classList.remove('hidden');
            } else {
                noResultsMessage.classList.add('hidden');
            }

        } catch (error) {
            console.error('Search error:', error);
            alert(`Search failed: ${error.message}`);
            resultsBody.innerHTML = '';
            noResultsMessage.classList.remove('hidden');
        } finally {
            searchButton.disabled = false;
            spinner.classList.add('hidden');
            buttonText.classList.remove('hidden');
        }
    }

    function sortData() {
        if (!currentSort.column) return;

        currentData.sort((a, b) => {
            const aValue = a[currentSort.column];
            const bValue = b[currentSort.column];

            if (currentSort.column === 'zip') {
                const numA = parseInt(aValue);
                const numB = parseInt(bValue);
                return currentSort.direction === 'asc' ? numA - numB : numB - numA;
            }

            const comparison = aValue.localeCompare(bValue);
            return currentSort.direction === 'asc' ? comparison : -comparison;
        });
    }

    function updateTable() {
        resultsBody.innerHTML = '';

        if (currentData.length === 0) {
            noResultsMessage.classList.remove('hidden');
            return;
        }

        noResultsMessage.classList.add('hidden');

        currentData.forEach(contact => {
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
});