import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import LeaveForm from '../../../components/LeaveForm';

export default async function Leave() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.from('leave_requests').select('*').order('created_at', { ascending: false });
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Leave Requests</h1>
      <LeaveForm />
      <ul className="space-y-2">
        {data?.map((l) => (
          <li key={l.id} className="border p-2">
            {l.type} {l.start_date} - {l.end_date} ({l.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
