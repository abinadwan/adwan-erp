document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const messageEl = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageEl.textContent = '';
    messageEl.className = 'mb-4 text-sm'; // Reset classes

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password.length < 6) {
      messageEl.textContent = t('passwordTooShort');
      messageEl.classList.add('text-red-600');
      return;
    }

    if (password !== confirmPassword) {
      messageEl.textContent = t('passwordsDoNotMatch');
      messageEl.classList.add('text-red-600');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Sign up error:', error);
      messageEl.textContent = t('signupFailed') + ': ' + error.message;
      messageEl.classList.add('text-red-600');
    } else if (data.user) {
      // Check if email confirmation is required by checking if the email_confirmed_at field is set
      const needsConfirmation = !data.user.email_confirmed_at;
      messageEl.textContent = needsConfirmation ? t('signupSuccess') : t('signupSuccessNoConfirmation');
      messageEl.classList.add('text-green-600');
      form.classList.add('hidden');
    } else {
      // This case should not happen on a successful signup, but it's good practice to handle it.
      console.error('Signup succeeded but no user data was returned.');
      messageEl.textContent = t('signupFailed') + ': An unknown error occurred.';
      messageEl.classList.add('text-red-600');
    }
  });
});