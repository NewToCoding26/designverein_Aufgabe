document.querySelectorAll('.sort-icon').forEach(icon => {
    icon.addEventListener('click', function () {
      const th = this.closest('th');
      const table = th.closest('table');
      const tbody = table.querySelector('tbody');
      const columnIndex = [...th.parentNode.children].indexOf(th);
      const isAsc = this.getAttribute('name') === 'arrow-down';
      const cleanType = th.dataset.clean;
  
      const rows = Array.from(tbody.querySelectorAll('tr'));
      rows.sort((a, b) => {
        const cellA = a.children[columnIndex].textContent.trim();
        const cellB = b.children[columnIndex].textContent.trim();
  
        if (cleanType === 'number') {
          const numA = parseInt(cellA.replace(/\D/g, ''));
          const numB = parseInt(cellB.replace(/\D/g, ''));
          return isAsc ? numA - numB : numB - numA;
        } else {
          return isAsc
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
        }
      });
  
      tbody.innerHTML = '';
      rows.forEach(row => tbody.appendChild(row));
  
      document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.setAttribute('name', 'arrow-down');
        icon.classList.remove('active');
      });
  
      this.setAttribute('name', isAsc ? 'arrow-up' : 'arrow-down');
      this.classList.add('active');
    });
  });
  


  document.getElementById('button-search').addEventListener('click', async () => {
    const field = document.getElementById('search-field').value;
    const criteria = document.getElementById('input-search').value.trim();

    if (!criteria) {
        alert('Bitte gib einen Suchbegriff ein.');
        return;
    }

    const requestData = {
        user: "api_azubi_test",
        password: "dUb0SkqWH6MHXSsBAKkHmvJa",
        field: field,
        criteria: criteria,
        condition: "like"  
    };

    try {
        const response = await fetch("https://azubi.dv-test.de/search/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            updateTable(data);
        } else {
            alert("Keine Kontakte gefunden.");
            clearTable();
        }
    } catch (error) {
        console.error("Fehler bei der API-Anfrage:", error);
        alert("Fehler bei der API-Anfrage. Siehe Konsole.");
    }
});

function updateTable(contacts) {
    const tbody = document.querySelector('.data-table tbody');
    tbody.innerHTML = ''; 

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
}

function clearTable() {
    const tbody = document.querySelector('.data-table tbody');
    tbody.innerHTML = '';
}

const condition = document.getElementById('exact-match').checked ? 'equals' : 'like';
