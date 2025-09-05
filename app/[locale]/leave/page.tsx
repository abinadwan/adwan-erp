import LeaveForm from '../../../components/LeaveForm';
import { supabaseServer } from '../../../lib/supabase/server';

type LeaveRequest = {
  id: string;
  type: string;
  start_date: string;
  end_date: string;
  status: string;
};

export default async function Leave() {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from('leave_requests')
    .select('*')
    .order('created_at', { ascending: false });
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Leave Requests</h1>
      <LeaveForm />
      <ul className="space-y-2">
        {data?.map((l: LeaveRequest) => (
          <li key={l.id} className="border p-2">
            {l.type} {l.start_date} - {l.end_date} ({l.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
