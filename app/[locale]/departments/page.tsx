import { supabaseServer } from '../../../lib/supabase/server';

type Department = { id: string; name: string };

export default async function Departments() {
  const supabase = supabaseServer();
  const { data } = await supabase.from('departments').select('*');
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Departments</h1>
      <ul className="space-y-2">
        {data?.map((d: Department) => (
          <li key={d.id} className="border p-2">
            {d.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
