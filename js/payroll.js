document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
  if (!session) return;
  const data = loadData();
  const table = document.getElementById('payrollBody');
  const form = document.getElementById('payrollForm');
  const monthInput = document.getElementById('payrollMonth');

  function clearTable() { while (table.firstChild) table.removeChild(table.firstChild); }

  function render() {
    clearTable();
    data.payroll.forEach(p => {
      const tr = document.createElement('tr');
      const tdMonth = document.createElement('td'); tdMonth.textContent = p.month; tr.appendChild(tdMonth);
      const tdDate = document.createElement('td'); tdDate.textContent = p.generated; tr.appendChild(tdDate);
      table.appendChild(tr);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const month = sanitize(monthInput.value);
    const id = Date.now();
    data.payroll.push({ id, month, generated: new Date().toISOString() });
    saveData(data);
    addAudit('create', 'payroll', id);
    form.reset();
    render();
  });

  document.getElementById('export').addEventListener('click', () => exportCSV('payroll'));
  document.getElementById('print').addEventListener('click', () => window.print());

  render();
});
