export const locales = ['en', 'vi'] as const;
export type Locale = typeof locales[number];
export const defaultLocale = 'en' as const;

export function getLocale(pathname: string) {
  const segments = pathname.split('/');
  const locale = segments[1];
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
} 