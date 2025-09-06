document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireSession();
  if (!session) return;
  const data = loadData();

  const table = document.getElementById('departmentsBody');
  const form = document.getElementById('deptForm');
  const nameInput = document.getElementById('deptName');

  function clearTable() { while (table.firstChild) table.removeChild(table.firstChild); }
  async function render() {
    // 1. Clear existing table rows
    while (table.firstChild) table.removeChild(table.firstChild);

  function render() {
    clearTable();
    data.departments.forEach(dep => {
    // 2. Fetch data from Supabase
    const { data: departments, error } = await supabase
      .from('departments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching departments:', error);
      return;
    }

    // 3. Create and append new rows
    departments.forEach(dep => {
      const tr = document.createElement('tr');
      const tdName = document.createElement('td'); tdName.textContent = dep.name; tr.appendChild(tdName);
      const tdActions = document.createElement('td');
      const editBtn = document.createElement('button'); editBtn.textContent = t('edit'); editBtn.addEventListener('click', () => edit(dep.id)); tdActions.appendChild(editBtn);
      const delBtn = document.createElement('button'); delBtn.textContent = t('delete'); delBtn.addEventListener('click', () => del(dep.id)); tdActions.appendChild(delBtn);
      const delBtn = document.createElement('button'); delBtn.textContent = t('delete'); delBtn.addEventListener('click', () => del(dep.id)); tdActions.appendChild(delBtn); // Make sure you have a confirm dialog
      tr.appendChild(tdActions);
      table.appendChild(tr);
    });

    // Re-apply UI restrictions for dynamically created buttons
    setupRoleUI(session);
  }

  function edit(id) {
    const dep = data.departments.find(d => d.id === id);
  function edit(dep) {
    nameInput.value = dep.name;
    form.dataset.editId = id;
    form.dataset.editId = dep.id;
  }

  function del(id) {
    data.departments = data.departments.filter(d => d.id !== id);
    saveData(data);
    addAudit('delete', 'department', id);
    render();
  async function del(id) {
    if (confirm('Are you sure you want to delete this department?')) {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department.');
      } else {
        addAudit('delete', 'department', id);
        await render();
      }
    }
  }

  form.addEventListener('submit', e => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = sanitize(nameInput.value.trim());
    if (!name) return;

    const editId = form.dataset.editId;
    let query;

    if (form.dataset.editId) {
      const dep = data.departments.find(d => d.id === parseInt(form.dataset.editId,10));
      dep.name = name;
      addAudit('update', 'department', dep.id);
      query = supabase.from('departments').update({ name }).eq('id', editId);
    } else {
      const id = Date.now();
      data.departments.push({ id, name });
      addAudit('create', 'department', id);
      query = supabase.from('departments').insert([{ name }]);
    }
    saveData(data);

    const { data: result, error } = await query.select().single();
    if (error) { console.error('Error saving department:', error); return; }

    addAudit(editId ? 'update' : 'create', 'department', result.id);
    form.reset();
    delete form.dataset.editId;
    render();
    await render();
  });

  document.getElementById('export').addEventListener('click', () => exportCSV('departments'));
  document.getElementById('print').addEventListener('click', () => window.print());

  render();
  await render();
});
