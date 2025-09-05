'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Reports() {
  const supabase = createClientComponentClient();
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('v_headcount_by_department').select('*').then((res) => setData(res.data || []));
  }, [supabase]);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <BarChart width={400} height={300} data={data}>
        <XAxis dataKey="department" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
}
