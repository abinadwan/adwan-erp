document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
  if (!session) return;
  const data = loadData();
  const table = document.getElementById('leavesBody');
  const form = document.getElementById('leaveForm');
  const empSelect = document.getElementById('leaveEmployee');
  const startInput = document.getElementById('leaveStart');
  const endInput = document.getElementById('leaveEnd');

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
    data.leaves.forEach(lv => {
      const tr = document.createElement('tr');
      const emp = data.employees.find(e => e.id === lv.employeeId);
      const tdEmp = document.createElement('td'); tdEmp.textContent = emp?emp.name:''; tr.appendChild(tdEmp);
      const tdStart = document.createElement('td'); tdStart.textContent = lv.start; tr.appendChild(tdStart);
      const tdEnd = document.createElement('td'); tdEnd.textContent = lv.end; tr.appendChild(tdEnd);
      const tdStatus = document.createElement('td'); tdStatus.textContent = lv.status; tr.appendChild(tdStatus);
      const tdActions = document.createElement('td');
      if (session.role === 'Admin' && lv.status === 'Pending') {
        const approveBtn = document.createElement('button'); approveBtn.textContent = t('approve'); approveBtn.addEventListener('click', () => changeStatus(lv.id, 'Approved')); tdActions.appendChild(approveBtn);
        const rejectBtn = document.createElement('button'); rejectBtn.textContent = t('reject'); rejectBtn.addEventListener('click', () => changeStatus(lv.id, 'Rejected')); tdActions.appendChild(rejectBtn);
      }
      const delBtn = document.createElement('button'); delBtn.textContent = t('delete'); delBtn.addEventListener('click', () => del(lv.id)); tdActions.appendChild(delBtn);
      tr.appendChild(tdActions);
      table.appendChild(tr);
    });
  }

  function changeStatus(id, status) {
    const lv = data.leaves.find(l => l.id === id);
    lv.status = status;
    saveData(data);
    addAudit('update', 'leave', id);
    render();
  }

  function del(id) {
    data.leaves = data.leaves.filter(l => l.id !== id);
    saveData(data);
    addAudit('delete', 'leave', id);
    render();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const employeeId = parseInt(empSelect.value,10);
    const start = sanitize(startInput.value);
    const end = sanitize(endInput.value);
    const id = Date.now();
    data.leaves.push({ id, employeeId, start, end, status: 'Pending' });
    saveData(data);
    addAudit('create', 'leave', id);
    form.reset();
    render();
  });

  document.getElementById('export').addEventListener('click', () => exportCSV('leaves'));
  document.getElementById('print').addEventListener('click', () => window.print());

  populateEmployees();
  render();
});
