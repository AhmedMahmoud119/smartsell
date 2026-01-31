# 🚀 StoreAR - AI-Powered Multi-Store E-Commerce + Marketing Platform

## Product Name: StoreAR
**Tagline:** منصة المتاجر الذكية للمسوقين - AI Stores + Product Landing Pages + Marketing Tools

---

## 🎯 COMPLETE VISION

### The Platform

A **SaaS for marketers and merchants** where:

1. **Each user can create multiple stores**
2. **Each store has multiple products**
3. **Each product gets an AI-generated landing page** (high-conversion product page)
4. **Full marketing pixel integration** (Facebook, TikTok, Google, Clarity)
5. **Built for performance marketing** (UTM tracking, conversion optimization, analytics)

### Target Users

- **Performance Marketers** (running Facebook/TikTok ads)
- **COD Merchants** (selling on social media)
- **Dropshippers** (testing products quickly)
- **Affiliate Marketers** (promoting products with custom pages)
- **Social Media Sellers** (Instagram/TikTok sellers)

### Key Differentiator

**Not Shopify. Not a page builder. It's an AI-powered marketing platform for Arabic e-commerce.**

---

## 1️⃣ UPDATED ARCHITECTURE

### 1.1 Platform Structure

```
User (Marketer/Merchant)
└── Workspace
    └── Store(s)
        ├── Store Settings
        │   ├── Currency (SAR, USD, AED, EGP, etc.)
        │   ├── Multi-currency support (Pro+)
        │   └── Auto currency conversion
        │
        ├── Products
        │   └── AI-Generated Landing Page (per product)
        │       ├── Conversion-optimized sections
        │       ├── Order form / WhatsApp CTA
        │       ├── Multi-currency pricing
        │       └── Tracking pixels fired
        │
        ├── Store Pages (Home, About, All Products)
        ├── Orders (stored in original currency)
        ├── Customers
        │
        └── Marketing Settings
            ├── Facebook Pixel
            ├── TikTok Pixel
            ├── Google Tag Manager
            ├── Microsoft Clarity
            ├── Snapchat Pixel
            └── Google Analytics 4
```

### 1.2 Product Landing Page System

**Every product has TWO presentations:**

1. **Store Product Page** (traditional e-commerce)
   - Simple product display in store catalog
   - Add to cart button
   - Part of store navigation

2. **AI Product Landing Page** (conversion-focused)
   - Standalone page (can share directly)
   - AI-generated sales copy
   - Conversion-optimized layout
   - Direct order form / WhatsApp
   - **Perfect for paid ads** (Facebook, TikTok, Google)

**Example:**
```
Store: متجر العطور الفاخرة
  ├── Store URL: https://perfume.storear.com
  │   └── Product listing: /products/royal-oud
  │
  └── Product "عطر عود ملكي"
      ├── Store product page: /products/royal-oud
      └── AI Landing Page: /l/royal-oud-special
          • Full landing page (Hero, Benefits, Testimonials, Order Form)
          • Tracks pixels
          • Perfect for ads
```

### 1.3 Marketing Flow

```
Marketer creates product
  ↓
AI generates landing page
  ↓
Marketer customizes (optional)
  ↓
Marketer sets up pixels (Facebook, TikTok, etc.)
  ↓
Marketer runs ads → Sends traffic to landing page
  ↓
Pixels track: PageView, ViewContent, AddToCart, Purchase
  ↓
Customer orders → Conversion tracked
  ↓
Marketer sees analytics (ROAS, conversion rate, pixel events)
```

---

## 2️⃣ UPDATED DATABASE SCHEMA

### 2.1 Add Marketing Tables

```prisma
// =====================
// STORES (Updated)
// =====================

model Store {
  id          String   @id @default(cuid())
  workspaceId String

  // ... existing fields ...

  // Marketing Pixels
  pixels      StorePixels?

  // Marketing Settings
  marketingSettings Json? // {utmDefaults, conversionGoals, etc.}

  // Relations
  products    Product[]
  // ... existing relations ...
}

// =====================
// MARKETING PIXELS
// =====================

model StorePixels {
  id          String   @id @default(cuid())
  storeId     String   @unique

  // Facebook
  facebookPixelId     String?
  facebookAccessToken String? // For Conversion API
  facebookTestMode    Boolean @default(false)

  // TikTok
  tiktokPixelId       String?
  tiktokAccessToken   String?
  tiktokTestMode      Boolean @default(false)

  // Google
  googleTagManagerId  String? // GTM-XXXXXX
  googleAnalyticsId   String? // G-XXXXXXXXXX
  googleAdsId         String? // AW-XXXXXXXXXX

  // Microsoft
  clarityId           String? // Clarity project ID

  // Snapchat
  snapchatPixelId     String?

  // Twitter/X
  twitterPixelId      String?

  // Custom Scripts
  customHeadScripts   String? // Additional <head> scripts
  customBodyScripts   String? // Additional <body> scripts

  // Status
  enabled     Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)

  @@index([storeId])
}

// =====================
// PRODUCTS (Updated)
// =====================

model Product {
  id          String   @id @default(cuid())
  storeId     String

  // ... existing fields ...

  // Landing Page
  hasLandingPage Boolean  @default(true)
  landingPageSlug String? // Custom slug for landing page
  landingPageSchema Json? // AI-generated landing page JSON

  // Marketing
  utmCampaign String?  // Default UTM for this product
  utmSource   String?
  utmMedium   String?

  // Conversion Tracking
  conversionValue Int?  // For pixel value tracking

  // Relations
  landingPageViews Int  @default(0)
  landingPageOrders Int @default(0)

  // ... existing relations ...

  @@index([storeId, landingPageSlug])
}

// =====================
// TRACKING EVENTS
// =====================

model TrackingEvent {
  id          String   @id @default(cuid())
  storeId     String
  productId   String?
  orderId     String?

  // Event Details
  eventType   PixelEvent
  pixelType   PixelType

  // Event Data
  eventData   Json     // {value, currency, content_ids, etc.}

  // User Info
  fbp         String?  // Facebook browser ID
  fbc         String?  // Facebook click ID
  userAgent   String?
  ipAddress   String?

  // UTM Params
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  utmContent  String?
  utmTerm     String?

  // Server-Side Status
  sentToServer Boolean @default(false)
  serverResponse Json?

  createdAt   DateTime @default(now())

  @@index([storeId, eventType])
  @@index([productId])
  @@index([orderId])
  @@index([createdAt])
}

enum PixelEvent {
  PAGE_VIEW
  VIEW_CONTENT
  ADD_TO_CART
  INITIATE_CHECKOUT
  PURCHASE
  LEAD
  COMPLETE_REGISTRATION
}

enum PixelType {
  FACEBOOK
  TIKTOK
  GOOGLE
  SNAPCHAT
  TWITTER
}

// =====================
// CONVERSION EVENTS (For CAPI)
// =====================

model ConversionEvent {
  id          String   @id @default(cuid())
  storeId     String
  orderId     String

  // Conversion Details
  pixelType   PixelType
  eventType   PixelEvent
  value       Int      // Order value
  currency    String

  // Customer Data (hashed for CAPI)
  customerEmail     String?
  customerPhone     String?
  customerName      String?
  customerCity      String?
  customerCountry   String?

  // Click IDs
  fbclid      String?  // Facebook Click ID
  ttclid      String?  // TikTok Click ID
  gclid       String?  // Google Click ID

  // Server Event
  eventId     String   @unique // Deduplication ID
  sentToServer Boolean @default(false)
  serverStatus String? // success, failed
  serverResponse Json?

  createdAt   DateTime @default(now())
  sentAt      DateTime?

  @@index([storeId])
  @@index([orderId])
  @@index([sentToServer])
}
```

---

## 2️⃣A MULTI-CURRENCY SYSTEM

### 2.A.1 Currency Architecture

**Support for Multiple Currencies per Store**

```typescript
Supported Currencies:
- SAR (Saudi Riyal) - Default for Saudi market
- AED (UAE Dirham)
- USD (US Dollar)
- EUR (Euro)
- EGP (Egyptian Pound)
- KWD (Kuwaiti Dinar)
- BHD (Bahraini Dinar)
- OMR (Omani Rial)
- QAR (Qatari Riyal)
- JOD (Jordanian Dinar)
- MAD (Moroccan Dirham)
```

### 2.A.2 Currency Database Schema

```prisma
// =====================
// STORES (Updated for Currency)
// =====================

model Store {
  id          String   @id @default(cuid())
  workspaceId String

  // ... existing fields ...

  // Currency Settings
  currency    String   @default("SAR") // Primary store currency

  // Multi-currency (Pro+ feature)
  enabledCurrencies Json?  // ["SAR", "AED", "USD"]
  autoConvert       Boolean @default(false)

  // Exchange Rates (cached, updated daily)
  exchangeRates     Json?  // {"AED": 1.02, "USD": 3.75, ...}
  ratesUpdatedAt    DateTime?

  // ... rest of fields ...
}

// =====================
// PRODUCTS (Updated for Currency)
// =====================

model Product {
  id          String   @id @default(cuid())
  storeId     String

  // ... existing fields ...

  // Pricing (stored in store's primary currency)
  price       Int      // In cents, primary currency
  compareAtPrice Int?
  costPrice   Int?

  // Multi-currency pricing (optional, Pro+ feature)
  priceMultiCurrency Json? // {"AED": 29900, "USD": 7999, ...}

  // ... rest of fields ...
}

// =====================
// ORDERS (Updated for Currency)
// =====================

model Order {
  id          String   @id @default(cuid())
  storeId     String
  workspaceId String

  // ... existing fields ...

  // Pricing
  subtotal    Int      // In cents
  shipping    Int      @default(0)
  tax         Int      @default(0)
  discount    Int      @default(0)
  total       Int

  // Currency (order stored in customer's selected currency)
  currency    String   @default("SAR")

  // Exchange rate at time of order (for reporting)
  exchangeRate Float?  // Rate to primary currency
  totalInPrimaryCurrency Int? // Converted amount

  // ... rest of fields ...
}

// =====================
// CURRENCY EXCHANGE RATES
// =====================

model ExchangeRate {
  id          String   @id @default(cuid())

  fromCurrency String
  toCurrency   String
  rate         Float

  source      String   @default("openexchangerates") // API source

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([fromCurrency, toCurrency])
  @@index([fromCurrency])
  @@index([updatedAt])
}
```

### 2.A.3 Currency Features by Plan

| Feature | Free | Starter | Pro | Agency |
|---------|------|---------|-----|--------|
| Single Currency | ✅ | ✅ | ✅ | ✅ |
| **Multi-Currency** | ❌ | ❌ | ✅ | ✅ |
| **Auto Currency Conversion** | ❌ | ❌ | ✅ | ✅ |
| **Custom Exchange Rates** | ❌ | ❌ | ❌ | ✅ |
| Currency Switcher on Store | ❌ | ❌ | ✅ | ✅ |

### 2.A.4 How Multi-Currency Works

**1. Store Setup**
```typescript
Merchant sets:
- Primary currency: SAR (all products priced in SAR)
- Enabled currencies: ["SAR", "AED", "USD"] (Pro+ feature)
- Auto-convert: true (use live exchange rates)
```

**2. Product Pricing**
```typescript
Option A: Single Currency (Free/Starter)
- Product price: 299 SAR
- Customers see: 299 SAR only

Option B: Multi-Currency Auto Convert (Pro+)
- Product price: 299 SAR (base)
- Customer in UAE sees: 299 AED (auto-converted)
- Customer in USA sees: $80 USD (auto-converted)

Option C: Manual Multi-Currency Pricing (Pro+)
- Merchant sets:
  - SAR: 299
  - AED: 289 (custom price for UAE market)
  - USD: 79 (custom price for USA)
```

**3. Customer Experience**
```typescript
Customer visits store:
  ↓
Auto-detect location (IP-based)
  ↓
Show prices in detected currency (if enabled)
  ↓
Currency switcher available (dropdown)
  ↓
Customer selects preferred currency
  ↓
All prices update in real-time
  ↓
Order placed in selected currency
  ↓
Order stored with currency + exchange rate
```

**4. Merchant Analytics**
```typescript
Revenue Dashboard:
- Total revenue (in primary currency): 50,000 SAR
- Orders by currency:
  • SAR: 30,000 SAR (60%)
  • AED: 15,000 SAR equivalent (30%)
  • USD: 5,000 SAR equivalent (10%)

All reports normalized to primary currency for consistency.
```

### 2.A.5 Currency Display Format

```typescript
// lib/utils/currency.ts

export const CURRENCY_FORMATS = {
  SAR: { symbol: 'ر.س', position: 'after', decimals: 2, locale: 'ar-SA' },
  AED: { symbol: 'د.إ', position: 'after', decimals: 2, locale: 'ar-AE' },
  USD: { symbol: '$', position: 'before', decimals: 2, locale: 'en-US' },
  EUR: { symbol: '€', position: 'after', decimals: 2, locale: 'en-EU' },
  EGP: { symbol: 'ج.م', position: 'after', decimals: 2, locale: 'ar-EG' },
  KWD: { symbol: 'د.ك', position: 'after', decimals: 3, locale: 'ar-KW' },
  BHD: { symbol: 'د.ب', position: 'after', decimals: 3, locale: 'ar-BH' },
  OMR: { symbol: 'ر.ع', position: 'after', decimals: 3, locale: 'ar-OM' },
  QAR: { symbol: 'ر.ق', position: 'after', decimals: 2, locale: 'ar-QA' },
  JOD: { symbol: 'د.أ', position: 'after', decimals: 3, locale: 'ar-JO' },
  MAD: { symbol: 'د.م', position: 'after', decimals: 2, locale: 'ar-MA' },
};

export function formatCurrency(amount: number, currency: string): string {
  const format = CURRENCY_FORMATS[currency];
  const value = (amount / 100).toFixed(format.decimals);

  return format.position === 'before'
    ? `${format.symbol}${value}`
    : `${value} ${format.symbol}`;
}

// Examples:
formatCurrency(29900, 'SAR') // "299.00 ر.س"
formatCurrency(7999, 'USD')  // "$79.99"
formatCurrency(28900, 'AED') // "289.00 د.إ"
```

### 2.A.6 Exchange Rate API Integration

```typescript
// backend: modules/currency/currency.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CurrencyService {
  constructor(private prisma: PrismaService) {}

  // Update exchange rates daily at 2 AM
  @Cron('0 2 * * *')
  async updateExchangeRates() {
    const baseCurrency = 'SAR';

    // Use Open Exchange Rates API (free tier: 1000 requests/month)
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${process.env.EXCHANGE_RATE_API_KEY}&base=${baseCurrency}`
    );

    const data = await response.json();
    const rates = data.rates;

    // Update rates in database
    for (const [currency, rate] of Object.entries(rates)) {
      await this.prisma.exchangeRate.upsert({
        where: {
          fromCurrency_toCurrency: {
            fromCurrency: baseCurrency,
            toCurrency: currency,
          },
        },
        update: {
          rate: rate as number,
          updatedAt: new Date(),
        },
        create: {
          fromCurrency: baseCurrency,
          toCurrency: currency,
          rate: rate as number,
          source: 'openexchangerates',
        },
      });
    }

    console.log('✅ Exchange rates updated');
  }

  async convertPrice(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) return amount;

    const rate = await this.prisma.exchangeRate.findUnique({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency,
          toCurrency,
        },
      },
    });

    if (!rate) {
      throw new Error(`Exchange rate not found: ${fromCurrency} -> ${toCurrency}`);
    }

    return Math.round(amount * rate.rate);
  }
}
```

### 2.A.7 Currency Switcher Component

```typescript
// components/storefront/CurrencySwitcher.tsx

'use client';

import { useState } from 'react';
import { useCurrencyStore } from '@/lib/store/currencyStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CurrencySwitcher({ enabledCurrencies }) {
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {enabledCurrencies.map((curr) => (
          <SelectItem key={curr} value={curr}>
            {getCurrencyLabel(curr)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function getCurrencyLabel(currency: string): string {
  const labels = {
    SAR: 'ر.س SAR',
    AED: 'د.إ AED',
    USD: '$ USD',
    EUR: '€ EUR',
    EGP: 'ج.م EGP',
    KWD: 'د.ك KWD',
  };
  return labels[currency] || currency;
}
```

```typescript
// lib/store/currencyStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyStore {
  currency: string;
  setCurrency: (currency: string) => void;
  exchangeRates: Record<string, number>;
  setExchangeRates: (rates: Record<string, number>) => void;
  convertPrice: (amount: number, fromCurrency: string) => number;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'SAR', // Default
      exchangeRates: {},

      setCurrency: (currency) => set({ currency }),

      setExchangeRates: (rates) => set({ exchangeRates: rates }),

      convertPrice: (amount, fromCurrency) => {
        const { currency: toCurrency, exchangeRates } = get();

        if (fromCurrency === toCurrency) return amount;

        const rate = exchangeRates[toCurrency];
        return rate ? Math.round(amount * rate) : amount;
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);
```

### 2.A.8 Currency APIs

**GET /api/stores/:storeId/currencies**
```typescript
Response 200:
{
  "primaryCurrency": "SAR",
  "enabledCurrencies": ["SAR", "AED", "USD"],
  "autoConvert": true,
  "exchangeRates": {
    "AED": 1.02,
    "USD": 3.75,
    "EUR": 4.10
  },
  "ratesUpdatedAt": "2024-01-15T02:00:00Z"
}
```

**PATCH /api/stores/:storeId/currencies**
```typescript
Request:
{
  "enabledCurrencies": ["SAR", "AED", "USD", "EGP"],
  "autoConvert": true
}

Response 200: { /* Updated settings */ }
```

**POST /api/currency/convert**
```typescript
Request:
{
  "amount": 29900,
  "fromCurrency": "SAR",
  "toCurrency": "AED"
}

Response 200:
{
  "amount": 30498,
  "fromCurrency": "SAR",
  "toCurrency": "AED",
  "rate": 1.02,
  "formatted": "304.98 د.إ"
}
```

### 2.A.9 Currency in Pixel Tracking

```typescript
// When tracking purchase events, include currency
trackEvent({
  eventType: 'PURCHASE',
  orderId: 'order_123',
  value: 29900,
  currency: 'SAR', // Important for Facebook/TikTok CAPI
});

// Facebook CAPI accepts any currency
{
  "event_name": "Purchase",
  "custom_data": {
    "value": 299.00,
    "currency": "SAR" // ISO 4217 currency code
  }
}
```

---

## 3️⃣ AI SYSTEM (UPDATED)

### 3.1 New AI Engine: Product Landing Page Builder

**Purpose:** Generate high-conversion product landing page

**Inputs:**
```typescript
interface ProductLandingPageInput {
  productName: string;
  productDescription: string;
  price: number;
  currency: string;
  images: string[];

  // Product details
  targetAudience: string;
  mainBenefit: string;
  keyFeatures: string[];

  // Offer
  hasDiscount: boolean;
  discountPercent?: number;
  specialOffer?: string;

  // Social proof
  hasTestimonials: boolean;
  testimonials?: Array<{name: string; text: string; rating: number}>;

  // CTA preference
  ctaType: 'WHATSAPP' | 'ORDER_FORM' | 'BOTH';
  whatsappNumber?: string;
}
```

**Outputs:**
```typescript
interface ProductLandingPageOutput {
  schema: PageSchema; // Full landing page JSON (reusing structure from ARCHITECTURE.md)

  sections: Array<{
    type: 'HERO' | 'BENEFITS' | 'FEATURES' | 'SOCIAL_PROOF' |
          'HOW_IT_WORKS' | 'OFFER' | 'FAQ' | 'ORDER_FORM' | 'GUARANTEE';
    data: any;
    order: number;
  }>;

  // Recommended for marketer
  recommendations: {
    suggestedAdCopy: string[];        // 3 ad headlines for Facebook/TikTok
    suggestedTargeting: string[];     // Audience suggestions
    estimatedConversionRate: number;  // Based on page quality
  };
}
```

**Prompt:**
```typescript
const PRODUCT_LANDING_PAGE_PROMPT = `
أنت خبير تصميم صفحات هبوط عالية التحويل للمسوقين العرب.

المهمة: إنشاء صفحة هبوط كاملة لبيع منتج عبر الإعلانات المدفوعة.

معلومات المنتج:
- الاسم: {{productName}}
- الوصف: {{productDescription}}
- السعر: {{price}} {{currency}}
- الجمهور المستهدف: {{targetAudience}}
- الفائدة الرئيسية: {{mainBenefit}}
- المميزات: {{keyFeatures}}
- العرض الخاص: {{specialOffer}}

قواعد المسوقين:
1. الصفحة يجب أن تكون مُحسّنة للإعلانات (Facebook, TikTok)
2. التركيز على التحويل وليس التصميم
3. استخدام علم النفس الشرائي:
   - الاستعجال (عرض محدود)
   - الندرة (كمية محدودة)
   - الدليل الاجتماعي (شهادات، مبيعات)
   - ضمان استرجاع (تقليل المخاطر)
4. CTA واضح ومكرر (3-4 مرات في الصفحة)
5. نموذج طلب بسيط (اسم، هاتف، عنوان فقط)

صمم صفحة تحتوي على:
1. Hero قوي (عنوان + صورة + CTA)
2. قسم الفوائد (3-5 فوائد)
3. الدليل الاجتماعي (عدد الزبائن / تقييمات)
4. العرض (السعر + الخصم + شحن مجاني)
5. ضمان استرجاع المال
6. FAQ (3-5 أسئلة شائعة)
7. نموذج الطلب النهائي

أرجع JSON كامل للصفحة مع جميع الأقسام.

إضافة: اقترح 3 عناوين إعلانات مناسبة لهذا المنتج.
`;
```

**Example Generated Landing Page Schema:**

```json
{
  "productId": "prod_123",
  "slug": "royal-oud-special",
  "metadata": {
    "title": "عطر عود ملكي - عرض خاص 50% خصم",
    "description": "احصل على عطر عود ملكي الفاخر بخصم 50% - شحن مجاني - ضمان استرجاع المال",
    "ogImage": "https://...",
    "pixelEvents": ["ViewContent", "AddToCart", "InitiateCheckout", "Purchase"]
  },
  "theme": {
    "colors": {
      "primary": "#d4af37",
      "cta": "#10b981"
    }
  },
  "sections": [
    {
      "id": "hero_1",
      "type": "HERO",
      "order": 1,
      "locked": true,
      "data": {
        "headline": "احصل على عطر عود ملكي الأصلي بخصم 50%",
        "subheadline": "رائحة فاخرة تدوم 24 ساعة - عرض محدود لـ 48 ساعة فقط",
        "image": "https://...",
        "cta": {
          "text": "اطلب الآن - ادفع عند الاستلام",
          "action": {"type": "SCROLL_TO_FORM"},
          "trackEvent": "InitiateCheckout"
        }
      }
    },
    {
      "id": "social_proof_1",
      "type": "SOCIAL_PROOF",
      "order": 2,
      "data": {
        "stats": [
          {"value": "12,000+", "label": "زبون راضي"},
          {"value": "4.9/5", "label": "التقييم"},
          {"value": "98%", "label": "يوصون به"}
        ]
      }
    },
    {
      "id": "benefits_1",
      "type": "BENEFITS",
      "order": 3,
      "data": {
        "title": "لماذا عطر عود ملكي؟",
        "benefits": [
          {
            "icon": "✨",
            "title": "رائحة تدوم 24 ساعة",
            "description": "تركيبة مركزة تبقى طوال اليوم"
          },
          {
            "icon": "🌿",
            "title": "مكونات طبيعية 100%",
            "description": "خالي من الكحول والمواد الضارة"
          },
          {
            "icon": "👑",
            "title": "عطر ملكي فاخر",
            "description": "رائحة شرقية أصيلة بجودة عالمية"
          }
        ]
      }
    },
    {
      "id": "offer_1",
      "type": "OFFER",
      "order": 4,
      "locked": true,
      "data": {
        "badge": "خصم 50% - عرض محدود",
        "pricing": {
          "original": 599,
          "current": 299,
          "currency": "SAR"
        },
        "features": [
          "خصم 50% على السعر الأصلي",
          "شحن مجاني لجميع المدن",
          "هدية مجانية: علبة فاخرة",
          "ضمان استرجاع المال خلال 30 يوم"
        ],
        "urgency": "ينتهي العرض خلال 48 ساعة ⏰",
        "cta": {
          "text": "اطلب الآن بخصم 50%",
          "action": {"type": "SCROLL_TO_FORM"},
          "trackEvent": "InitiateCheckout"
        }
      }
    },
    {
      "id": "testimonials_1",
      "type": "TESTIMONIALS",
      "order": 5,
      "data": {
        "title": "ماذا يقول عملاؤنا؟",
        "testimonials": [
          {
            "name": "محمد العتيبي",
            "rating": 5,
            "text": "أفضل عطر جربته! الرائحة تدوم فعلاً 24 ساعة",
            "location": "الرياض"
          }
        ]
      }
    },
    {
      "id": "faq_1",
      "type": "FAQ",
      "order": 6,
      "data": {
        "title": "الأسئلة الشائعة",
        "faqs": [
          {
            "question": "متى يصلني الطلب؟",
            "answer": "التوصيل خلال 2-4 أيام عمل لجميع مدن المملكة"
          },
          {
            "question": "هل الشحن فعلاً مجاني؟",
            "answer": "نعم، الشحن مجاني 100% لجميع المدن"
          },
          {
            "question": "ماذا لو لم يعجبني العطر؟",
            "answer": "ضمان استرجاع المال كاملاً خلال 30 يوم بدون أسئلة"
          }
        ]
      }
    },
    {
      "id": "order_form_1",
      "type": "ORDER_FORM",
      "order": 7,
      "locked": true,
      "data": {
        "title": "اطلب الآن - ادفع عند الاستلام",
        "subtitle": "املأ البيانات وسنتواصل معك خلال دقائق",
        "fields": [
          {
            "name": "customerName",
            "label": "الاسم الكامل",
            "type": "text",
            "required": true,
            "placeholder": "مثال: محمد أحمد"
          },
          {
            "name": "customerPhone",
            "label": "رقم الجوال",
            "type": "tel",
            "required": true,
            "placeholder": "05XXXXXXXX"
          },
          {
            "name": "customerCity",
            "label": "المدينة",
            "type": "select",
            "required": true,
            "options": ["الرياض", "جدة", "الدمام", "مكة", "المدينة", "أخرى"]
          },
          {
            "name": "customerAddress",
            "label": "العنوان التفصيلي",
            "type": "textarea",
            "required": true,
            "placeholder": "الحي، الشارع، رقم المبنى"
          },
          {
            "name": "quantity",
            "label": "الكمية",
            "type": "select",
            "required": true,
            "options": [
              "1 عبوة - 299 ريال",
              "2 عبوة - 549 ريال (وفر 49 ريال)",
              "3 عبوة - 799 ريال (وفر 98 ريال)"
            ]
          }
        ],
        "submitButton": {
          "text": "أكد الطلب الآن - ادفع عند الاستلام",
          "trackEvent": "Purchase"
        },
        "trust": [
          "✅ شحن مجاني",
          "✅ الدفع عند الاستلام",
          "✅ ضمان استرجاع المال"
        ]
      }
    }
  ],
  "recommendations": {
    "suggestedAdCopy": [
      "عطر عود ملكي الأصلي - خصم 50% لفترة محدودة 🔥",
      "رائحة تدوم 24 ساعة - جربه الآن بخصم نصف السعر ⚡",
      "أكثر من 12,000 زبون راضي - احصل على عطرك الآن 👑"
    ],
    "suggestedTargeting": [
      "رجال ونساء 25-45",
      "مهتمون بالعطور الفاخرة",
      "السعودية - الإمارات - الكويت"
    ],
    "estimatedConversionRate": 3.5
  }
}
```

---

## 4️⃣ MARKETING PIXEL INTEGRATION

### 4.1 Pixel Implementation Strategy

**Client-Side (Browser) + Server-Side (CAPI)**

```typescript
// Frontend pixel loading
// components/storefront/PixelScript.tsx

'use client';

import { useEffect } from 'react';
import { Store, StorePixels } from '@/types';

interface PixelScriptProps {
  store: Store;
  pixels: StorePixels;
}

export function PixelScript({ store, pixels }: PixelScriptProps) {
  useEffect(() => {
    // Facebook Pixel
    if (pixels.facebookPixelId) {
      loadFacebookPixel(pixels.facebookPixelId);
    }

    // TikTok Pixel
    if (pixels.tiktokPixelId) {
      loadTikTokPixel(pixels.tiktokPixelId);
    }

    // Google Tag Manager
    if (pixels.googleTagManagerId) {
      loadGTM(pixels.googleTagManagerId);
    }

    // Clarity
    if (pixels.clarityId) {
      loadClarity(pixels.clarityId);
    }

    // Snapchat Pixel
    if (pixels.snapchatPixelId) {
      loadSnapchatPixel(pixels.snapchatPixelId);
    }

    // Custom Scripts
    if (pixels.customHeadScripts) {
      injectCustomScripts(pixels.customHeadScripts);
    }
  }, [pixels]);

  return null;
}

function loadFacebookPixel(pixelId: string) {
  // Facebook Pixel Base Code
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
}

function loadTikTokPixel(pixelId: string) {
  // TikTok Pixel Code
  !(function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    (ttq.methods = [
      'page',
      'track',
      'identify',
      'instances',
      'debug',
      'on',
      'off',
      'once',
      'ready',
      'alias',
      'group',
      'enableCookie',
      'disableCookie',
    ]),
      (ttq.setAndDefer = function (t, e) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      });
    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    (ttq.instance = function (t) {
      for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
        ttq.setAndDefer(e, ttq.methods[n]);
      return e;
    }),
      (ttq.load = function (e, n) {
        var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        (ttq._i = ttq._i || {}),
          (ttq._i[e] = []),
          (ttq._i[e]._u = i),
          (ttq._t = ttq._t || {}),
          (ttq._t[e] = +new Date()),
          (ttq._o = ttq._o || {}),
          (ttq._o[e] = n || {});
        var o = document.createElement('script');
        (o.type = 'text/javascript'), (o.async = !0), (o.src = i + '?sdkid=' + e + '&lib=' + t);
        var a = document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(o, a);
      });

    ttq.load(pixelId);
    ttq.page();
  })(window, document, 'ttq');
}

function loadGTM(gtmId: string) {
  // Google Tag Manager
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', gtmId);
}

function loadClarity(clarityId: string) {
  // Microsoft Clarity
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', clarityId);
}

function loadSnapchatPixel(pixelId: string) {
  // Snapchat Pixel
  (function (e, t, n) {
    if (e.snaptr) return;
    var a = (e.snaptr = function () {
      a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments);
    });
    a.queue = [];
    var s = 'script';
    var r = t.createElement(s);
    r.async = !0;
    r.src = n;
    var u = t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r, u);
  })(window, document, 'https://sc-static.net/scevent.min.js');

  window.snaptr('init', pixelId);
  window.snaptr('track', 'PAGE_VIEW');
}
```

### 4.2 Event Tracking System

```typescript
// lib/tracking/events.ts

import { PixelEvent, PixelType } from '@/types';

interface TrackEventParams {
  eventType: PixelEvent;
  productId?: string;
  orderId?: string;
  value?: number;
  currency?: string;
  quantity?: number;
  customData?: Record<string, any>;
}

export async function trackEvent(params: TrackEventParams) {
  const {
    eventType,
    productId,
    orderId,
    value,
    currency = 'SAR',
    quantity = 1,
    customData = {},
  } = params;

  // 1. Track client-side (browser pixels)
  trackClientSide(eventType, {
    value,
    currency,
    content_ids: productId ? [productId] : [],
    content_type: 'product',
    num_items: quantity,
    ...customData,
  });

  // 2. Send to backend for server-side tracking (CAPI)
  await trackServerSide({
    eventType,
    productId,
    orderId,
    value,
    currency,
    quantity,
    customData,
  });
}

function trackClientSide(eventType: PixelEvent, data: any) {
  // Facebook Pixel
  if (window.fbq) {
    const fbEventName = mapToFacebookEvent(eventType);
    window.fbq('track', fbEventName, data);
  }

  // TikTok Pixel
  if (window.ttq) {
    const ttEventName = mapToTikTokEvent(eventType);
    window.ttq.track(ttEventName, data);
  }

  // Google Tag Manager
  if (window.dataLayer) {
    window.dataLayer.push({
      event: mapToGoogleEvent(eventType),
      ecommerce: {
        value: data.value,
        currency: data.currency,
        items: data.content_ids?.map((id: string) => ({
          item_id: id,
          quantity: data.num_items,
        })),
      },
    });
  }

  // Snapchat
  if (window.snaptr) {
    const scEventName = mapToSnapchatEvent(eventType);
    window.snaptr('track', scEventName, data);
  }
}

async function trackServerSide(params: any) {
  try {
    await fetch('/api/tracking/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        clientUserAgent: navigator.userAgent,
        clientIpAddress: await getClientIP(),
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
        ttp: getCookie('_ttp'),
        url: window.location.href,
        referrer: document.referrer,
      }),
    });
  } catch (error) {
    console.error('Server-side tracking failed:', error);
  }
}

function mapToFacebookEvent(event: PixelEvent): string {
  const map = {
    PAGE_VIEW: 'PageView',
    VIEW_CONTENT: 'ViewContent',
    ADD_TO_CART: 'AddToCart',
    INITIATE_CHECKOUT: 'InitiateCheckout',
    PURCHASE: 'Purchase',
    LEAD: 'Lead',
  };
  return map[event] || 'PageView';
}

function mapToTikTokEvent(event: PixelEvent): string {
  const map = {
    PAGE_VIEW: 'ViewContent',
    VIEW_CONTENT: 'ViewContent',
    ADD_TO_CART: 'AddToCart',
    INITIATE_CHECKOUT: 'InitiateCheckout',
    PURCHASE: 'CompletePayment',
    LEAD: 'SubmitForm',
  };
  return map[event] || 'ViewContent';
}

// Similar mappings for Google and Snapchat...
```

### 4.3 Server-Side Conversion API (CAPI)

```typescript
// backend: modules/tracking/tracking.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FacebookConversionAPI } from './integrations/facebook-capi';
import { TikTokEventsAPI } from './integrations/tiktok-events-api';

@Injectable()
export class TrackingService {
  constructor(
    private prisma: PrismaService,
    private facebookCAPI: FacebookConversionAPI,
    private tiktokEventsAPI: TikTokEventsAPI
  ) {}

  async trackEvent(params: {
    storeId: string;
    eventType: PixelEvent;
    productId?: string;
    orderId?: string;
    value?: number;
    currency?: string;
    customerEmail?: string;
    customerPhone?: string;
    clientUserAgent: string;
    clientIpAddress: string;
    fbp?: string;
    fbc?: string;
    url: string;
  }) {
    const { storeId, eventType, ...data } = params;

    // Get store pixels
    const pixels = await this.prisma.storePixels.findUnique({
      where: { storeId },
    });

    if (!pixels || !pixels.enabled) return;

    // Create tracking event record
    const event = await this.prisma.trackingEvent.create({
      data: {
        storeId,
        productId: data.productId,
        orderId: data.orderId,
        eventType,
        pixelType: 'FACEBOOK', // Will send to multiple
        eventData: data,
        fbp: data.fbp,
        fbc: data.fbc,
        userAgent: data.clientUserAgent,
        ipAddress: data.clientIpAddress,
      },
    });

    // Send to Facebook CAPI
    if (pixels.facebookPixelId && pixels.facebookAccessToken) {
      await this.sendToFacebookCAPI({
        pixelId: pixels.facebookPixelId,
        accessToken: pixels.facebookAccessToken,
        eventType,
        eventId: event.id, // For deduplication
        ...data,
      });
    }

    // Send to TikTok Events API
    if (pixels.tiktokPixelId && pixels.tiktokAccessToken) {
      await this.sendToTikTokEvents({
        pixelId: pixels.tiktokPixelId,
        accessToken: pixels.tiktokAccessToken,
        eventType,
        eventId: event.id,
        ...data,
      });
    }

    // Update event as sent
    await this.prisma.trackingEvent.update({
      where: { id: event.id },
      data: { sentToServer: true },
    });

    return event;
  }

  private async sendToFacebookCAPI(params: any) {
    return this.facebookCAPI.sendEvent(params);
  }

  private async sendToTikTokEvents(params: any) {
    return this.tiktokEventsAPI.sendEvent(params);
  }
}
```

**Facebook Conversion API Implementation:**

```typescript
// modules/tracking/integrations/facebook-capi.ts

import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class FacebookConversionAPI {
  async sendEvent(params: {
    pixelId: string;
    accessToken: string;
    eventType: string;
    eventId: string;
    value?: number;
    currency?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerName?: string;
    fbp?: string;
    fbc?: string;
    clientUserAgent: string;
    clientIpAddress: string;
    url: string;
  }) {
    const {
      pixelId,
      accessToken,
      eventType,
      eventId,
      value,
      currency,
      customerEmail,
      customerPhone,
      customerName,
      fbp,
      fbc,
      clientUserAgent,
      clientIpAddress,
      url,
    } = params;

    const eventTime = Math.floor(Date.now() / 1000);

    const payload = {
      data: [
        {
          event_name: eventType,
          event_time: eventTime,
          event_id: eventId, // Deduplication
          event_source_url: url,
          action_source: 'website',

          user_data: {
            em: customerEmail ? this.hashData(customerEmail) : undefined,
            ph: customerPhone ? this.hashData(customerPhone) : undefined,
            fn: customerName ? this.hashData(customerName.split(' ')[0]) : undefined,
            client_ip_address: clientIpAddress,
            client_user_agent: clientUserAgent,
            fbp,
            fbc,
          },

          custom_data: {
            value,
            currency,
          },
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return result;
  }

  private hashData(data: string): string {
    return createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
  }
}
```

---

## 5️⃣ BACKEND APIs (UPDATED)

### 5.1 Pixel Management APIs

**GET /api/stores/:storeId/pixels**
```typescript
Response 200:
{
  "facebookPixelId": "123456789",
  "facebookTestMode": false,
  "tiktokPixelId": "ABC123",
  "googleTagManagerId": "GTM-XXXXXX",
  "googleAnalyticsId": "G-XXXXXXXXXX",
  "clarityId": "abc123def",
  "snapchatPixelId": null,
  "customHeadScripts": "<script>...</script>",
  "enabled": true
}
```

**PATCH /api/stores/:storeId/pixels**
```typescript
Request:
{
  "facebookPixelId": "123456789",
  "facebookAccessToken": "EAAxxxxxxxxxx", // For CAPI
  "tiktokPixelId": "ABC123",
  "googleTagManagerId": "GTM-XXXXXX",
  "clarityId": "abc123def"
}

Response 200: { /* Updated pixels */ }
```

**POST /api/stores/:storeId/pixels/test**
```typescript
// Test pixel installation
Request:
{
  "pixelType": "FACEBOOK"
}

Response 200:
{
  "success": true,
  "message": "Facebook Pixel detected and working",
  "eventsReceived": ["PageView", "ViewContent"]
}
```

---

### 5.2 Product Landing Page APIs

**POST /api/stores/:storeId/products/:productId/landing-page/generate**
```typescript
// Generate AI landing page for product
Request:
{
  "targetAudience": "رجال ونساء 25-45",
  "mainBenefit": "رائحة تدوم 24 ساعة",
  "hasDiscount": true,
  "discountPercent": 50,
  "specialOffer": "شحن مجاني + هدية",
  "ctaType": "ORDER_FORM"
}

Response 202:
{
  "jobId": "job_abc",
  "status": "PROCESSING"
}

// When complete:
Response 200:
{
  "landingPageSlug": "royal-oud-special",
  "url": "https://perfume.storear.com/l/royal-oud-special"
}
```

**GET /api/stores/:storeId/products/:productId/landing-page**
```typescript
Response 200:
{
  "slug": "royal-oud-special",
  "schema": { /* Full page JSON */ },
  "stats": {
    "views": 1250,
    "orders": 43,
    "conversionRate": 3.44
  }
}
```

**PATCH /api/stores/:storeId/products/:productId/landing-page**
```typescript
// Edit landing page
Request:
{
  "schema": { /* Updated page JSON */ }
}

Response 200: { /* Updated landing page */ }
```

---

### 5.3 Tracking APIs

**POST /api/tracking/events**
```typescript
// Client sends tracking events to backend for CAPI
Request:
{
  "storeId": "store_123",
  "eventType": "PURCHASE",
  "productId": "prod_123",
  "orderId": "order_456",
  "value": 29900,
  "currency": "SAR",
  "customerEmail": "customer@example.com",
  "customerPhone": "0501234567",
  "clientUserAgent": "Mozilla/5.0...",
  "clientIpAddress": "1.2.3.4",
  "fbp": "_fbp_cookie_value",
  "fbc": "_fbc_cookie_value",
  "url": "https://store.com/l/product"
}

Response 200:
{
  "success": true,
  "eventId": "evt_789"
}
```

**GET /api/stores/:storeId/analytics/pixels**
```typescript
// Pixel performance analytics
Response 200:
{
  "facebook": {
    "events": {
      "PageView": 5420,
      "ViewContent": 1250,
      "AddToCart": 320,
      "Purchase": 43
    },
    "conversionRate": 3.44,
    "lastSynced": "2024-01-15T12:00:00Z"
  },
  "tiktok": {
    "events": {
      "ViewContent": 1100,
      "CompletePayment": 38
    },
    "conversionRate": 3.45
  }
}
```

---

## 6️⃣ FRONTEND (UPDATED)

### 6.1 Updated Folder Structure

```
frontend/
├── app/
│   ├── (dashboard)/
│   │   └── stores/
│   │       └── [storeId]/
│   │           ├── products/
│   │           │   └── [id]/
│   │           │       ├── page.tsx            # Edit product
│   │           │       └── landing-page/
│   │           │           ├── page.tsx        # Edit AI landing page
│   │           │           └── preview/page.tsx
│   │           │
│   │           ├── marketing/
│   │           │   ├── pixels/page.tsx         # Pixel management
│   │           │   ├── analytics/page.tsx      # Marketing analytics
│   │           │   └── utm-builder/page.tsx    # UTM link builder
│   │           │
│   │           └── analytics/
│   │               └── conversions/page.tsx    # Conversion tracking
│   │
│   └── [storeSlug]/
│       ├── l/                                   # Landing pages
│       │   └── [landingPageSlug]/page.tsx      # Product landing page
│       │
│       └── products/
│           └── [slug]/page.tsx                 # Regular product page
│
├── components/
│   ├── marketing/
│   │   ├── PixelManager.tsx
│   │   ├── PixelTestButton.tsx
│   │   ├── ConversionTracker.tsx
│   │   └── UTMBuilder.tsx
│   │
│   └── landing-page/
│       ├── LandingPageEditor.tsx
│       ├── LandingPagePreview.tsx
│       └── SectionEditor.tsx
│
└── lib/
    └── tracking/
        ├── events.ts
        ├── facebook.ts
        └── tiktok.ts
```

### 6.2 Pixel Management UI

```typescript
// app/(dashboard)/stores/[storeId]/marketing/pixels/page.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useStorePixels, useUpdatePixels } from '@/lib/hooks/usePixels';

export default function PixelManagementPage({ params }) {
  const { pixels, isLoading } = useStorePixels(params.storeId);
  const { updatePixels, isUpdating } = useUpdatePixels();

  const [formData, setFormData] = useState({
    facebookPixelId: '',
    facebookAccessToken: '',
    tiktokPixelId: '',
    googleTagManagerId: '',
    clarityId: '',
  });

  const handleSave = async () => {
    await updatePixels(params.storeId, formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">إدارة البكسلات والتتبع</h1>

      <div className="space-y-8">
        {/* Facebook Pixel */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white">
              f
            </div>
            <h2 className="text-xl font-bold">Facebook Pixel</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Pixel ID</Label>
              <Input
                placeholder="123456789012345"
                value={formData.facebookPixelId}
                onChange={(e) =>
                  setFormData({ ...formData, facebookPixelId: e.target.value })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                احصل على Pixel ID من{' '}
                <a
                  href="https://business.facebook.com/events_manager"
                  target="_blank"
                  className="text-blue-600"
                >
                  Events Manager
                </a>
              </p>
            </div>

            <div>
              <Label>Access Token (للتتبع من الخادم - اختياري)</Label>
              <Input
                type="password"
                placeholder="EAAxxxxxxxxxxxxxxx"
                value={formData.facebookAccessToken}
                onChange={(e) =>
                  setFormData({ ...formData, facebookAccessToken: e.target.value })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                لتفعيل Conversion API وتحسين دقة التتبع
              </p>
            </div>

            <Button variant="outline" size="sm">
              اختبار البكسل
            </Button>
          </div>
        </div>

        {/* TikTok Pixel */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-black rounded flex items-center justify-center text-white">
              TT
            </div>
            <h2 className="text-xl font-bold">TikTok Pixel</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Pixel ID</Label>
              <Input
                placeholder="ABCDEFGHIJK"
                value={formData.tiktokPixelId}
                onChange={(e) =>
                  setFormData({ ...formData, tiktokPixelId: e.target.value })
                }
              />
            </div>

            <Button variant="outline" size="sm">
              اختبار البكسل
            </Button>
          </div>
        </div>

        {/* Google Tag Manager */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white">
              G
            </div>
            <h2 className="text-xl font-bold">Google Tag Manager</h2>
          </div>

          <div>
            <Label>Container ID</Label>
            <Input
              placeholder="GTM-XXXXXXX"
              value={formData.googleTagManagerId}
              onChange={(e) =>
                setFormData({ ...formData, googleTagManagerId: e.target.value })
              }
            />
          </div>
        </div>

        {/* Microsoft Clarity */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white">
              C
            </div>
            <h2 className="text-xl font-bold">Microsoft Clarity</h2>
          </div>

          <div>
            <Label>Project ID</Label>
            <Input
              placeholder="abc123def456"
              value={formData.clarityId}
              onChange={(e) => setFormData({ ...formData, clarityId: e.target.value })}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isUpdating} size="lg">
            {isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 6.3 Landing Page Renderer (Public)

```typescript
// app/[storeSlug]/l/[landingPageSlug]/page.tsx

import { getStore } from '@/lib/api/stores';
import { getProductLandingPage } from '@/lib/api/products';
import { PageRenderer } from '@/components/renderer/PageRenderer';
import { PixelScript } from '@/components/storefront/PixelScript';
import { TrackPageView } from '@/components/tracking/TrackPageView';

export default async function ProductLandingPage({ params }) {
  const store = await getStore(params.storeSlug);
  const landingPage = await getProductLandingPage(
    store.id,
    params.landingPageSlug
  );

  return (
    <>
      {/* Load pixels */}
      <PixelScript store={store} pixels={store.pixels} />

      {/* Track page view */}
      <TrackPageView
        storeId={store.id}
        productId={landingPage.productId}
        eventType="VIEW_CONTENT"
      />

      {/* Render landing page */}
      <PageRenderer schema={landingPage.schema} mode="public" />
    </>
  );
}
```

```typescript
// components/tracking/TrackPageView.tsx

'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking/events';

export function TrackPageView({ storeId, productId, eventType }) {
  useEffect(() => {
    trackEvent({
      eventType,
      productId,
    });
  }, []);

  return null;
}
```

---

## 7️⃣ MVP SCOPE (FINAL)

### ✅ Included in MVP

**Core Features:**
- ✅ Multi-store management
- ✅ Product management with AI descriptions
- ✅ **AI-generated product landing pages**
- ✅ **Marketing pixel integration** (Facebook, TikTok, Google, Clarity)
- ✅ **Server-side conversion tracking (CAPI)**
- ✅ Shopping cart + checkout (COD)
- ✅ Order management
- ✅ Customer database
- ✅ Basic analytics

**Marketing Tools:**
- ✅ Facebook Pixel + Conversion API
- ✅ TikTok Pixel + Events API
- ✅ Google Tag Manager
- ✅ Microsoft Clarity
- ✅ UTM tracking
- ✅ Conversion tracking
- ✅ Pixel testing tools

**AI Features:**
- ✅ Store setup AI
- ✅ Product description AI
- ✅ **Product landing page builder AI**

---

### ❌ Postponed (Post-MVP)

- Custom domains
- Multiple payment gateways
- Discount codes
- Abandoned cart recovery
- Email marketing automation
- SMS notifications
- Advanced A/B testing
- Heatmaps
- Customer login/accounts
- Wishlist
- Product reviews
- Multi-language
- Mobile app

---

## 8️⃣ PRICING (UPDATED)

| Feature | Free | Starter ($29/mo) | Pro ($79/mo) | Agency ($199/mo) |
|---------|------|------------------|--------------|------------------|
| Stores | 1 | 3 | 10 | 50 |
| Products/store | 10 | 200 | Unlimited | Unlimited |
| AI Landing Pages | 10 | 200 | Unlimited | Unlimited |
| Orders/month | 50 | 1,000 | Unlimited | Unlimited |
| AI Generations | 50 | 500 | 2,000 | 10,000 |
| **Marketing Pixels** | ✅ All | ✅ All | ✅ All | ✅ All |
| **Conversion API** | ❌ | ✅ | ✅ | ✅ |
| **Multi-Currency** | ❌ | ❌ | ✅ | ✅ |
| **Currency Auto-Convert** | ❌ | ❌ | ✅ | ✅ |
| **Custom Exchange Rates** | ❌ | ❌ | ❌ | ✅ |
| Custom Domain | ❌ | ❌ | ✅ | ✅ |
| Remove Branding | ❌ | ❌ | ✅ | ✅ |
| WhatsApp Integration | ❌ | ❌ | ✅ | ✅ |
| **Advanced Analytics** | ❌ | ❌ | ✅ | ✅ |
| Team Members | 1 | 2 | 5 | 20 |
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| **White Label** | ❌ | ❌ | ❌ | ✅ |

### Supported Currencies

**All Plans:**
- Single currency per store (choose from 11 currencies)

**Pro & Agency Plans:**
- Multi-currency support (enable multiple currencies)
- Auto currency conversion with live exchange rates
- Currency switcher on storefront
- Orders tracked in customer's currency

**Available Currencies:**
```
SAR - Saudi Riyal (ر.س)
AED - UAE Dirham (د.إ)
USD - US Dollar ($)
EUR - Euro (€)
EGP - Egyptian Pound (ج.م)
KWD - Kuwaiti Dinar (د.ك)
BHD - Bahraini Dinar (د.ب)
OMR - Omani Rial (ر.ع)
QAR - Qatari Riyal (ر.ق)
JOD - Jordanian Dinar (د.أ)
MAD - Moroccan Dirham (د.م)
```

---

## 9️⃣ COMPETITIVE ADVANTAGE (FINAL)

### Why Marketers Will Choose StoreAR

**1. AI Landing Pages = Higher Conversions**
- Every product gets a conversion-optimized landing page
- Perfect for paid ads (Facebook, TikTok, Google)
- No need to hire copywriters or designers

**2. Built for Performance Marketing**
- All pixels integrated (FB, TikTok, Google, Clarity)
- Server-side tracking (CAPI) = better iOS 14+ tracking
- UTM tracking built-in
- Conversion tracking automatic

**3. Fastest Setup in the Industry**
- 3 minutes: Create store (AI)
- 1 minute: Add product with AI landing page
- 30 seconds: Add pixel
- **READY TO RUN ADS**

**4. Arabic Market Expertise**
- AI trained on Arabic sales psychology
- COD-optimized (default payment method)
- Arabic copywriting that converts
- Local market knowledge

**5. All-in-One Platform**
- Don't need: Shopify + ClickFunnels + Analytics
- Everything in one platform
- One monthly price
- No hidden fees

---

## 🎯 IMPLEMENTATION PLAN

### Phase 1-2: Foundation (Weeks 1-4)
- Database + Backend + Frontend structure
- Authentication + Workspaces + Stores
- AI engines (Store, Product Description, **Landing Page**)

### Phase 3: Marketing Core (Weeks 5-6)
- **Pixel integration system**
- **Landing page builder AI**
- **Conversion API (Facebook, TikTok)**
- Landing page editor

### Phase 4: E-Commerce (Weeks 7-8)
- Product management
- Cart + Checkout
- Order management

### Phase 5: Launch (Weeks 9-10)
- Analytics dashboard
- Marketing analytics
- Pixel testing tools
- Billing + Deploy

**Total: 10 weeks to MVP**

---

## ✅ COMPLETE ARCHITECTURE

This is now a **complete, production-ready architecture** for:
- ✅ Multi-store SaaS
- ✅ AI product landing page builder
- ✅ Full marketing pixel integration
- ✅ Conversion tracking (client + server)
- ✅ Built for performance marketers

**Ready to build. What should I start with?** 🚀

1. Complete database schema (with pixels + tracking tables)
2. AI landing page builder engine
3. Pixel integration system (Facebook, TikTok, etc.)
4. Backend APIs (stores, products, pixels, tracking)
5. Full frontend implementation
6. Everything in phases (10-week plan)
