document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireSession();
  if (!session) return;

  const form = document.getElementById('passwordForm');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword.length < 6) {
      alert(t('passwordTooShort') || 'Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(t('passwordsDoNotMatch') || 'Passwords do not match.');
      return;
    }

    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error('Error updating password:', error);
      alert(t('passwordUpdateFailed') || 'Failed to update password: ' + error.message);
    } else {
      alert(t('passwordUpdateSuccess') || 'Password updated successfully!');
      form.reset();
      addAudit('update', 'password', data.user.email);
    }
  });
});
