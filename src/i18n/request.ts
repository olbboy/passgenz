import {getRequestConfig} from 'next-intl/server';
import {locales} from '@/config/i18n';

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`../../messages/${locale}.json`)).default
})); 