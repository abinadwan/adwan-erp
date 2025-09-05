'use client';
import { useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const schema = z.object({ email: z.string().email() });
type FormData = z.infer<typeof schema>;

export default function Forgot() {
  const supabase = createClientComponentClient();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo: 'http://localhost:3000' });
    if (!error) setSent(true);
  };
  return sent ? (
    <p className="text-center mt-24">Check your email.</p>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-24 space-y-4">
      <input {...register('email')} placeholder="Email" className="w-full border p-2" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2">Send</button>
    </form>
  );
}
