document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
  if (!session) return;
  const data = loadData();
  document.getElementById('kpiEmployees').textContent = data.employees.length;
  document.getElementById('kpiDepartments').textContent = data.departments.length;
  const pendingLeaves = data.leaves.filter(l => l.status === 'Pending').length;
  document.getElementById('kpiLeaves').textContent = pendingLeaves;
  const list = document.getElementById('latestAudit');
  data.audit.slice(0,5).forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.time} - ${item.action} ${item.entity}`;
    list.appendChild(li);
  });
});
