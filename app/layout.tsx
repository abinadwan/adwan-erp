import '../styles/globals.css';
import { ReactNode } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';
import IntlProvider from '../components/IntlProvider';
import Navbar from '../components/Navbar';
import en from '../locales/en/common.json';
import ar from '../locales/ar/common.json';
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
  const locale = params?.locale ?? nextIntlConfig.defaultLocale;
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
