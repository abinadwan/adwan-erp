import '../../styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import en from '../../locales/en/common.json';
import ar from '../../locales/ar/common.json';

export const metadata = { title: 'ERP-HR' };

export default function RootLayout({ children, params: { locale } }: { children: ReactNode; params: { locale: string } }) {
  const messages = locale === 'ar' ? ar : en;
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="min-h-screen bg-gray-50">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}
