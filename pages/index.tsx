import Link from 'next/link';
import { parseCookies } from 'nookies';
import type { GetServerSidePropsContext } from 'next';
import jwt from 'jsonwebtoken';


export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="card fade-in">
          <div>Total Employees</div>
          <div className="text-2xl">125</div>
        </div>
        <div className="card fade-in">
          <div>Total Departments</div>
          <div className="text-2xl">15</div>
        </div>
        <div className="card fade-in">
          <div>Pending Leaves</div>
          <div className="text-2xl">5</div>
        </div>
      </div>
      <div className="card fade-in mb-4">
        <h2 className="text-xl mb-2">Latest Audit</h2>
        <ul className="list-disc pl-5 text-[var(--color-text-secondary)]">
          <li>User &apos;admin&apos; logged in.</li>
          <li>User &apos;admin&apos; added a new employee.</li>
          <li>User &apos;admin&apos; updated payroll for employee #123.</li>
        </ul>
      </div>
      <div className="card fade-in">
        <h2 className="text-xl mb-2">Quick Actions</h2>
        <div className="space-x-4">
          <Link href="/employees" className="link">Manage Employees</Link>
          <Link href="/departments" className="link">Manage Departments</Link>
          <Link href="/leaves" className="link">Manage Leaves</Link>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

    try {
      // It's best to move the JWT_SECRET to a shared config/util file
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) throw new Error("JWT_SECRET not configured on the server.");
      jwt.verify(token, JWT_SECRET);
    } catch {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

  return {
    props: {},
  };
}