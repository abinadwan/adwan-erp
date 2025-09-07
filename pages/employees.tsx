import Link from 'next/link';

export default function EmployeesPage() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 p-4">
      <h1 className="mb-4">Employees</h1>
      <Link href="/" className="text-blue-500 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
