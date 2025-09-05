const RTL_LOCALES = new Set(['ar', 'fa', 'he', 'ur']);

export function isRTL(locale: string) {
  const lang = locale.split('-')[0];
  return RTL_LOCALES.has(lang);
}
