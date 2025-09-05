import { notFound } from 'next/navigation';

import { supabaseServer } from '../../../../lib/supabase/server';

interface Props {
  params: { id: string };
}

type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export default async function EmployeeDetail({ params }: Props) {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from('employees')
    .select('*')
    .eq('id', params.id)
    .single<Employee>();
  if (!data) notFound();
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-bold">
        {data.first_name} {data.last_name}
      </h1>
      <p>Email: {data.email}</p>
    </div>
  );
}
