import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./next-intl.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      config.resolve.alias['@supabase/auth-helpers-nextjs'] = path.resolve('./lib/supabase/mock.ts');
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
