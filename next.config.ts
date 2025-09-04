import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',   // مهم جداً للتصدير لمجلد out
  trailingSlash: true, // يخلي كل الروابط تنتهي بـ / عشان ما يخرب التصفح في Pages
  images: {
    unoptimized: true, // GitHub Pages ما يدعم تحسين الصور السيرفري
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  experimental: {
    ppr: true, // تقدرين تخليه، بس ما راح يشتغل فعلياً مع static export
  },
};

export default nextConfig;
