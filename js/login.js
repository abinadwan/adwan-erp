document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signInWithPassword({ email: username, password });
    if (error) {
      alert(t('invalidCredentials'));
      return;
    }
    addAudit('login', 'user', username);
    window.location.href = 'index.html';
  });
});
