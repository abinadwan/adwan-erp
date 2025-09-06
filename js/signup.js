document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const messageEl = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageEl.textContent = '';
    messageEl.className = 'mb-4 text-sm'; // Reset classes

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password.length < 6) {
      messageEl.textContent = 'Password must be at least 6 characters long.';
      messageEl.classList.add('text-red-600');
      return;
    }

    if (password !== confirmPassword) {
      messageEl.textContent = 'Passwords do not match.';
      messageEl.classList.add('text-red-600');
      return;
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const message = await response.text();

    if (response.ok) {
      messageEl.textContent = message;
      messageEl.classList.add('text-green-600');
      form.classList.add('hidden');
    } else {
      messageEl.textContent = message;
      messageEl.classList.add('text-red-600');
    }
  });
});
