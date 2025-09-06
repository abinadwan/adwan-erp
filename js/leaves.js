document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireSession();
  if (!session) return;

  const table = document.getElementById('leavesBody');
  const form = document.getElementById('leaveForm');
  const empSelect = document.getElementById('leaveEmployee');
  const startInput = document.getElementById('leaveStart');
  const endInput = document.getElementById('leaveEnd');

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
    while (table.firstChild) table.removeChild(table.firstChild);

    const { data: leaves, error } = await supabase
      .from('leaves')
      .select('*, employees(name)')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching leaves:', error);
      return;
    }

    leaves.forEach(lv => {
      const tr = document.createElement('tr');
      const tdEmp = document.createElement('td'); tdEmp.textContent = lv.employees?.name || 'N/A'; tr.appendChild(tdEmp);
      const tdStart = document.createElement('td'); tdStart.textContent = lv.start_date; tr.appendChild(tdStart);
      const tdEnd = document.createElement('td'); tdEnd.textContent = lv.end_date; tr.appendChild(tdEnd);
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

    setupRoleUI(session);
  }

  async function changeStatus(id, status) {
    const { error } = await supabase.from('leaves').update({ status }).eq('id', id);
    if (error) {
      console.error('Error updating leave status:', error);
      alert('Failed to update status.');
    } else {
      addAudit('update', 'leave', id);
      await render();
    }
  }

  async function del(id) {
    if (confirm(t('confirmDelete') || 'Are you sure you want to delete this leave request?')) {
      const { error } = await supabase.from('leaves').delete().eq('id', id);
      if (error) {
        console.error('Error deleting leave:', error);
        alert('Failed to delete leave request.');
      } else {
        addAudit('delete', 'leave', id);
        await render();
      }
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const employee_id = parseInt(empSelect.value, 10);
    const start_date = sanitize(startInput.value);
    const end_date = sanitize(endInput.value);

    const { data: newLeave, error } = await supabase
      .from('leaves')
      .insert([{ employee_id, start_date, end_date, status: 'Pending' }])
      .select()
      .single();

    if (error) {
      console.error('Error creating leave request:', error);
      alert('Failed to save leave request.');
    } else {
      addAudit('create', 'leave', newLeave.id);
      form.reset();
      await render();
    }
  });

  document.getElementById('export').addEventListener('click', () => exportCSV('leaves'));
  document.getElementById('print').addEventListener('click', () => window.print());

  await populateEmployees();
  await render();
});
