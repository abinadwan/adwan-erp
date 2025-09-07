import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (

    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm card">
        <h1 className="text-2xl mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-colors text-white">
            Submit
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/signup" className="link">
            Create a new account
          </Link>
        </div>
      </div>
    </div>
  );
}
