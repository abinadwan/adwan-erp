import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

interface Props { params: { id: string } }

export default async function EmployeeDetail({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.from('employees').select('*').eq('id', params.id).single();
  if (!data) notFound();
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-bold">{data.first_name} {data.last_name}</h1>
      <p>Email: {data.email}</p>
    </div>
  );
}
