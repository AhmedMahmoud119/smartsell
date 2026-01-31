# 💱 Multi-Currency Support - Complete Guide

## Overview

StoreAR supports **11 major currencies** with automatic conversion and flexible pricing options.

---

## 🌍 Supported Currencies

| Currency | Code | Symbol | Decimals | Region |
|----------|------|--------|----------|--------|
| Saudi Riyal | SAR | ر.س | 2 | Saudi Arabia |
| UAE Dirham | AED | د.إ | 2 | UAE |
| US Dollar | USD | $ | 2 | International |
| Euro | EUR | € | 2 | Europe |
| Egyptian Pound | EGP | ج.م | 2 | Egypt |
| Kuwaiti Dinar | KWD | د.ك | 3 | Kuwait |
| Bahraini Dinar | BHD | د.ب | 3 | Bahrain |
| Omani Rial | OMR | ر.ع | 3 | Oman |
| Qatari Riyal | QAR | ر.ق | 2 | Qatar |
| Jordanian Dinar | JOD | د.أ | 3 | Jordan |
| Moroccan Dirham | MAD | د.م | 2 | Morocco |

---

## 📋 How It Works

### Free & Starter Plans (Single Currency)

```
Merchant Setup:
1. Choose primary currency (e.g., SAR)
2. All products priced in SAR
3. Customers see prices in SAR only

Example:
- Product: عطر عود ملكي
- Price: 299 ر.س
- All customers see: 299 ر.س
```

### Pro & Agency Plans (Multi-Currency)

```
Merchant Setup:
1. Primary currency: SAR
2. Enable additional currencies: AED, USD, EGP
3. Choose pricing method:
   - Auto-convert (live exchange rates)
   - Manual pricing per currency

Customer Experience:
1. Visits store from UAE
2. Sees prices in AED automatically
3. Can switch to USD or SAR if preferred
4. Places order in chosen currency
```

---

## 🎨 Three Pricing Methods

### Method 1: Single Currency (Free/Starter)
```typescript
Product Setup:
- Price: 299 SAR

Customer Sees:
- Everyone: 299 ر.س
```

**Use Case:** Simple stores targeting one market

---

### Method 2: Auto Currency Conversion (Pro+)
```typescript
Product Setup:
- Base Price: 299 SAR
- Auto-convert: ON

Customer Sees (based on location):
- Saudi: 299 ر.س
- UAE: 305 د.إ (auto-converted)
- USA: $80 (auto-converted)
- Egypt: 2,330 ج.م (auto-converted)

Exchange rates updated daily automatically.
```

**Use Case:** Stores targeting multiple markets with minimal setup

**Advantages:**
- ✅ Zero manual work
- ✅ Always up-to-date rates
- ✅ Consistent margins

---

### Method 3: Manual Multi-Currency Pricing (Pro+)
```typescript
Product Setup:
- SAR: 299 ر.س
- AED: 289 د.إ (cheaper for UAE market)
- USD: 79 $ (rounded pricing)
- EGP: 2,290 ج.م (custom price)

Customer Sees:
- Saudi: 299 ر.س
- UAE: 289 د.إ (custom price)
- USA: $79 (custom price)
```

**Use Case:** Advanced merchants optimizing for each market

**Advantages:**
- ✅ Market-specific pricing
- ✅ Psychological pricing (e.g., $79 instead of $79.73)
- ✅ Competitive pricing per region

---

## 🛒 Customer Experience

### Automatic Currency Detection

```
Customer visits store
  ↓
System detects IP location
  ↓
Shows prices in local currency (if enabled)
  ↓
Customer can override with currency switcher
  ↓
All prices update instantly
  ↓
Checkout in selected currency
```

### Currency Switcher UI

```
┌─────────────────────────────────┐
│  Header                         │
│  ┌──────────────┐              │
│  │ ر.س SAR ▼    │ ← Dropdown   │
│  └──────────────┘              │
│                                 │
│  Product: 299 ر.س              │
└─────────────────────────────────┘

Customer clicks dropdown:
┌──────────────┐
│ ✓ ر.س SAR    │
│   د.إ AED    │
│   $ USD      │
│   € EUR      │
│   ج.م EGP    │
└──────────────┘

Selects AED:
All prices update → 305 د.إ
```

---

## 📊 Merchant Analytics

### Revenue Dashboard

```typescript
Total Revenue (Primary Currency: SAR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 50,000 ر.س

Breakdown by Currency:
┌────────────────────────────────┐
│ SAR: 30,000 ر.س (60%)         │
│ AED: 15,300 AED → 15,000 SAR  │
│      (30%)                     │
│ USD: 1,330 USD → 5,000 SAR    │
│      (10%)                     │
└────────────────────────────────┘

All analytics normalized to primary currency
for easy reporting and comparison.
```

### Order Details

```typescript
Order #ORD-001
Customer: Ahmed (UAE)
Currency: AED
Items:
  - Product A: 305 د.إ
  - Product B: 150 د.إ
Total: 455 د.إ

Exchange Rate at Order Time: 1.02
Total in Primary Currency (SAR): 446 ر.س
```

**Why Store Exchange Rate?**
- Accurate reporting even if rates change
- Historical accuracy
- Profit margin calculations

---

## ⚙️ Technical Implementation

### Database Schema

```prisma
model Store {
  // Primary currency (required)
  currency String @default("SAR")

  // Multi-currency settings (Pro+)
  enabledCurrencies String[] // ["SAR", "AED", "USD"]
  autoConvert       Boolean  @default(false)
  exchangeRates     Json?    // Cached rates
}

model Product {
  // Base price in primary currency
  price Int // 29900 (299.00 SAR in cents)

  // Optional: Manual multi-currency pricing
  priceMultiCurrency Json? // {"AED": 28900, "USD": 7900}
}

model Order {
  // Order stored in customer's currency
  currency String // "AED"
  total    Int    // 45500 (455.00 AED)

  // Conversion for reporting
  exchangeRate Float // 1.02
  totalInPrimaryCurrency Int // 44600 (446.00 SAR)
}

model ExchangeRate {
  fromCurrency String // "SAR"
  toCurrency   String // "AED"
  rate         Float  // 1.02
  updatedAt    DateTime
}
```

### Exchange Rate Updates

```typescript
Daily Cron Job (2 AM):
  ↓
Fetch rates from Open Exchange Rates API
  ↓
Update ExchangeRate table
  ↓
Update Store.exchangeRates cache
  ↓
Log update completion
```

**API Used:** [Open Exchange Rates](https://openexchangerates.org/)
- Free tier: 1,000 requests/month
- Updates once daily = 30 requests/month
- Well within free tier

### Currency Conversion Logic

```typescript
// Real-time conversion
function convertPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;

  const rate = getExchangeRate(fromCurrency, toCurrency);
  return Math.round(amount * rate);
}

// Example
convertPrice(29900, 'SAR', 'AED')
// → 30498 (304.98 AED)
```

### Frontend Currency Store

```typescript
// Zustand store for currency state
const useCurrencyStore = create({
  currency: 'SAR',
  exchangeRates: {},

  setCurrency: (curr) => {
    // Update all prices on page
    updateAllPrices(curr);
  },

  convertPrice: (amount, fromCurrency) => {
    // Convert to selected currency
    return amount * exchangeRates[currency];
  }
});
```

---

## 🎯 Use Cases

### Use Case 1: Local Saudi Store (Free Plan)
```
Store: متجر الهدايا
Currency: SAR only
Customers: Saudi Arabia only

Setup:
- Set currency: SAR
- Price products in SAR
- Done!

Result:
Simple, clean, no confusion.
```

---

### Use Case 2: GCC Regional Store (Pro Plan)
```
Store: متجر العطور الخليجية
Target: Saudi, UAE, Kuwait, Bahrain

Setup:
- Primary: SAR
- Enable: AED, KWD, BHD
- Auto-convert: ON

Result:
- Saudi customers: See prices in SAR
- UAE customers: See prices in AED
- Kuwait customers: See prices in KWD
- All automatic!
```

---

### Use Case 3: International Dropshipping (Pro Plan)
```
Store: Dropship Pro
Target: MENA + USA + Europe

Setup:
- Primary: USD
- Enable: SAR, AED, EGP, EUR
- Manual pricing per currency

Pricing Strategy:
- USA: $79 (base)
- Saudi: 299 SAR (premium pricing)
- UAE: 289 AED (competitive)
- Egypt: 2,290 EGP (volume pricing)
- Europe: 75 EUR

Result:
Optimized pricing for each market.
```

---

### Use Case 4: Facebook Ads to Multiple Countries (Agency)
```
Agency: Performance Marketing Co.
Client stores: 20+ stores

Setup per store:
- Auto-detect customer country
- Show prices in local currency
- Track conversions in local currency
- Report all in USD (agency's currency)

Result:
- Better ad performance (local prices)
- Accurate ROAS tracking
- Unified reporting
```

---

## 💰 Pricing Impact

### Free Plan ($0/month)
- ✅ Choose 1 currency
- ❌ No multi-currency
- ❌ No auto-conversion

**Perfect for:** Local businesses

---

### Starter Plan ($29/month)
- ✅ Choose 1 currency
- ❌ No multi-currency
- ❌ No auto-conversion

**Perfect for:** Single-market merchants

---

### Pro Plan ($79/month)
- ✅ Primary currency
- ✅ **Enable multiple currencies**
- ✅ **Auto currency conversion**
- ✅ Currency switcher
- ❌ No custom exchange rates

**Perfect for:** Regional businesses, Dropshippers

---

### Agency Plan ($199/month)
- ✅ All Pro features
- ✅ **Custom exchange rates**
- ✅ **Bulk currency management**
- ✅ **White-label currency settings**

**Perfect for:** Agencies, Large merchants

---

## 📱 User Interface Examples

### Store Settings → Currency

```
┌─────────────────────────────────────────┐
│ Currency Settings                       │
├─────────────────────────────────────────┤
│                                         │
│ Primary Currency *                      │
│ ┌───────────────────┐                  │
│ │ SAR - Saudi Riyal ▼│                 │
│ └───────────────────┘                  │
│                                         │
│ ☐ Enable Multi-Currency (Pro+)         │
│                                         │
│   Additional Currencies:                │
│   ☑ AED - UAE Dirham                   │
│   ☑ USD - US Dollar                    │
│   ☐ EUR - Euro                         │
│   ☑ EGP - Egyptian Pound               │
│                                         │
│ Currency Conversion Method:             │
│ ◉ Auto-convert using live rates        │
│ ○ Manual pricing per currency          │
│                                         │
│ Exchange Rates (Last updated 2h ago):   │
│ AED: 1.02  USD: 3.75  EGP: 7.79       │
│                                         │
│ [Update Rates Now] [Save Settings]     │
└─────────────────────────────────────────┘
```

### Product Edit → Multi-Currency Pricing

```
┌─────────────────────────────────────────┐
│ Product: عطر عود ملكي                  │
├─────────────────────────────────────────┤
│                                         │
│ Pricing                                 │
│                                         │
│ Primary Currency (SAR):                 │
│ ┌──────────┐                           │
│ │ 299.00   │ ر.س                       │
│ └──────────┘                           │
│                                         │
│ Multi-Currency Pricing (Optional):      │
│                                         │
│ AED (Auto: 305.00):                     │
│ ┌──────────┐ د.إ                       │
│ │ 289.00   │ ← Custom override          │
│ └──────────┘                           │
│                                         │
│ USD (Auto: 79.73):                      │
│ ┌──────────┐ $                         │
│ │ 79.00    │ ← Rounded                  │
│ └──────────┘                           │
│                                         │
│ EGP (Auto: 2,328):                      │
│ ┌──────────┐ ج.م                       │
│ │ 2,290    │ ← Psychological pricing    │
│ └──────────┘                           │
│                                         │
│ [Save Pricing]                          │
└─────────────────────────────────────────┘
```

---

## ✅ Implementation Checklist

### Backend
- [x] Add currency fields to Store model
- [x] Add multi-currency pricing to Product model
- [x] Store order currency + exchange rate
- [x] Create ExchangeRate model
- [x] Build currency conversion service
- [x] Implement daily exchange rate updates (cron)
- [x] Add currency APIs (GET/PATCH /currencies)
- [x] Convert tracking events to include currency

### Frontend
- [x] Create currency switcher component
- [x] Build currency store (Zustand)
- [x] Add currency settings UI
- [x] Multi-currency product pricing UI
- [x] Format prices based on currency
- [x] Real-time price conversion
- [x] Display currency in analytics

### Testing
- [ ] Test auto currency detection
- [ ] Test manual currency switching
- [ ] Test order placement in different currencies
- [ ] Test exchange rate updates
- [ ] Test manual multi-currency pricing
- [ ] Test analytics currency conversion
- [ ] Test pixel events with multiple currencies

---

## 🚀 Benefits Summary

### For Merchants
✅ **Sell to multiple countries** without creating multiple stores
✅ **Automatic pricing** with live exchange rates
✅ **Custom pricing** for market optimization
✅ **Better customer experience** (see prices in local currency)
✅ **Higher conversion rates** (no mental currency conversion needed)

### For Customers
✅ **See prices in familiar currency**
✅ **No surprises at checkout**
✅ **Easy to compare prices**
✅ **Choose preferred currency**

### For Platform
✅ **Competitive advantage** over single-currency platforms
✅ **Higher-tier paid plans** (Pro/Agency feature)
✅ **International market expansion**
✅ **Better for agencies and dropshippers**

---

## 🎯 Next Steps

Ready to implement? Here's the order:

1. **Database** - Add currency fields to schema
2. **Exchange Rate Service** - Build conversion API
3. **Backend APIs** - Currency management endpoints
4. **Frontend Components** - Currency switcher UI
5. **Store Settings** - Currency configuration page
6. **Product Pricing** - Multi-currency pricing UI
7. **Checkout** - Handle multi-currency orders
8. **Analytics** - Currency conversion in reports
9. **Testing** - Comprehensive currency testing

**Estimated Time:** 1 week of development

---

**Ready to build the multi-currency system?** 🚀
