document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
  if (!session) return;
  const data = loadData();
  const table = document.getElementById('auditBody');

  function clearTable() { while (table.firstChild) table.removeChild(table.firstChild); }

  function render() {
    clearTable();
    data.audit.forEach(log => {
      const tr = document.createElement('tr');
      ['time','action','entity','detail'].forEach(key => {
        const td = document.createElement('td'); td.textContent = log[key] || ''; tr.appendChild(td);
      });
      table.appendChild(tr);
    });
  }

  document.getElementById('export').addEventListener('click', () => exportCSV('audit'));
  document.getElementById('print').addEventListener('click', () => window.print());

  render();
});
