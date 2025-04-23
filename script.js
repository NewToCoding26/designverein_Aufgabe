document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('button-search');
    const searchInput = document.getElementById('input-search');
    const searchField = document.getElementById('search-field');
    const exactMatch = document.getElementById('exact-match');
    const resultsBody = document.getElementById('results-body');
    const noResultsMessage = document.getElementById('no-results');

    let currentData = [];
    let currentSort = {
        column: null,
        direction: 1 
    };

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
                    otherIcon.name = 'arrow-down';
                    otherIcon.classList.remove('active');
                }
            });

            if (currentSort.column === column) {
                currentSort.direction *= -1;
            } else {
                currentSort.column = column;
                currentSort.direction = 1;
            }

            icon.name = currentSort.direction === 1 ? 'arrow-up' : 'arrow-down';
            icon.classList.add('active');

            if (currentData.length > 0) {
                sortData();
                updateTable();
            }
        });
    });

    async function performSearch() {
        const criteria = searchInput.value.trim();
        const field = searchField.value;
        const isExactMatch = exactMatch.checked;

        if (!criteria) {
            alert('Please enter a search term');
            return;
        }

        try {
            searchButton.disabled = true;
            const originalText = searchButton.textContent;
            searchButton.innerHTML = `<span class="button-text">Searching...</span><span class="spinner"></span>`;

            const response = await fetch("https://azubi.dv-test.de/search/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: "api_azubi_test",
                    password: "dUb0SkqWH6MHXSsBAKkHmvJa",
                    field: field,
                    criteria: criteria,
                    condition: isExactMatch ? 'equals' : 'like'
                })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            currentData = Array.isArray(data) ? data : [];
            currentSort.column = null;
            currentSort.direction = 1;
            
            document.querySelectorAll('.sort-icon').forEach(icon => {
                icon.name = 'arrow-down';
                icon.classList.remove('active');
            });

            updateTable();
            
            if (currentData.length === 0) {
                noResultsMessage.classList.remove('hidden');
            } else {
                noResultsMessage.classList.add('hidden');
            }

        } catch (error) {
            console.error("Error:", error);
            alert(`Search failed: ${error.message}`);
            resultsBody.innerHTML = '';
            noResultsMessage.classList.remove('hidden');
        } finally {
            searchButton.disabled = false;
            searchButton.textContent = 'Search';
        }
    }

    function sortData() {
        if (!currentSort.column) return;

        currentData.sort((a, b) => {
            const aValue = a[currentSort.column];
            const bValue = b[currentSort.column];
                
            if (currentSort.column === 'zip') {
                return (parseInt(aValue) - parseInt(bValue)) * currentSort.direction;
            }
            return aValue.localeCompare(bValue) * currentSort.direction;
        });
    }

    function updateTable() {
        resultsBody.innerHTML = '';

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