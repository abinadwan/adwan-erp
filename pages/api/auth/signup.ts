import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

interface ExistingUser {
  id: number;
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
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }


  try {
    const { rows } = await pool.query<ExistingUser>(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', // New users get 'Viewer' role by default
      [username, hashedPassword, 'Viewer']
    );

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Signup error:', error);
    const code = (error as { code?: string }).code;
    const message =
      code === 'ECONNREFUSED'
        ? 'Could not connect to the database.'
        : 'An error occurred on the server while trying to sign up.';
    res.status(500).json({ message });
  }
}
