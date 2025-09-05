document.addEventListener('DOMContentLoaded', () => {
  const session = requireSession();
  if (!session) return;
  const data = loadData();
  const adminForm = document.getElementById('adminPinForm');
  const viewerForm = document.getElementById('viewerPinForm');

  if (session.role !== 'Admin') {
    adminForm.remove();
  }

  adminForm?.addEventListener('submit', e => {
    e.preventDefault();
    const current = sanitize(document.getElementById('adminCurrent').value);
    const newPin = sanitize(document.getElementById('adminNew').value);
    if (current === data.pins.Admin) {
      data.pins.Admin = newPin;
      saveData(data);
      addAudit('update','pin','Admin');
      alert(t('save'));
    } else {
      alert(t('invalidPin'));
    }
    adminForm.reset();
  });

  viewerForm.addEventListener('submit', e => {
    e.preventDefault();
    const current = sanitize(document.getElementById('viewerCurrent').value);
    const newPin = sanitize(document.getElementById('viewerNew').value);
    if (current === data.pins.Viewer) {
      data.pins.Viewer = newPin;
      saveData(data);
      addAudit('update','pin','Viewer');
      alert(t('save'));
    } else {
      alert(t('invalidPin'));
    }
    viewerForm.reset();
  });
});
