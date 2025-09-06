import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Please enter username and password.');
  }

  try {
    const { rows }: any = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (rows.length > 0) {
      return res.status(400).send('Username already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', // New users get 'Viewer' role by default
      [username, hashedPassword, 'Viewer']
    );

    res.status(201).send('User created successfully.');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('An error occurred on the server while trying to sign up.');
  }
}
