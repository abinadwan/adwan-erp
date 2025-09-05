import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Payroll() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.from('payroll_items').select('*').limit(50);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payroll</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Employee</th>
            <th className="p-2">Label</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.employee_id}</td>
              <td className="p-2">{p.label}</td>
              <td className="p-2">{p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
