'use client';
import Link from 'next/link';
import LangSwitcher from './LangSwitcher';
in
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <Link href={`/${locale}`} className="font-bold">
        ERP-HR
      </Link>
      <div className="flex items-center gap-4">
        <Link href={`/${locale}`} className="hover:underline">
main
        </Link>
        <LangSwitcher />
      </div>
    </nav>
  );
}
