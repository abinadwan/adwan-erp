document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const role = document.getElementById('role').value;
    const pin = sanitize(document.getElementById('pin').value.trim());
    const data = loadData();
    if (pin === data.pins[role]) {
      setSession(role);
      addAudit('login', role, '');
      window.location.href = 'index.html';
    } else {
      alert(t('invalidPin'));
    }
  });
});
