import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'nookies';
import supabase from '@/lib/db';
import type { Database } from '@/lib/supabase/types';

// JWT secret must be provided via environment variables.
// Create a .env.local file in the root of your project and set:
// JWT_SECRET=your-super-secret-key

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter username and password.' });
  }

  try {
    const { data, error: userError } = await supabase
      .from('users')
      .select('id, username, password, role')
      .eq('username', username)
      .single();

    const user = data as Database['public']['Tables']['users']['Row'] | null;

    if (userError || !user) {
      return res.status(401).json({ message: 'Incorrect username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect username or password.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role || 'Viewer' },
      JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );

    setCookie({ res }, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60,
      path: '/',
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'An error occurred on the server while trying to log in.',
    });
  }
}
