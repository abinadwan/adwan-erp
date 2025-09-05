'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import LangSwitcher from './LangSwitcher';

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations('common');

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <Link href={`/${locale}`} className="font-bold">
        ERP-HR
      </Link>

      <div className="flex items-center gap-4">
        <Link href={`/${locale}`} className="hover:underline">
          {t('home')}
        </Link>
        <Link href={`/${locale}/performance`} className="hover:underline">
          {t('performance')}
        </Link>
        <LangSwitcher />
      </div>
    </nav>
  );
}
