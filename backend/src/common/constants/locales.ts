export const SUPPORTED_LOCALES = ['ar', 'en'] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'ar';

export const LOCALE_NAMES = {
  ar: 'العربية',
  en: 'English',
} as const;

export const LOCALE_DIRECTIONS = {
  ar: 'rtl',
  en: 'ltr',
} as const;
