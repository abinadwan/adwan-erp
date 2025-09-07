import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'nookies';
import pool from '@/lib/db';

interface User {
  id: number;
  username: string;
  password: string;
  role: string | null;
}

// It is recommended to use environment variables for the JWT secret.
// Create a .env.local file in the root of your project and add the following:
// JWT_SECRET=your-super-secret-key

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

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
    const { rows } = await pool.query<User>(
      'SELECT id, username, password, role FROM users WHERE username = $1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Incorrect username or password.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect username or password.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role || 'Viewer' }, JWT_SECRET, {
      expiresIn: '1h',
    });

    setCookie({ res }, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60,
      path: '/',
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    const code = (error as { code?: string }).code;
    const message =
      code === 'ECONNREFUSED'
        ? 'Could not connect to the database.'
        : 'An error occurred on the server while trying to log in.';
    res.status(500).json({ message });
  }
}
