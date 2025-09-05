import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Departments() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.from('departments').select('*');
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Departments</h1>
      <ul className="space-y-2">
        {data?.map((d) => (
          <li key={d.id} className="border p-2">{d.name}</li>
        ))}
      </ul>
    </div>
  );
}
