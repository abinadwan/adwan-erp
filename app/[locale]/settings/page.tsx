import { supabaseServer } from '../../../lib/supabase/server';

type AppSettings = { company_name: string };

export default async function Settings() {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from('settings')
    .select('*')
    .single<AppSettings>();
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p>Company: {data?.company_name}</p>
    </div>
  );
}
