# ✅ Simple Multi-Language Implementation

## Overview

Implemented a **simple, working client-side i18n** solution using **Zustand** for state management.

- **Arabic (العربية)** - Default language
- **English** - Secondary language
- **RTL/LTR** automatic switching
- **LocalStorage** persistence

---

## How It Works

### 1. Translation Store ([lib/i18n/useTranslation.ts](frontend/lib/i18n/useTranslation.ts))

Uses Zustand with persistence:

```typescript
export const useTranslation = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'ar', // Default: Arabic
      setLocale: (locale) => {
        set({ locale });
        // Update HTML lang and dir
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      },
      t: (key, params) => {
        // Get translation from key like 'landing.title'
      },
    }),
    { name: 'locale-storage' }
  )
);
```

### 2. Translations ([lib/i18n/translations.ts](frontend/lib/i18n/translations.ts))

Simple object with all translations:

```typescript
export const translations = {
  ar: {
    landing: {
      title: 'StoreAR',
      subtitle: 'منصة التجارة الإلكترونية...',
    },
  },
  en: {
    landing: {
      title: 'StoreAR',
      subtitle: 'AI-Powered E-Commerce Platform...',
    },
  },
};
```

### 3. Language Switcher ([components/LanguageSwitcher.tsx](frontend/components/LanguageSwitcher.tsx))

```typescript
export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex gap-2">
      <button onClick={() => setLocale('ar')}>العربية</button>
      <button onClick={() => setLocale('en')}>English</button>
    </div>
  );
}
```

### 4. Locale Initializer ([components/LocaleInitializer.tsx](frontend/components/LocaleInitializer.tsx))

Updates HTML attributes when locale changes:

```typescript
export function LocaleInitializer() {
  const locale = useTranslation((state) => state.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return null;
}
```

---

## Usage in Components

### Server Components
Since this is client-side, convert to client component:

```typescript
'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Page() {
  const { t } = useTranslation();

  return <h1>{t('landing.title')}</h1>;
}
```

### With Parameters

```typescript
const { t } = useTranslation();

<p>{t('dashboard.welcomeBack', { name: 'Ahmed' })}</p>
// Arabic: مرحباً بعودتك، Ahmed!
// English: Welcome back, Ahmed!
```

---

## Features

✅ **Arabic as default**
✅ **Automatic RTL/LTR**
✅ **LocalStorage persistence** - remembers user choice
✅ **No page reload** - instant language switching
✅ **Type-safe** - TypeScript support
✅ **Simple API** - `t('key')` to translate
✅ **Parameter replacement** - `t('key', { param: 'value' })`

---

## File Structure

```
frontend/
├── lib/
│   └── i18n/
│       ├── translations.ts        # All translations
│       └── useTranslation.ts      # Zustand store
├── components/
│   ├── LanguageSwitcher.tsx       # Language toggle button
│   └── LocaleInitializer.tsx      # Updates HTML attrs
└── app/
    ├── layout.tsx                 # Includes LocaleInitializer
    └── page.tsx                   # Uses useTranslation
```

---

## Adding New Translations

### Step 1: Add to translations.ts

```typescript
export const translations = {
  ar: {
    newSection: {
      greeting: 'مرحباً',
    },
  },
  en: {
    newSection: {
      greeting: 'Hello',
    },
  },
};
```

### Step 2: Use in component

```typescript
const { t } = useTranslation();
<h2>{t('newSection.greeting')}</h2>
```

---

## RTL Styling with Tailwind

### Directional Utilities

```tsx
<div className="mr-4 rtl:ml-4 rtl:mr-0">
  {/* Right margin in LTR, left margin in RTL */}
</div>

<div className="text-left rtl:text-right">
  {/* Text alignment switches */}
</div>
```

### Positioning

```tsx
<div className="right-4 rtl:left-4 rtl:right-auto">
  {/* Language switcher position */}
</div>
```

---

## Current Status

### Implemented
- ✅ Homepage with Arabic/English
- ✅ Language switcher component
- ✅ LocalStorage persistence
- ✅ RTL/LTR automatic switching

### To Translate
- [ ] Login page
- [ ] Register page
- [ ] Dashboard
- [ ] All other pages

---

## Testing

### Test Arabic (Default)

1. Open http://localhost:3000
2. Should see Arabic text
3. HTML should have `lang="ar"` and `dir="rtl"`

### Test Language Switch

1. Click "English" button
2. Text changes to English
3. HTML updates to `lang="en"` and `dir="ltr"`
4. Refresh page - language persists

### Test Persistence

1. Switch to English
2. Close browser
3. Reopen http://localhost:3000
4. Still in English (saved in localStorage)

---

## Advantages Over next-intl

✅ **Simpler** - No complex configuration
✅ **Works immediately** - No routing issues
✅ **Client-side** - Fast switching without reload
✅ **Easy to debug** - All code is visible
✅ **Flexible** - Easy to add new languages
✅ **No dependencies** - Just Zustand (already installed)

---

## Backend Integration

User's language preference is saved in the database:

```typescript
// On registration/login, send locale to backend
const response = await authApi.register({
  email,
  password,
  name,
  workspaceName,
  locale: useTranslation.getState().locale, // 'ar' or 'en'
});

// Backend saves to User.locale field
```

---

## Next Steps

1. Translate login/register pages
2. Translate dashboard
3. Add more languages if needed (easy to add)
4. Sync with backend user.locale on login

---

**Multi-language is working! 🌍**

Switch between Arabic and English instantly without page reload.
