document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireSession();
  if (!session) return;

  const table = document.getElementById('departmentsBody');
  const form = document.getElementById('deptForm');
  const nameInput = document.getElementById('deptName');

  async function render() {
    // 1. Clear existing table rows
    while (table.firstChild) table.removeChild(table.firstChild);

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
      const editBtn = document.createElement('button'); editBtn.textContent = t('edit'); editBtn.addEventListener('click', () => edit(dep)); tdActions.appendChild(editBtn);
      const delBtn = document.createElement('button'); delBtn.textContent = t('delete'); delBtn.addEventListener('click', () => del(dep.id)); tdActions.appendChild(delBtn);
      tr.appendChild(tdActions);
      table.appendChild(tr);
    });

    // Re-apply UI restrictions for dynamically created buttons
    setupRoleUI(session);
  }

  function edit(dep) {
    nameInput.value = dep.name;
    form.dataset.editId = dep.id;
  }

  async function del(id) {
    if (confirm(t('confirmDelete') || 'Are you sure you want to delete this department?')) {
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = sanitize(nameInput.value.trim());
    if (!name) return;

    const editId = form.dataset.editId;
    let query;

    if (editId) {
      query = supabase.from('departments').update({ name }).eq('id', editId);
    } else {
      query = supabase.from('departments').insert([{ name }]);
    }

    const { data: result, error } = await query.select().single();
    if (error) { console.error('Error saving department:', error); return; }

    addAudit(editId ? 'update' : 'create', 'department', result.id);
    form.reset();
    delete form.dataset.editId;
    await render();
  });

  document.getElementById('export').addEventListener('click', () => exportCSV('departments'));
  document.getElementById('print').addEventListener('click', () => window.print());

  await render();
});
