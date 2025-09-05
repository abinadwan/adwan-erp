document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
  if (!session) return;
  const data = loadData();
  const table = document.getElementById('departmentsBody');
  const form = document.getElementById('deptForm');
  const nameInput = document.getElementById('deptName');

  function clearTable() { while (table.firstChild) table.removeChild(table.firstChild); }

  function render() {
    clearTable();
    data.departments.forEach(dep => {
      const tr = document.createElement('tr');
      const tdName = document.createElement('td'); tdName.textContent = dep.name; tr.appendChild(tdName);
      const tdActions = document.createElement('td');
      const editBtn = document.createElement('button'); editBtn.textContent = t('edit'); editBtn.addEventListener('click', () => edit(dep.id)); tdActions.appendChild(editBtn);
      const delBtn = document.createElement('button'); delBtn.textContent = t('delete'); delBtn.addEventListener('click', () => del(dep.id)); tdActions.appendChild(delBtn);
      tr.appendChild(tdActions);
      table.appendChild(tr);
    });
  }

  function edit(id) {
    const dep = data.departments.find(d => d.id === id);
    nameInput.value = dep.name;
    form.dataset.editId = id;
  }

  function del(id) {
    data.departments = data.departments.filter(d => d.id !== id);
    saveData(data);
    addAudit('delete', 'department', id);
    render();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = sanitize(nameInput.value.trim());
    if (form.dataset.editId) {
      const dep = data.departments.find(d => d.id === parseInt(form.dataset.editId,10));
      dep.name = name;
      addAudit('update', 'department', dep.id);
    } else {
      const id = Date.now();
      data.departments.push({ id, name });
      addAudit('create', 'department', id);
    }
    saveData(data);
    form.reset();
    delete form.dataset.editId;
    render();
  });

  document.getElementById('export').addEventListener('click', () => exportCSV('departments'));
  document.getElementById('print').addEventListener('click', () => window.print());

  render();
});
