import { NextResponse } from 'next/server';

export function middleware(req) {
  try {
    const nonce = crypto.randomUUID();
    const csp = [
      "default-src 'self'",
      "script-src 'self' https://cdn.tailwindcss.com 'nonce-" + nonce + "'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ');

    const res = NextResponse.next();
    res.headers.set('Content-Security-Policy', csp);
    res.headers.set('x-nonce', nonce);
    return res;
  } catch (err) {
    console.error('middleware error', err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/:path*',
};
