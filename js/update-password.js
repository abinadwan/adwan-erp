document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('updatePasswordForm');
  const messageEl = document.getElementById('message');

  // Supabase handles the session automatically when the user clicks the link.
  // We just need to handle the form submission to update the password for the now-authenticated user.
  
  // Check if the user is coming from a password recovery link
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      // This event confirms the user is in the password recovery flow.
      // We can now allow them to update their password.
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageEl.textContent = ''; // Clear previous messages

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword.length < 6) {
      messageEl.textContent = t('passwordTooShort');
      return;
    }

    if (newPassword !== confirmPassword) {
      messageEl.textContent = t('passwordsDoNotMatch');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error('Error updating password:', error);
      messageEl.textContent = t('passwordUpdateFailed') + ': ' + error.message;
    } else {
      messageEl.textContent = t('passwordUpdatedRedirect');
      messageEl.classList.remove('text-red-600');
      messageEl.classList.add('text-green-600');
      form.classList.add('hidden');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3000);
    }
  });
});