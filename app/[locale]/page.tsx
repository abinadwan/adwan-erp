import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('common');
  const services = [
    { key: 'dashboard', path: 'dashboard' },
    { key: 'employees', path: 'employees' },
    { key: 'attendance', path: 'attendance' },
    { key: 'leave', path: 'leave' },
    { key: 'payroll', path: 'payroll' },
    { key: 'departments', path: 'departments' },
    { key: 'jobs', path: 'jobs' },
    { key: 'reports', path: 'reports' },
    { key: 'settings', path: 'settings' },
  ];
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{t('welcome_title')}</h1>
      <p>{t('welcome_message')}</p>
      <ul className="list-disc pl-5 space-y-2">
        {services.map(({ key, path }) => (
          <li key={path}>
            <Link
              href={`/${params.locale}/${path}`}
              className="text-blue-600 hover:underline"
            >
              {t(key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
