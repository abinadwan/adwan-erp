document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
  if (!session) return;
  const data = loadData();
  const empCtx = document.getElementById('empChart').getContext('2d');
  const leaveCtx = document.getElementById('leaveChart').getContext('2d');
  
  // Employees per Department Chart
  const empCounts = {};
  data.employees.forEach(e => {
    const dept = data.departments.find(d => d.id === e.departmentId)?.name || 'N/A';
    empCounts[dept] = (empCounts[dept] || 0) + 1;
  });

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
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });

  // Leave Status Chart
  const leaveCounts = { Pending: 0, Approved: 0, Rejected: 0 };
  data.leaves.forEach(l => { 
      if (leaveCounts.hasOwnProperty(l.status)) {
          leaveCounts[l.status]++;
      }
  });

  new Chart(leaveCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(leaveCounts).map(k => t(k.toLowerCase())),
      datasets: [{
        label: t('leaves'),
        data: Object.values(leaveCounts),
        backgroundColor: [
          'rgba(255, 159, 64, 0.5)', // Pending
          'rgba(75, 192, 192, 0.5)', // Approved
          'rgba(255, 99, 132, 0.5)'  // Rejected
        ],
        borderWidth: 1
      }]
    }
  });
});
