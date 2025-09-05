document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
  if (!session) return;
  const data = loadData();
  const empCtx = document.getElementById('empChart').getContext('2d');
  const leaveCtx = document.getElementById('leaveChart').getContext('2d');

  function drawBar(ctx, labels, values) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const max = Math.max(...values, 1);
    const barWidth = width / labels.length;
    ctx.clearRect(0,0,width,height);
    labels.forEach((label,i) => {
      const barHeight = (values[i]/max)*(height-20);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(i*barWidth + 10, height - barHeight - 20, barWidth - 20, barHeight);
      ctx.fillStyle = '#000';
      ctx.fillText(label, i*barWidth + 10, height - 5);
    });
  }

  const empCounts = {};
  data.employees.forEach(e => {
    const dept = data.departments.find(d => d.id === e.departmentId)?.name || '';
    empCounts[dept] = (empCounts[dept] || 0) + 1;
  });
  drawBar(empCtx, Object.keys(empCounts), Object.values(empCounts));

  const leaveCounts = { Pending: 0, Approved: 0, Rejected: 0 };
  data.leaves.forEach(l => { leaveCounts[l.status] = (leaveCounts[l.status] || 0) + 1; });
  drawBar(leaveCtx, Object.keys(leaveCounts), Object.values(leaveCounts));
});
