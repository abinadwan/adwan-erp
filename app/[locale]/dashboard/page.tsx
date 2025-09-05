import { supabaseServer } from '../../../lib/supabase/server';

export default async function Dashboard() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome {user?.email}</p>
    </div>
  );
}
