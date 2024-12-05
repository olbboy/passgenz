export const locales = ['en', 'vi'] as const;
export type Locale = typeof locales[number];

export const defaultLocale = 'en' as const; 