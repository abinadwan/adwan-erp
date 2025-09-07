import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import supabase from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Please enter username and password.' });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase
      .from('users')
      .insert([{ username, password: hashedPassword, role: 'user' }]);

    if (insertError) {
      throw insertError;
    }

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'An error occurred on the server while trying to sign up.',
    });
  }
}
