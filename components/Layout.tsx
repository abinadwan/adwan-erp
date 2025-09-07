import Link from 'next/link';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const noChrome = router.pathname === '/login' || router.pathname === '/signup';
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      {!noChrome && (
        <header className="bg-[var(--color-primary)] text-white shadow">
          <div className="container mx-auto flex items-center justify-between p-4">
            <nav className="flex space-x-4">
              <Link className="hover:text-[var(--color-secondary)] transition-colors" href="/">Dashboard</Link>
              <Link className="hover:text-[var(--color-secondary)] transition-colors" href="/employees">Employees</Link>
              <Link className="hover:text-[var(--color-secondary)] transition-colors" href="/departments">Departments</Link>
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button onClick={async () => { await fetch('/api/auth/logout'); router.push('/login'); }} className="px-3 py-1 rounded bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] transition-colors">Logout</button>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1 container mx-auto p-4 page">
        {children}
      </main>
      {!noChrome && (
        <footer className="bg-[var(--color-primary)] text-white mt-8">
          <div className="container mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="hover:text-[var(--color-secondary)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9A12.14 12.14 0 013 4.8a4.28 4.28 0 001.32 5.7 4.24 4.24 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.97A8.6 8.6 0 012 19.54a12.14 12.14 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19-.01-.38-.02-.57A8.7 8.7 0 0024 5.5a8.49 8.49 0 01-2.54.7z"/></svg>
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-[var(--color-secondary)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 12a10 10 0 10-11.5 9.95v-7.04H8.1V12h2.4V9.8c0-2.37 1.42-3.7 3.6-3.7 1.04 0 2.13.18 2.13.18v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48V12h2.64l-.42 2.91h-2.22v7.04A10 10 0 0022 12z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-[var(--color-secondary)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"/></svg>
              </a>
            </div>
            <form className="flex space-x-2">
              <input type="email" placeholder="Email" className="px-2 py-1 rounded text-[var(--color-text-primary)]" />
              <button type="submit" className="px-4 py-1 rounded bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] transition-colors">Subscribe</button>
            </form>
          </div>
        </footer>
      )}
    </div>
  );
}
