import type { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie } from 'nookies';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  destroyCookie({ res }, 'token', {
    path: '/',
  });

  res.status(200).json({ message: 'Logout successful' });
}
