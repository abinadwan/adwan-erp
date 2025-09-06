import Link from 'next/link';

type Department = {
  id: number;
  name: string;
  manager: string;
  employees: number;
};

const sampleDepartments: Department[] = [
  { id: 1, name: 'Engineering', manager: 'Alice', employees: 25 },
  { id: 2, name: 'Sales', manager: 'Bob', employees: 15 },
  { id: 3, name: 'HR', manager: 'Carol', employees: 5 },
];

export default function DepartmentsPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Departments</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Manager</th>
            <th className="py-2 px-4 border-b text-left">Employees</th>
          </tr>
        </thead>
        <tbody>
          {sampleDepartments.map((dept) => (
            <tr key={dept.id}>
              <td className="py-2 px-4 border-b">{dept.name}</td>
              <td className="py-2 px-4 border-b">{dept.manager}</td>
              <td className="py-2 px-4 border-b">{dept.employees}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <Link href="/" className="text-blue-500">Back to Dashboard</Link>
      </div>
    </main>
  );
}
