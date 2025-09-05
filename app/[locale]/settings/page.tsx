import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Settings() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.from('settings').select('*').single();
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p>Company: {data?.company_name}</p>
    </div>
  );
}
