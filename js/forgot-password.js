document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const messageEl = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    
    // Construct the redirect URL. For production, this should be an absolute URL.
    const redirectURL = `${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}/update-password.html`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL,
    });

    if (error) {
      // Show a generic message to avoid user enumeration
      console.error('Password reset error:', error);
    }
    
    // Always show a success message to prevent leaking information about which emails are registered.
    messageEl.textContent = t('checkEmailForLink');
    messageEl.classList.add('text-green-600');
    form.classList.add('hidden');
  });
});