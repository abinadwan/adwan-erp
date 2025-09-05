import Link from 'next/link';

import { supabaseServer } from '../../../lib/supabase/server';

type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export default async function Employees() {
  const supabase = supabaseServer();
  const { data } = await supabase.from('employees').select('*').limit(50);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <Link href="./employees/new" className="underline">
        New Employee
      </Link>
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((emp: Employee) => (
            <tr key={emp.id} className="border-t">
              <td className="p-2">
                <Link href={`./employees/${emp.id}`}>
                  {emp.first_name} {emp.last_name}
                </Link>
              </td>
              <td className="p-2">{emp.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
