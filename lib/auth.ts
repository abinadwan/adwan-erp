import { supabaseServer } from './supabase/server';

export async function requireUser() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
