document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireSession();
  if (!session) return;

  const empCtx = document.getElementById('empChart').getContext('2d');
  const leaveCtx = document.getElementById('leaveChart').getContext('2d');

  async function renderEmployeeChart() {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('*, departments(name)');

    if (error) { console.error('Error fetching employee data for chart:', error); return; }

    // Aggregate employees per department
    const empCounts = employees.reduce((acc, e) => {
      const deptName = e.departments?.name || 'N/A';
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    }, {});

    new Chart(empCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(empCounts),
        datasets: [{
          label: t('employees'),
          data: Object.values(empCounts),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  async function renderLeaveChart() {
    const { data: leaves, error } = await supabase.from('leaves').select('status');
    if (error) { console.error('Error fetching leave data for chart:', error); return; }

    // Aggregate leave statuses
    const leaveCounts = leaves.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, { Pending: 0, Approved: 0, Rejected: 0 });

    new Chart(leaveCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(leaveCounts).map(k => t(k.toLowerCase())),
        datasets: [{
          label: t('leaves'),
          data: Object.values(leaveCounts),
          backgroundColor: ['rgba(255, 159, 64, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
          borderWidth: 1
        }]
      }
    });
  }

  await renderEmployeeChart();
  await renderLeaveChart();
});
