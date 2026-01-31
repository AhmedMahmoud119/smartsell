# 🌍 Multi-Language Support

## Overview

StoreAR now supports **Arabic (العربية)** and **English** with **Arabic as the default language**.

---

## Features

### ✅ Backend Support

- User locale stored in database (`User.locale`)
- Default locale: `ar` (Arabic)
- Supported locales: `ar`, `en`
- Locale validation in DTOs
- User can update their preferred language

### ✅ Frontend Support

- **next-intl** for internationalization
- Arabic (RTL) and English (LTR) support
- Language switcher component
- Automatic direction detection
- Arabic as default locale
- No `/ar` prefix for default language (clean URLs)

---

## Backend Changes

### 1. Locale Constants

Created [src/common/constants/locales.ts](backend/src/common/constants/locales.ts):

```typescript
export const SUPPORTED_LOCALES = ['ar', 'en'] as const;
export const DEFAULT_LOCALE: SupportedLocale = 'ar';

export const LOCALE_DIRECTIONS = {
  ar: 'rtl',
  en: 'ltr',
};
```

### 2. User Model

Schema already had locale field:
```prisma
model User {
  locale String @default("ar")
}
```

### 3. DTOs Updated

**RegisterDto** - validates locale:
```typescript
@IsIn(SUPPORTED_LOCALES, { message: 'Locale must be either ar or en' })
locale?: string = DEFAULT_LOCALE;
```

**UpdateProfileDto** - allows locale updates:
```typescript
@IsIn(SUPPORTED_LOCALES)
locale?: string;
```

### 4. API Endpoints

- `POST /api/auth/register` - accepts `locale` field (optional, defaults to 'ar')
- `PATCH /api/user/profile` - can update user locale
- `GET /api/user/me` - returns user locale

---

## Frontend Changes

### 1. Dependencies Installed

```bash
npm install next-intl
```

### 2. Configuration Files

**i18n.ts** - Locale configuration:
```typescript
export const locales = ['ar', 'en'] as const;
export const defaultLocale: Locale = 'ar';
export const localeDirections = {
  ar: 'rtl',
  en: 'ltr',
};
```

**middleware.ts** - Locale routing:
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'as-needed', // No /ar prefix
});
```

**next.config.ts** - Next-intl plugin:
```typescript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n.ts');
export default withNextIntl(nextConfig);
```

### 3. Translation Files

**messages/ar.json** - Arabic translations:
```json
{
  "landing": {
    "title": "StoreAR",
    "subtitle": "منصة التجارة الإلكترونية المدعومة بالذكاء الاصطناعي للتجار العرب",
    "login": "تسجيل الدخول",
    "getStarted": "ابدأ الآن"
  }
}
```

**messages/en.json** - English translations:
```json
{
  "landing": {
    "title": "StoreAR",
    "subtitle": "AI-Powered E-Commerce Platform for Arabic Merchants",
    "login": "Login",
    "getStarted": "Get Started"
  }
}
```

### 4. Directory Structure

```
app/
├── layout.tsx                 # Root layout (minimal)
├── globals.css                # Global styles
├── [locale]/                  # Locale-based routes
│   ├── layout.tsx             # Locale layout with i18n provider
│   ├── providers.tsx          # React Query provider
│   ├── page.tsx               # Homepage with translations
│   ├── login/
│   ├── register/
│   └── dashboard/
```

### 5. Components

**LanguageSwitcher** ([components/LanguageSwitcher.tsx](frontend/components/LanguageSwitcher.tsx)):
```typescript
export function LanguageSwitcher() {
  const locale = useLocale();
  // Switches between ar and en
  // Updates URL and reloads with new locale
}
```

---

## URL Structure

### Default Locale (Arabic)
- Homepage: `http://localhost:3000/`
- Login: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/dashboard`

### English Locale
- Homepage: `http://localhost:3000/en`
- Login: `http://localhost:3000/en/login`
- Dashboard: `http://localhost:3000/en/dashboard`

---

## RTL/LTR Support

### Automatic Direction

The layout automatically sets HTML `dir` attribute:

```typescript
const direction = localeDirections[locale]; // 'rtl' or 'ltr'

return (
  <html lang={locale} dir={direction}>
    {children}
  </html>
);
```

### CSS for RTL

Tailwind CSS automatically supports RTL with utilities like:
- `rtl:text-right` - Apply text-right only in RTL
- `ltr:text-left` - Apply text-left only in LTR
- `mr-4` becomes `margin-left: 1rem` in RTL

---

## Usage Examples

### In Server Components

```typescript
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('landing');

  return (
    <h1>{t('title')}</h1>
  );
}
```

### In Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('auth.login');

  return <button>{t('signIn')}</button>;
}
```

### With Parameters

```typescript
const t = useTranslations('dashboard.home');

<p>{t('welcomeBack', { name: user.name })}</p>
// Arabic: مرحباً بعودتك، أحمد!
// English: Welcome back, Ahmed!
```

---

## Translation Keys Structure

```
landing/              # Landing page
auth/
  login/              # Login page
  register/           # Registration page
dashboard/
  sidebar/            # Sidebar navigation
  home/               # Dashboard home
    getStarted/       # Getting started section
common/               # Common translations
```

---

## Adding New Translations

### 1. Add to Arabic (messages/ar.json)

```json
{
  "newSection": {
    "title": "عنوان جديد",
    "description": "وصف بالعربية"
  }
}
```

### 2. Add to English (messages/en.json)

```json
{
  "newSection": {
    "title": "New Title",
    "description": "Description in English"
  }
}
```

### 3. Use in Component

```typescript
const t = useTranslations('newSection');
<h2>{t('title')}</h2>
```

---

## Language Detection

### Default Behavior

1. Check URL for locale prefix (`/en`)
2. If no prefix → use default locale (`ar`)
3. User can switch language via LanguageSwitcher

### Future Enhancements

- Detect browser language preference
- Remember user's language choice in localStorage
- Sync with backend user.locale field

---

## Testing

### Test Arabic (Default)

```bash
# Open browser
http://localhost:3000

# Should see Arabic interface
# No /ar in URL
```

### Test English

```bash
# Click language switcher "English"
# URL changes to: http://localhost:3000/en
# Interface switches to English
```

### Test Language Persistence

```bash
# Navigate to http://localhost:3000/en/login
# Should stay in English
# All pages under /en/* are in English
```

---

## Database Sync

### User Registration

```typescript
// Frontend sends locale
const response = await authApi.register({
  email: 'user@example.com',
  password: 'password',
  name: 'Ahmed',
  workspaceName: 'My Store',
  locale: 'ar', // Sent to backend
});

// Backend stores in User.locale
```

### Update User Locale

```typescript
// User changes language in settings
await authApi.updateProfile({
  locale: 'en',
});

// Updates User.locale in database
// Frontend UI switches to English
```

---

## RTL-Specific Styling

### Tailwind Utilities

```tsx
<div className="mr-4 rtl:ml-4 rtl:mr-0">
  {/* Margin-right in LTR, margin-left in RTL */}
</div>

<div className="text-left rtl:text-right">
  {/* Text alignment switches */}
</div>
```

### FlexBox Direction

```tsx
<div className="flex flex-row rtl:flex-row-reverse">
  {/* Items reverse in RTL */}
</div>
```

---

## Completed Features

- ✅ Backend locale validation
- ✅ Database locale storage
- ✅ Frontend i18n setup
- ✅ Arabic and English translations
- ✅ RTL/LTR automatic switching
- ✅ Language switcher component
- ✅ Clean URLs (no /ar prefix)
- ✅ Locale-based routing

---

## Next Steps

### Sprint 2+ Translations

When building new features:

1. Add keys to both `ar.json` and `en.json`
2. Use `useTranslations()` in components
3. Test both languages
4. Ensure RTL layout works correctly

### Pages to Translate

- [ ] Login page
- [ ] Register page
- [ ] Dashboard layout
- [ ] Dashboard home
- [ ] Stores (Sprint 2)
- [ ] Products (Sprint 3)
- [ ] Orders (Sprint 5)
- [ ] Settings (Sprint 7)

---

## Resources

- **next-intl docs**: https://next-intl-docs.vercel.app/
- **Tailwind RTL**: https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support
- **Arabic translation standards**: Use Modern Standard Arabic (MSA)

---

**Multi-language support is ready! 🌍**

Arabic (العربية) is the default language, and users can switch to English anytime.
