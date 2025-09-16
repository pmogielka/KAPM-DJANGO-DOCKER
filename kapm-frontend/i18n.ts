import {getRequestConfig} from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pl';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.includes(locale as Locale);

  if (!isValidLocale) {
    locale = defaultLocale;
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    locale: locale
  };
});