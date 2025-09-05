document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
  if (!session) return;
  const data = loadData();
  const table = document.getElementById('employeesBody');
  const form = document.getElementById('employeeForm');
  const nameInput = document.getElementById('empName');
  const emailInput = document.getElementById('empEmail');
  const deptSelect = document.getElementById('empDept');

  function populateDept() {
    data.departments.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.name;
      deptSelect.appendChild(opt);
    });
  }

  function clearTable() {
    while (table.firstChild) table.removeChild(table.firstChild);
  }

  function render() {
    clearTable();
    data.employees.forEach(emp => {
      const tr = document.createElement('tr');
      const tdName = document.createElement('td'); tdName.textContent = emp.name; tr.appendChild(tdName);
      const tdEmail = document.createElement('td'); tdEmail.textContent = emp.email; tr.appendChild(tdEmail);
      const dept = data.departments.find(d => d.id === emp.departmentId);
      const tdDept = document.createElement('td'); tdDept.textContent = dept?dept.name:''; tr.appendChild(tdDept);
      const tdActions = document.createElement('td');
      const editBtn = document.createElement('button'); editBtn.textContent = t('edit'); editBtn.addEventListener('click', () => edit(emp.id)); tdActions.appendChild(editBtn);
      const delBtn = document.createElement('button'); delBtn.textContent = t('delete'); delBtn.addEventListener('click', () => del(emp.id)); tdActions.appendChild(delBtn);
      tr.appendChild(tdActions);
      table.appendChild(tr);
    });
  }

  function edit(id) {
    const emp = data.employees.find(e => e.id === id);
    nameInput.value = emp.name;
    emailInput.value = emp.email;
    deptSelect.value = emp.departmentId;
    form.dataset.editId = id;
  }

  function del(id) {
    data.employees = data.employees.filter(e => e.id !== id);
    saveData(data);
    addAudit('delete', 'employee', id);
    render();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = sanitize(nameInput.value.trim());
    const email = sanitize(emailInput.value.trim());
    const dept = parseInt(deptSelect.value,10);
    if (!validateEmail(email)) { alert(t('invalidEmail')); return; }
    if (form.dataset.editId) {
      const emp = data.employees.find(e => e.id === parseInt(form.dataset.editId,10));
      emp.name = name; emp.email = email; emp.departmentId = dept;
      addAudit('update', 'employee', emp.id);
    } else {
      const id = Date.now();
      data.employees.push({ id, name, email, departmentId: dept });
      addAudit('create', 'employee', id);
    }
    saveData(data);
    form.reset();
    delete form.dataset.editId;
    render();
  });

  document.getElementById('export').addEventListener('click', () => exportCSV('employees'));
  document.getElementById('print').addEventListener('click', () => window.print());

  populateDept();
  render();
});
