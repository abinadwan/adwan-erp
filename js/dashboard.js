document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireSession();
  if (!session) return;

  // Fetch KPIs
  const { count: empCount, error: empError } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true });

  const { count: deptCount, error: deptError } = await supabase
    .from('departments')
    .select('*', { count: 'exact', head: true });

  const { count: leavesCount, error: leavesError } = await supabase
    .from('leaves')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Pending');

  if (!empError) document.getElementById('kpiEmployees').textContent = empCount;
  if (!deptError) document.getElementById('kpiDepartments').textContent = deptCount;
  if (!leavesError) document.getElementById('kpiLeaves').textContent = leavesCount;

  // Fetch Latest Audit
  const list = document.getElementById('latestAudit');
  const { data: auditLogs, error: auditError } = await supabase
    .from('audit')
    .select('*')
    .order('time', { ascending: false })
    .limit(5);

  if (!auditError && auditLogs) {
    auditLogs.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${new Date(item.time).toLocaleString()} - ${item.action} ${item.entity}`;
      list.appendChild(li);
    });
  }
});
