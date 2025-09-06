document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireSession();
  if (!session) return;

  const table = document.getElementById('payrollBody');
  const form = document.getElementById('payrollForm');
  const monthInput = document.getElementById('payrollMonth');

  async function render() {
    while (table.firstChild) table.removeChild(table.firstChild);

    const { data: payrolls, error } = await supabase
      .from('payroll')
      .select('*')
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('Error fetching payroll:', error);
      return;
    }

    payrolls.forEach(p => {
      const tr = document.createElement('tr');
      const tdMonth = document.createElement('td'); tdMonth.textContent = p.month; tr.appendChild(tdMonth);
      const tdDate = document.createElement('td'); tdDate.textContent = new Date(p.generated_at).toLocaleString(); tr.appendChild(tdDate);
      table.appendChild(tr);
    });

    setupRoleUI(session);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const month = sanitize(monthInput.value);
    const { data: newPayroll, error } = await supabase.from('payroll').insert([{ month }]).select().single();

    if (error) {
      console.error('Error generating payroll:', error);
    } else {
      addAudit('create', 'payroll', newPayroll.id);
      form.reset();
      await render();
    }
  });

  document.getElementById('export').addEventListener('click', () => exportCSV('payroll'));
  document.getElementById('print').addEventListener('click', () => window.print());

  await render();
});
