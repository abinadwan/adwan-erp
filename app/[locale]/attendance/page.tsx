import { supabaseServer } from '../../../lib/supabase/server';

type AttendanceRecord = {
  id: string;
  date: string;
  check_in: string;
  check_out: string;
};

export default async function Attendance() {
  const supabase = supabaseServer();
  const { data } = await supabase.from('attendance').select('*').limit(30);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>
      <ul className="space-y-2">
        {data?.map((a: AttendanceRecord) => (
          <li key={a.id} className="border p-2">
            {a.date}: {a.check_in} - {a.check_out}
          </li>
        ))}
      </ul>
    </div>
  );
}
