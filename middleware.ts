import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimitStore = new Map<string, { count: number; expires: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record || record.expires < now) {
    rateLimitStore.set(ip, { count: 1, expires: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  record.count += 1;
  if (record.count > RATE_LIMIT_MAX) return false;
  rateLimitStore.set(ip, record);
  return true;
}

export function middleware(req: NextRequest) {
  const nonce = crypto.randomUUID();
  const csp = [
    "default-src 'self'",
    "img-src 'self' data: blob:",
    "script-src 'self' 'strict-dynamic' 'nonce-" + nonce + "'",
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self' https://*.supabase.co",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('x-nonce', nonce);

  if (
    req.method === 'POST' &&
    (req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.includes('/sign-in'))
  ) {
    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!rateLimit(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  return res;
}

export const config = {
  matcher: '/:path*',
};
