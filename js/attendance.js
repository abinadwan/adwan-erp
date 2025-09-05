document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
  if (!session) return;
  const data = loadData();
  const table = document.getElementById('attendanceBody');
  const form = document.getElementById('attForm');
  const empSelect = document.getElementById('attEmployee');
  const dateInput = document.getElementById('attDate');
  const statusSelect = document.getElementById('attStatus');

  function populateEmployees() {
    data.employees.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.id;
      opt.textContent = e.name;
      empSelect.appendChild(opt);
    });
  }

  function clearTable() { while (table.firstChild) table.removeChild(table.firstChild); }

  function render() {
    clearTable();
    data.attendance.forEach(rec => {
      const tr = document.createElement('tr');
      const emp = data.employees.find(e => e.id === rec.employeeId);
      const tdEmp = document.createElement('td'); tdEmp.textContent = emp?emp.name:''; tr.appendChild(tdEmp);
      const tdDate = document.createElement('td'); tdDate.textContent = rec.date; tr.appendChild(tdDate);
      const tdStatus = document.createElement('td'); tdStatus.textContent = rec.status; tr.appendChild(tdStatus);
      const tdActions = document.createElement('td');
      const delBtn = document.createElement('button'); delBtn.textContent = t('delete'); delBtn.addEventListener('click', () => del(rec.id)); tdActions.appendChild(delBtn);
      tr.appendChild(tdActions);
      table.appendChild(tr);
    });
  }

  function del(id) {
    data.attendance = data.attendance.filter(a => a.id !== id);
    saveData(data);
    addAudit('delete', 'attendance', id);
    render();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const employeeId = parseInt(empSelect.value,10);
    const date = sanitize(dateInput.value);
    const status = sanitize(statusSelect.value);
    const id = Date.now();
    data.attendance.push({ id, employeeId, date, status });
    saveData(data);
    addAudit('create', 'attendance', id);
    form.reset();
    render();
  });

  document.getElementById('export').addEventListener('click', () => exportCSV('attendance'));
  document.getElementById('print').addEventListener('click', () => window.print());

  populateEmployees();
  render();
});
