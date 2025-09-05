import { supabaseServer } from '../../../lib/supabase/server';

type Job = {
  id: string;
  title: string;
  departments?: { name?: string } | null;
};

export default async function Jobs() {
  const supabase = supabaseServer();
  const { data } = await supabase.from('jobs').select('*, departments(name)');
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>
      <ul className="space-y-2">
        {data?.map((j: Job) => (
          <li key={j.id} className="border p-2">
            {j.title} - {j.departments?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
