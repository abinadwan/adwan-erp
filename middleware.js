// middleware.js

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

    // إنشاء استجابة جديدة بناءً على الطلب الأصلي
    const res = new Response(req.body, {
      status: 200,
      headers: new Headers(req.headers),
    });

    // تعيين رؤوس الأمان
    res.headers.set('Content-Security-Policy', csp);
    res.headers.set('x-nonce', nonce);

    return res;
  } catch (err) {
    console.error('middleware error', err);
    // في حالة الخطأ، نعيد استجابة جديدة بدون تعديل
    return new Response(req.body, {
      status: 200,
      headers: new Headers(req.headers),
    });
  }
}

export const config = {
  matcher: '/:path*',
};
