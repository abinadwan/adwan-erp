import Link from 'next/link';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    router.push('/login');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gray-800 text-white p-4 no-print">
        <div className="flex justify-between">
          <nav className="space-x-4">
            <Link href="/" className="mr-4">Dashboard</Link>
            <Link href="/employees" className="mr-4">Employees</Link>
            <Link href="/departments" className="mr-4">Departments</Link>
            <Link href="/attendance" className="mr-4">Attendance</Link>
            <Link href="/leaves" className="mr-4">Leaves</Link>
            <Link href="/payroll" className="mr-4">Payroll</Link>
            <Link href="/audit" className="mr-4">Audit</Link>
            <Link href="/reports" className="mr-4">Reports</Link>
            <Link href="/settings">Settings</Link>
          </nav>
          <div>
            <button onClick={handleLogout} className="allow-viewer">Logout</button>
          </div>
        </div>
      </header>
      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded shadow">
            <div>Total Employees</div>
            <div className="text-2xl">125</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div>Total Departments</div>
            <div className="text-2xl">15</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div>Pending Leaves</div>
            <div className="text-2xl">5</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-xl mb-2">Latest Audit</h2>
          <ul className="list-disc pl-5">
            <li>User 'admin' logged in.</li>
            <li>User 'admin' added a new employee.</li>
            <li>User 'admin' updated payroll for employee #123.</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl mb-2">Quick Actions</h2>
          <div className="space-x-4">
            <Link href="/employees" className="text-blue-500">Manage Employees</Link>
            <Link href="/departments" className="text-blue-500">Manage Departments</Link>
            <Link href="/leaves" className="text-blue-500">Manage Leaves</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(ctx: any) {
  const { token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // You can verify the token here if you want

  return {
    props: {},
  };
}