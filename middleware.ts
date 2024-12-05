import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './app/i18n/settings';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: [
    // Enable redirects that add the locale prefix if it's missing
    '/',
    // Set up matcher for all paths that should support localization
    '/(vi|en)/:path*',
    // Exclude paths that should not be internationalized
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}; 