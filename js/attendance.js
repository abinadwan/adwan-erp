document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireSession();
  if (!session) return;

  const table = document.getElementById('attendanceBody');
  const form = document.getElementById('attForm');
  const empSelect = document.getElementById('attEmployee');
  const dateInput = document.getElementById('attDate');
  const statusSelect = document.getElementById('attStatus');

  async function populateEmployees() {
    const { data: employees, error } = await supabase.from('employees').select('id, name');
    if (error) {
      console.error('Error fetching employees:', error);
      return;
    }
    employees.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.id;
      opt.textContent = e.name;
      empSelect.appendChild(opt);
    });
  }

  async function render() {
    // 1. Clear table
    while (table.firstChild) table.removeChild(table.firstChild);

    // 2. Fetch data
    const { data: attendance, error } = await supabase
      .from('attendance')
      .select('*, employees(name)')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching attendance:', error);
      return;
    }

    // 3. Render rows
    attendance.forEach(rec => {
      const tr = document.createElement('tr');
      const tdEmp = document.createElement('td'); tdEmp.textContent = rec.employees?.name || 'N/A'; tr.appendChild(tdEmp);
      const tdDate = document.createElement('td'); tdDate.textContent = rec.date; tr.appendChild(tdDate);
      const tdStatus = document.createElement('td'); tdStatus.textContent = rec.status; tr.appendChild(tdStatus);
      const tdActions = document.createElement('td');
      const delBtn = document.createElement('button'); delBtn.textContent = t('delete'); delBtn.addEventListener('click', () => del(rec.id)); tdActions.appendChild(delBtn);
      tr.appendChild(tdActions);
      table.appendChild(tr);
    });

    // 4. Re-apply UI restrictions
    setupRoleUI(session);
  }

  async function del(id) {
    if (confirm(t('confirmDelete') || 'Are you sure you want to delete this record?')) {
      const { error } = await supabase.from('attendance').delete().eq('id', id);
      if (error) {
        console.error('Error deleting attendance:', error);
        alert('Failed to delete record.');
      } else {
        addAudit('delete', 'attendance', id);
        await render();
      }
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const employee_id = parseInt(empSelect.value, 10);
    const date = sanitize(dateInput.value);
    const status = sanitize(statusSelect.value);

    const { data: newRecord, error } = await supabase
      .from('attendance')
      .insert([{ employee_id, date, status }])
      .select()
      .single();

    if (error) {
      console.error('Error creating attendance record:', error);
      alert('Failed to save record.');
    } else {
      addAudit('create', 'attendance', newRecord.id);
      form.reset();
      await render();
    }
  });

  document.getElementById('export').addEventListener('click', () => exportCSV('attendance'));
  document.getElementById('print').addEventListener('click', () => window.print());

  await populateEmployees();
  await render();
});
