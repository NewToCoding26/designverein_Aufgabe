document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('th').forEach(th => {
        const icon = th.querySelector('.sort-icon');
        let sortOrder = 1;
        
        th.addEventListener('click', () => {
            document.querySelectorAll('.sort-icon').forEach(i => {
                i.name = 'arrow-down';
                i.classList.remove('active');
            });
            
            icon.name = sortOrder === 1 ? 'arrow-up' : 'arrow-down';
            icon.classList.add('active');
            
            const columnIndex = Array.from(th.parentNode.children).indexOf(th);
            const tbody = th.closest('table').querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.sort((a, b) => {
                const aText = a.children[columnIndex].textContent.trim();
                const bText = b.children[columnIndex].textContent.trim();
                
                if (th.dataset.clean === 'number') {
                    return (parseInt(aText) - parseInt(bText)) * sortOrder;
                }
                return aText.localeCompare(bText) * sortOrder;
            });
            
            rows.forEach(row => tbody.appendChild(row));
            sortOrder *= -1;
        });
    });

    document.getElementById('input-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    document.getElementById('button-search').addEventListener('click', performSearch);

    async function performSearch() {
        const criteria = document.getElementById('input-search').value.trim();
        const exactMatch = document.getElementById('exact-match').checked;

        if (!criteria) {
            alert('Please enter a search term');
            return;
        }

        try {
            const response = await fetch("https://azubi.dv-test.de/search/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `data=${encodeURIComponent(JSON.stringify({
                    user: "api_azubi_test",
                    password: "dUb0SkqWH6MHXSsBAKkHmvJa",
                    field: "city",
                    criteria: criteria,
                    condition: exactMatch ? 'equals' : 'like'
                }))}`
            });

            const data = await response.json();
            updateTable(data);
        } catch (error) {
            console.error("Error:", error);
            alert("Search failed. See console.");
        }
    }

    function updateTable(contacts) {
        const tbody = document.querySelector('.data-table tbody');
        tbody.innerHTML = '';

        if (Array.isArray(contacts) && contacts.length > 0) {
            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.name}</td>
                    <td>${contact.street}</td>
                    <td>${contact.city}</td>
                    <td>${contact.zip}</td>
                    <td>${contact.tel}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            alert("No contacts found");
        }
    }
});