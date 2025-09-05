import { redirect } from 'next/navigation';
import nextIntlConfig from '../next-intl.config';

export default function Home() {
  // Redirect to the default locale to avoid 404 on the root path
  redirect(`/${nextIntlConfig.defaultLocale}`);
}
