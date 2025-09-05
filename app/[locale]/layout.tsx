import '../../styles/globals.css';
import { ReactNode } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';
import IntlProvider from '../../components/IntlProvider';
import en from '../../locales/en/common.json';
import ar from '../../locales/ar/common.json';

export const metadata = { title: 'ERP-HR' };

export default function RootLayout({ children, params: { locale } }: { children: ReactNode; params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const messages = locale === 'ar' ? ar : en;
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="min-h-screen bg-gray-50">
        <IntlProvider locale={locale} messages={messages}>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}

