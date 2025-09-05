'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Button from './ui/Button';
import Input from './ui/Input';

const schema = z.object({
  type: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function LeaveForm() {
  const supabase = createClientComponentClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: FormData) => {
    await supabase.from('leave_requests').insert(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Input {...register('type')} placeholder="Type" />
      {errors.type && <p className="text-red-500">{errors.type.message}</p>}
      <Input {...register('start_date')} type="date" placeholder="Start" />
      {errors.start_date && <p className="text-red-500">{errors.start_date.message}</p>}
      <Input {...register('end_date')} type="date" placeholder="End" />
      {errors.end_date && <p className="text-red-500">{errors.end_date.message}</p>}
      <Button type="submit">Submit</Button>
    </form>
  );
}
