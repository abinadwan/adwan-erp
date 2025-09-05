'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LangSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const switchLocale = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    const segments = pathname.split('/').slice(2); // remove leading '' and locale
    router.push('/' + next + '/' + segments.join('/'));
  };
  return (
    <button onClick={switchLocale} className="px-2 py-1 border rounded">
      {locale === 'ar' ? 'English' : 'عربي'}
    </button>
  );
}
