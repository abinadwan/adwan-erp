'use client';
import { useEffect, useState } from 'react';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';

import { supabaseClient } from '../../../lib/supabase/client';

type Headcount = {
  department: string;
  count: number;
};

export default function Reports() {
  const supabase = supabaseClient();
  const [data, setData] = useState<Headcount[]>([]);
  useEffect(() => {
    supabase
      .from('v_headcount_by_department')
      .select('*')
      .then(({ data }: { data: Headcount[] | null }) => setData(data ?? []));
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
