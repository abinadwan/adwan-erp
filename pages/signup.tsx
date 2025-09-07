import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || 'An error occurred.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm card">
        <h1 className="text-2xl mb-4 text-center">Create an Account</h1>
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 w-full bg-white dark:bg-gray-700 text-[var(--color-text-primary)] dark:text-[var(--color-text-dark)] placeholder-[var(--color-text-secondary)]"
              required
            />
          </div>
          <div>
            <label className="block" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full bg-white dark:bg-gray-700 text-[var(--color-text-primary)] dark:text-[var(--color-text-dark)] placeholder-[var(--color-text-secondary)]"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 w-full bg-white dark:bg-gray-700 text-[var(--color-text-primary)] dark:text-[var(--color-text-dark)] placeholder-[var(--color-text-secondary)]"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-colors text-white">
            Submit
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="link">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
