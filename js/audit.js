document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireSession();
  if (!session) return;

  const table = document.getElementById('auditBody');

  async function render() {
    while (table.firstChild) table.removeChild(table.firstChild);

    const { data: auditLogs, error } = await supabase
      .from('audit')
      .select('*')
      .order('time', { ascending: false });

    if (error) {
      console.error('Error fetching audit logs:', error);
      return;
    }

    auditLogs.forEach(log => {
      const tr = document.createElement('tr');
      const tdTime = document.createElement('td'); tdTime.textContent = new Date(log.time).toLocaleString(); tr.appendChild(tdTime);
      const tdAction = document.createElement('td'); tdAction.textContent = log.action; tr.appendChild(tdAction);
      const tdEntity = document.createElement('td'); tdEntity.textContent = log.entity; tr.appendChild(tdEntity);
      const tdDetail = document.createElement('td'); tdDetail.textContent = log.detail; tr.appendChild(tdDetail);
      table.appendChild(tr);
    });
  }

  document.getElementById('export').addEventListener('click', () => exportCSV('audit'));
  document.getElementById('print').addEventListener('click', () => window.print());

  await render();
});
