import Link from 'next/link';

export default function DepartmentsPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl">Departments</h1>
      <Link href="/" className="link">Back to Dashboard</Link>
    </div>
  );
}
