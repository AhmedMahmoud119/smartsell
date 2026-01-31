'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="absolute top-4 right-4 ltr:right-4 ltr:left-auto rtl:left-4 rtl:right-auto">
        <LanguageSwitcher />
      </div>

      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-gray-900">
          {t('landing.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          {t('landing.subtitle')}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t('landing.login')}
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            {t('landing.getStarted')}
          </Link>
        </div>
      </div>
    </div>
  );
}
