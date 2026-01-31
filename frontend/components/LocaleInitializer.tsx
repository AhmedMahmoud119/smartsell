'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function LocaleInitializer() {
  const locale = useTranslation((state) => state.locale);

  useEffect(() => {
    // Set HTML lang and dir attributes
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return null;
}
