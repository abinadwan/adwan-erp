import '../styles/globals.css';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { z } from 'zod';

import IntlProvider from '../components/IntlProvider';
import Navbar from '../components/Navbar';
import ar from '../locales/ar/common.json';
import en from '../locales/en/common.json';
import nextIntlConfig from '../next-intl.config';

export const metadata = { title: 'ERP-HR' };
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale?: string };
}) {
  const LocaleSchema = z.enum(['en', 'ar']);
  const parsed = LocaleSchema.safeParse(params?.locale);
  const locale = parsed.success ? parsed.data : nextIntlConfig.defaultLocale;
  unstable_setRequestLocale(locale);
  const messages = locale === 'ar' ? ar : en;
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="min-h-screen bg-gray-50">
        <IntlProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
