'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

const localeNames = {
  ar: 'العربية',
  en: 'English',
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1">
      {Object.entries(localeNames).map(([loc, name]) => (
        <button
          key={loc}
          onClick={() => setLocale(loc as 'ar' | 'en')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            locale === loc
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
