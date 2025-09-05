import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Employees() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.from('employees').select('*').limit(50);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <Link href="./employees/new" className="underline">New Employee</Link>
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((emp) => (
            <tr key={emp.id} className="border-t">
              <td className="p-2">
                <Link href={`./employees/${emp.id}`}>{emp.first_name} {emp.last_name}</Link>
              </td>
              <td className="p-2">{emp.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
