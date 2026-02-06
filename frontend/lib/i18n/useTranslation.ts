'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, Locale } from './translations';

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => any;
}

export const useTranslation = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'ar', // Default to Arabic
      setLocale: (locale) => {
        set({ locale });
        // Update HTML attributes
        if (typeof document !== 'undefined') {
          document.documentElement.lang = locale;
          document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
        }
      },
      t: (key, params) => {
        const locale = get().locale;
        const keys = key.split('.');
        let value: any = translations[locale];

        for (const k of keys) {
          value = value?.[k];
        }

        // Return arrays or objects as-is
        if (Array.isArray(value) || typeof value === 'object') {
          return value;
        }

        if (typeof value !== 'string') {
          return key;
        }

        // Replace params like {name}
        if (params) {
          return Object.entries(params).reduce(
            (acc, [k, v]) => acc.replace(`{${k}}`, v),
            value
          );
        }

        return value;
      },
    }),
    {
      name: 'locale-storage',
    }
  )
);

// Initialize locale on mount
if (typeof window !== 'undefined') {
  const locale = useTranslation.getState().locale;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
}
