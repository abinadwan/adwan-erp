'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { supabaseClient } from '../../../../lib/supabase/client';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const router = useRouter();
  const locale = useLocale();
  const supabase = supabaseClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (!error) router.push(`/${locale}/dashboard`);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto mt-24 space-y-4"
    >
      <input
        {...register('email')}
        placeholder="Email"
        className="w-full border p-2"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <input
        {...register('password')}
        type="password"
        placeholder="Password"
        className="w-full border p-2"
      />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}
      <button type="submit" className="w-full bg-blue-600 text-white py-2">
        Sign Up
      </button>
    </form>
  );
}
