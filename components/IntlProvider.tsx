'use client';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface IntlProviderProps {
  locale: string;
  messages: Record<string, string>;
  children: ReactNode;
}

export default function IntlProvider({
  locale,
  messages,
  children,
}: IntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
