document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const messageEl = document.getElementById('message');

  // This listener handles the session when the user clicks the magic link and returns to the app.
  supabase.auth.onAuthStateChange(async (event, session) => {
    // If the user is signed in and the event is SIGNED_IN, it means they came from the magic link.
    if (event === 'SIGNED_IN' && session) {
      addAudit('login', 'user', session.user.email);
      window.location.href = 'index.html';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageEl.textContent = ''; // Clear previous messages
    const email = document.getElementById('email').value.trim();

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // This will be the page the user is redirected to after clicking the link.
        emailRedirectTo: `${window.location.origin}/index.html`,
      },
    });

    if (error) {
      console.error('Magic link error:', error);
    }
    // Always show a success message to prevent leaking information about which emails are registered.
    messageEl.textContent = t('checkEmailForLink');
    messageEl.classList.add('text-green-600');
    form.querySelector('button').disabled = true;
  });
});
