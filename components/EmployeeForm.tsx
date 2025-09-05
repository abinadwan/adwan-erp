'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { supabaseClient } from '../lib/supabase/client';

import Button from './ui/Button';
import Input from './ui/Input';

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export default function EmployeeForm() {
  const supabase = supabaseClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: FormData) => {
    await supabase.from('employees').insert(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Input {...register('first_name')} placeholder="First Name" />
      {errors.first_name && (
        <p className="text-red-500">{errors.first_name.message}</p>
      )}
      <Input {...register('last_name')} placeholder="Last Name" />
      {errors.last_name && (
        <p className="text-red-500">{errors.last_name.message}</p>
      )}
      <Input {...register('email')} placeholder="Email" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <Button type="submit">Save</Button>
    </form>
  );
}
