# 🛍️ StoreAR - AI-Powered Multi-Store E-Commerce SaaS

## Product Name: StoreAR
**Tagline:** من فكرة إلى متجر كامل في دقائق - AI-Powered E-Commerce Stores for Arabic Merchants

---

## 🎯 CORE VISION (UPDATED)

Build a SaaS where:
- A user can create **multiple online stores**
- Each store has **multiple products**
- AI generates:
  • Store design and branding
  • Product descriptions (SEO-optimized Arabic copy)
  • Store pages (Home, Products, About, Contact)
  • Product pages (conversion-optimized)
- Merchant manages products, inventory, orders
- Customers browse and buy (COD or online payment)
- Full e-commerce platform, not just landing pages

**Key Difference:** Not Shopify competitor - simpler, faster, AI-powered, Arabic-first

---

## 1️⃣ UPDATED PRODUCT ARCHITECTURE

### 1.1 Hierarchy Structure

```typescript
User (Merchant)
└── Workspace(s) (Business Account)
    └── Store(s) (Online Shop)
        ├── Products
        ├── Collections (Categories)
        ├── Pages (Home, About, Contact, Custom)
        ├── Orders
        ├── Customers
        └── Settings (Theme, Shipping, Payment)
```

**Example:**
```
User: Ahmed (merchant)
└── Workspace: "Ahmed's Business"
    ├── Store 1: "متجر العطور الفاخرة"
    │   ├── Products: 50 perfumes
    │   ├── Collections: Men, Women, Oud
    │   ├── Orders: 1,200
    │
    ├── Store 2: "متجر الملابس النسائية"
    │   ├── Products: 120 items
    │   ├── Collections: Abayas, Dresses, Accessories
    │   ├── Orders: 850
    │
    └── Store 3: "متجر مستحضرات التجميل"
        ├── Products: 80 items
        ├── Orders: 450
```

### 1.2 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                            │
├─────────────────────────────────────────────────────────────┤
│  Sign Up → Create Store (AI Setup) → Add Products (AI) →    │
│  Customize Design → Publish → Share Store Link →            │
│  Customers Browse → Place Orders → Manage Orders            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PLATFORM MODULES                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth &     │  │  AI Engine   │  │   Store      │     │
│  │   Tenant     │  │   Module     │  │   Builder    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Product    │  │   Orders &   │  │  Customers   │     │
│  │   Management │  │   Inventory  │  │   & Reviews  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Store      │  │   Analytics  │  │   Payment    │     │
│  │   Renderer   │  │   & Reports  │  │   & Shipping │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Subscription│  │   Marketing  │  │   Admin      │     │
│  │  & Billing   │  │   Tools      │  │   Panel      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Multi-Tenant Architecture

**Tenant Model:** Workspace → Stores

```typescript
Isolation Strategy:
- All queries filtered by workspaceId
- Stores belong to workspace
- Subdomain routing: {store-slug}.storear.com
- Custom domain support (premium)

Resource Limits per Plan:
Free Plan:
  - 1 workspace
  - 1 store
  - 10 products
  - 50 orders/month
  - 50 AI generations/month

Starter Plan ($29/mo):
  - 1 workspace
  - 3 stores
  - 200 products per store
  - 1000 orders/month
  - 500 AI generations/month

Pro Plan ($79/mo):
  - 1 workspace
  - 10 stores
  - Unlimited products
  - Unlimited orders
  - 2000 AI generations/month
  - Custom domain
  - WhatsApp integration
```

### 1.4 Updated User Journey

**Step 1: Create First Store (AI-Powered - 3 minutes)**

```
AI Store Setup Questionnaire:
1. ما اسم متجرك؟ (Store name)
2. ما نوع المنتجات؟ (Product type: Fashion, Beauty, Electronics, etc.)
3. من هو جمهورك المستهدف؟ (Target audience)
4. ما هي ميزتك التنافسية؟ (Unique selling point)
5. ما الألوان المفضلة؟ (Brand colors - optional, AI suggests)
6. هل لديك شعار؟ (Upload logo - optional)
7. طريقة الدفع المفضلة؟ (COD, Online, Both)
8. مناطق الشحن؟ (Shipping zones)

  ↓
AI Generates:
  - Store theme (colors, fonts, layout)
  - Home page structure
  - About Us page draft
  - Contact page
  - Default collections
  - Store policies (shipping, returns)

  ↓
Store Created (Ready for products)
```

**Step 2: Add Products (AI-Assisted - 1 minute per product)**

```
Quick Add Product (AI):
- Upload product image(s)
- Enter basic info (name, price)
- AI generates:
  • SEO-optimized title
  • Compelling description
  • Key features list
  • Tags and categories

OR

Bulk Import:
- Upload CSV/Excel
- AI processes and enhances descriptions
```

**Step 3: Customize Store Design**

```
Store Customization:
- Choose theme variant (AI provides 3 options)
- Customize colors
- Edit homepage sections
- Arrange collections
- Add custom pages
- Set up navigation menu
```

**Step 4: Publish & Sell**

```
Store Goes Live:
- Unique URL: https://{slug}.storear.com
- Share on social media
- WhatsApp catalog link
- QR code for physical locations

Customers:
- Browse products
- Add to cart
- Checkout (COD or Online Payment)
- Track order
```

**Step 5: Manage Business**

```
Merchant Dashboard:
- View orders (filter, search, export)
- Update order status
- Manage inventory
- View analytics
- Add/edit products
- Respond to customer messages
```

---

## 2️⃣ UPDATED DATABASE DESIGN

### 2.1 Complete Prisma Schema (E-Commerce)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// =====================
// USERS & AUTH
// =====================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?
  name          String
  phone         String?
  locale        String    @default("ar")

  emailVerified Boolean   @default(false)
  verifiedAt    DateTime?

  provider      String?
  providerId    String?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  workspaces    WorkspaceMember[]
  sessions      Session[]

  @@index([email])
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
}

// =====================
// WORKSPACES (TENANTS)
// =====================

model Workspace {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique

  planId      String

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  plan        Plan     @relation(fields: [planId], references: [id])
  members     WorkspaceMember[]
  stores      Store[]
  subscriptions Subscription[]
  usage       UsageRecord[]

  @@index([slug])
}

model WorkspaceMember {
  id          String   @id @default(cuid())
  workspaceId String
  userId      String
  role        Role     @default(MEMBER)

  createdAt   DateTime @default(now())

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@index([userId])
}

enum Role {
  OWNER
  ADMIN
  MEMBER
}

// =====================
// PLANS & SUBSCRIPTIONS
// =====================

model Plan {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique

  price           Int      // Monthly price in cents
  currency        String   @default("USD")

  // Limits
  maxStores       Int      @default(1)
  maxProductsPerStore Int  @default(10)
  maxOrdersPerMonth   Int  @default(50)
  maxAiGenerations    Int  @default(50)

  // Features
  customDomain    Boolean  @default(false)
  whatsappIntegration Boolean @default(false)
  analyticsAdvanced   Boolean @default(false)
  multiCurrency   Boolean  @default(false)
  removeBranding  Boolean  @default(false)
  prioritySupport Boolean  @default(false)

  active          Boolean  @default(true)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  workspaces      Workspace[]
  subscriptions   Subscription[]
}

model Subscription {
  id              String   @id @default(cuid())
  workspaceId     String
  planId          String

  status          SubscriptionStatus @default(ACTIVE)

  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAt        DateTime?
  canceledAt      DateTime?

  stripeCustomerId     String?
  stripeSubscriptionId String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  plan            Plan      @relation(fields: [planId], references: [id])

  @@index([workspaceId])
  @@index([stripeSubscriptionId])
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
}

// =====================
// STORES
// =====================

model Store {
  id          String   @id @default(cuid())
  workspaceId String

  // Basic Info
  name        String
  slug        String   @unique
  description String?
  logo        String?
  favicon     String?

  // Domain
  subdomain   String?  @unique
  customDomain String? @unique
  domainVerified Boolean @default(false)

  // Status
  status      StoreStatus @default(DRAFT)
  publishedAt DateTime?

  // Theme & Design (JSON)
  theme       Json     // Colors, fonts, layout settings

  // Business Info
  email       String?
  phone       String?
  whatsapp    String?
  address     String?

  // Settings
  currency    String   @default("SAR")
  language    String   @default("ar")
  timezone    String   @default("Asia/Riyadh")

  // Policies
  shippingPolicy  String?
  returnPolicy    String?
  privacyPolicy   String?
  termsOfService  String?

  // SEO
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?

  // Analytics
  totalViews      Int      @default(0)
  totalOrders     Int      @default(0)
  totalRevenue    Int      @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  // Relations
  products    Product[]
  collections Collection[]
  pages       StorePage[]
  orders      Order[]
  customers   Customer[]
  reviews     Review[]

  @@index([workspaceId])
  @@index([slug])
  @@index([status])
}

enum StoreStatus {
  DRAFT
  PUBLISHED
  PAUSED
  ARCHIVED
}

// =====================
// COLLECTIONS (CATEGORIES)
// =====================

model Collection {
  id          String   @id @default(cuid())
  storeId     String

  name        String
  slug        String
  description String?
  image       String?

  visible     Boolean  @default(true)
  order       Int      @default(0)

  // SEO
  metaTitle       String?
  metaDescription String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  products    ProductCollection[]

  @@unique([storeId, slug])
  @@index([storeId])
}

// =====================
// PRODUCTS
// =====================

model Product {
  id          String   @id @default(cuid())
  storeId     String

  // Basic Info
  name        String
  slug        String
  description String?
  shortDescription String?

  // Pricing
  price       Int      // In cents
  compareAtPrice Int?  // Original price for "was/now"
  costPrice   Int?     // For profit tracking

  // Inventory
  sku         String?
  barcode     String?
  trackInventory Boolean @default(true)
  stock       Int      @default(0)
  lowStockThreshold Int @default(5)

  // Status
  status      ProductStatus @default(DRAFT)
  publishedAt DateTime?

  // Media
  images      Json     // Array of image URLs
  video       String?

  // Attributes
  weight      Float?   // In grams
  dimensions  Json?    // {length, width, height}

  // Variants (Simple approach - one product can have variants)
  hasVariants Boolean  @default(false)

  // SEO
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?

  // Analytics
  views       Int      @default(0)
  sales       Int      @default(0)

  // AI Generated
  aiGenerated Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)

  // Relations
  collections ProductCollection[]
  variants    ProductVariant[]
  orderItems  OrderItem[]
  reviews     Review[]

  @@unique([storeId, slug])
  @@index([storeId])
  @@index([status])
  @@index([storeId, status])
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
  OUT_OF_STOCK
}

model ProductVariant {
  id          String   @id @default(cuid())
  productId   String

  name        String   // e.g., "Large - Red"
  sku         String?
  price       Int?     // If different from product price
  stock       Int      @default(0)

  // Options (e.g., {size: "L", color: "Red"})
  options     Json

  image       String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

model ProductCollection {
  id           String     @id @default(cuid())
  productId    String
  collectionId String

  product      Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@unique([productId, collectionId])
  @@index([productId])
  @@index([collectionId])
}

// =====================
// STORE PAGES
// =====================

model StorePage {
  id          String   @id @default(cuid())
  storeId     String

  title       String
  slug        String
  content     Json     // Rich content / sections

  type        PageType @default(CUSTOM)

  visible     Boolean  @default(true)
  order       Int      @default(0)

  // SEO
  metaTitle       String?
  metaDescription String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)

  @@unique([storeId, slug])
  @@index([storeId])
}

enum PageType {
  HOME
  ABOUT
  CONTACT
  CUSTOM
}

// =====================
// CUSTOMERS
// =====================

model Customer {
  id          String   @id @default(cuid())
  storeId     String

  name        String
  email       String?
  phone       String

  // Address
  address     String?
  city        String?
  state       String?
  zipCode     String?
  country     String   @default("SA")

  // Stats
  totalOrders Int      @default(0)
  totalSpent  Int      @default(0)

  // Marketing
  acceptsMarketing Boolean @default(false)

  // Notes
  notes       String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  orders      Order[]

  @@unique([storeId, phone]) // Phone unique per store
  @@index([storeId])
  @@index([phone])
}

// =====================
// ORDERS
// =====================

model Order {
  id          String   @id @default(cuid())
  storeId     String
  customerId  String?
  workspaceId String   // Denormalized for faster queries

  // Order Number
  orderNumber String   @unique // ORD-20240115-001

  // Customer Info (snapshot at time of order)
  customerName    String
  customerEmail   String?
  customerPhone   String
  customerAddress String
  customerCity    String
  customerState   String?
  customerZipCode String?
  customerCountry String @default("SA")

  // Pricing
  subtotal    Int      // Product total
  shipping    Int      @default(0)
  tax         Int      @default(0)
  discount    Int      @default(0)
  total       Int
  currency    String   @default("SAR")

  // Payment
  paymentMethod   PaymentMethod @default(COD)
  paymentStatus   PaymentStatus @default(PENDING)
  paidAt          DateTime?

  // Fulfillment
  fulfillmentStatus FulfillmentStatus @default(UNFULFILLED)
  trackingNumber    String?
  carrier           String?
  shippedAt         DateTime?
  deliveredAt       DateTime?

  // Status
  status      OrderStatus @default(PENDING)
  canceledAt  DateTime?
  cancelReason String?

  // Customer Notes
  notes       String?

  // Tracking
  source      String?  // utm_source
  ipAddress   String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  customer    Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)
  items       OrderItem[]

  @@index([storeId])
  @@index([workspaceId])
  @@index([status])
  @@index([createdAt])
  @@index([orderNumber])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELED
  REFUNDED
}

enum PaymentMethod {
  COD
  CARD
  BANK_TRANSFER
  APPLE_PAY
  MADA
  STC_PAY
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum FulfillmentStatus {
  UNFULFILLED
  PARTIAL
  FULFILLED
  RETURNED
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  productId   String?  // Can be null if product deleted

  // Product snapshot at time of order
  productName     String
  productImage    String?
  variantName     String?
  sku             String?

  quantity    Int
  price       Int      // Price per unit
  total       Int      // quantity * price

  createdAt   DateTime @default(now())

  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product? @relation(fields: [productId], references: [id], onDelete: SetNull)

  @@index([orderId])
}

// =====================
// REVIEWS
// =====================

model Review {
  id          String   @id @default(cuid())
  productId   String
  storeId     String
  customerId  String?

  // Review Content
  rating      Int      // 1-5
  title       String?
  comment     String

  // Customer Info (if not logged in)
  customerName  String?
  customerEmail String?

  // Status
  status      ReviewStatus @default(PENDING)
  publishedAt DateTime?

  // Verification
  verified    Boolean  @default(false) // Purchased product

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@index([storeId])
  @@index([status])
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

// =====================
// AI GENERATIONS
// =====================

model AiGeneration {
  id          String   @id @default(cuid())
  workspaceId String
  storeId     String?
  productId   String?

  // Input
  inputs      Json

  // Output
  outputs     Json

  // Metadata
  engine      AiEngine
  model       String
  tokensUsed  Int

  status      GenerationStatus @default(PENDING)
  error       String?

  createdAt   DateTime @default(now())
  completedAt DateTime?

  @@index([workspaceId])
  @@index([storeId])
  @@index([createdAt])
}

enum AiEngine {
  STORE_SETUP
  PRODUCT_DESCRIPTION
  PRODUCT_SEO
  COLLECTION_DESCRIPTION
  PAGE_CONTENT
}

enum GenerationStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

// =====================
// USAGE TRACKING
// =====================

model UsageRecord {
  id          String   @id @default(cuid())
  workspaceId String

  metric      UsageMetric
  value       Int      @default(1)

  year        Int
  month       Int
  day         Int

  createdAt   DateTime @default(now())

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, metric, year, month, day])
  @@index([workspaceId, year, month])
}

enum UsageMetric {
  AI_GENERATION
  ORDER_CREATED
  PRODUCT_VIEW
  STORE_VIEW
}
```

---

## 3️⃣ UPDATED AI SYSTEM

### 3.1 AI Engines for E-Commerce

**Engine A: Store Setup AI**

**Purpose:** Generate complete store setup from questionnaire

**Inputs:**
```typescript
interface StoreSetupInput {
  storeName: string;           // "متجر العطور الفاخرة"
  productType: string;         // "عطور ومستحضرات تجميل"
  targetAudience: string;      // "رجال ونساء 25-50"
  uniqueSellingPoint: string;  // "عطور أصلية بأسعار منافسة"
  brandColors?: string[];      // ["#1a1a1a", "#d4af37"] or AI suggests
  hasLogo: boolean;
  preferredPayment: 'COD' | 'ONLINE' | 'BOTH';
  shippingZones: string[];     // ["الرياض", "جدة", "الدمام"]
}
```

**Outputs:**
```typescript
interface StoreSetupOutput {
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    style: 'modern' | 'classic' | 'minimal' | 'luxe';
  };

  homePageContent: {
    hero: {
      headline: string;
      subheadline: string;
      cta: string;
    };
    aboutSection: string;
    featuredCollections: string[];
  };

  aboutUsPage: string;
  contactPage: string;

  defaultCollections: Array<{
    name: string;
    slug: string;
    description: string;
  }>;

  policies: {
    shipping: string;
    returns: string;
    privacy: string;
  };
}
```

**Prompt:**
```typescript
const STORE_SETUP_PROMPT = `
أنت خبير تصميم متاجر إلكترونية ناجحة في السوق العربي.

المهمة: إنشاء متجر إلكتروني كامل بناءً على معلومات التاجر.

المعطيات:
- اسم المتجر: {{storeName}}
- نوع المنتجات: {{productType}}
- الجمهور المستهدف: {{targetAudience}}
- الميزة التنافسية: {{uniqueSellingPoint}}

اختر:
1. نظام ألوان مناسب للمنتج (3-5 ألوان)
2. أسلوب التصميم (حديث، كلاسيكي، فاخر، بسيط)
3. خطوط مناسبة (عربية احترافية)

اكتب محتوى:
1. عنوان رئيسي قوي للصفحة الرئيسية
2. نص "من نحن" (200-300 كلمة)
3. 3-5 تصنيفات افتراضية مناسبة للمنتج
4. سياسة الشحن
5. سياسة الاسترجاع
6. سياسة الخصوصية

أرجع JSON فقط.
`;
```

---

**Engine B: Product Description AI**

**Purpose:** Generate compelling, SEO-optimized product descriptions

**Inputs:**
```typescript
interface ProductDescriptionInput {
  productName: string;
  productType: string;         // Category
  price: number;
  keyFeatures?: string[];      // Optional: ["100ml", "للرجال", "رائحة فاخرة"]
  images?: string[];           // AI can analyze images if provided
  targetAudience?: string;
}
```

**Outputs:**
```typescript
interface ProductDescriptionOutput {
  // Optimized title
  seoTitle: string;            // "عطر عود ملكي فاخر للرجال - 100 مل - رائحة تدوم 24 ساعة"

  // Short description (for listing pages)
  shortDescription: string;    // "عطر عود ملكي فاخر للرجال - رائحة شرقية أصيلة"

  // Long description (for product page)
  longDescription: string;     // Full 200-300 word description

  // Features list
  features: string[];          // ["رائحة تدوم 24 ساعة", "مكونات طبيعية", ...]

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  // Tags
  tags: string[];             // ["عطور", "عود", "رجالي", "فاخر"]
}
```

**Prompt:**
```typescript
const PRODUCT_DESCRIPTION_PROMPT = `
أنت خبير كتابة أوصاف المنتجات التي تزيد المبيعات.

المهمة: كتابة وصف منتج مقنع ومحسّن لمحركات البحث.

المنتج:
- الاسم: {{productName}}
- النوع: {{productType}}
- السعر: {{price}} ريال
- المميزات: {{keyFeatures}}

اكتب:
1. عنوان محسّن SEO (50-60 حرف)
2. وصف قصير جذاب (80-120 حرف)
3. وصف طويل شامل (200-300 كلمة):
   - ابدأ بجملة جذابة
   - اذكر الفوائد الرئيسية
   - تفاصيل المنتج
   - طريقة الاستخدام (إن وجدت)
   - ضمان أو كفالة
4. قائمة 5-7 مميزات نقطية
5. Meta description (120-160 حرف)
6. 5-10 كلمات مفتاحية
7. 3-5 وسوم

أسلوب الكتابة:
- عاطفي وجذاب
- استخدم أرقام محددة
- ركز على الفوائد
- اجعل العميل يتخيل الاستخدام

أرجع JSON فقط.
`;
```

---

**Engine C: Collection Description AI**

**Purpose:** Generate category/collection descriptions

**Inputs:**
```typescript
interface CollectionInput {
  name: string;                // "عطور نسائية"
  storeType: string;
  productCount?: number;
}
```

**Outputs:**
```typescript
interface CollectionOutput {
  description: string;         // 100-200 words
  metaTitle: string;
  metaDescription: string;
}
```

---

### 3.2 AI Pipeline for Store Creation

```typescript
// When user creates store:
1. Queue "STORE_SETUP" job
   ↓
2. AI generates theme + content
   ↓
3. Create Store record with theme JSON
   ↓
4. Create default pages (Home, About, Contact)
   ↓
5. Create default collections
   ↓
6. Store ready for products
```

```typescript
// When merchant adds product:
1. If merchant provides minimal info → Queue "PRODUCT_DESCRIPTION" job
2. AI generates full description
3. Save product with AI-generated content
4. Merchant can edit/refine
```

---

## 4️⃣ STORE THEME JSON SCHEMA

### 4.1 Store Theme Structure

```typescript
interface StoreTheme {
  version: string;              // "1.0"

  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
    border: string;
    success: string;
    error: string;
  };

  // Typography
  fonts: {
    heading: string;
    body: string;
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };

  // Layout
  layout: {
    headerStyle: 'minimal' | 'centered' | 'full';
    footerStyle: 'simple' | 'detailed';
    productGridColumns: 2 | 3 | 4;
    borderRadius: 'none' | 'sm' | 'md' | 'lg';
    spacing: 'compact' | 'normal' | 'relaxed';
  };

  // Homepage Sections
  homepageSections: Array<{
    id: string;
    type: HomepageSection;
    enabled: boolean;
    order: number;
    settings: any;
  }>;
}

type HomepageSection =
  | 'HERO'
  | 'FEATURED_PRODUCTS'
  | 'FEATURED_COLLECTIONS'
  | 'ABOUT_US'
  | 'TESTIMONIALS'
  | 'INSTAGRAM_FEED'
  | 'NEWSLETTER';
```

### 4.2 Full Store Theme Example

```json
{
  "version": "1.0",
  "colors": {
    "primary": "#d4af37",
    "secondary": "#1a1a1a",
    "accent": "#c19a6b",
    "background": "#ffffff",
    "surface": "#f9f9f9",
    "text": "#1a1a1a",
    "textLight": "#6b7280",
    "border": "#e5e7eb",
    "success": "#10b981",
    "error": "#ef4444"
  },
  "fonts": {
    "heading": "Tajawal",
    "body": "Cairo",
    "sizes": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem"
    }
  },
  "layout": {
    "headerStyle": "centered",
    "footerStyle": "detailed",
    "productGridColumns": 3,
    "borderRadius": "md",
    "spacing": "normal"
  },
  "homepageSections": [
    {
      "id": "hero_1",
      "type": "HERO",
      "enabled": true,
      "order": 1,
      "settings": {
        "headline": "اكتشف عالم العطور الفاخرة",
        "subheadline": "عطور أصلية بأسعار منافسة - شحن مجاني لجميع مدن المملكة",
        "image": "https://...",
        "ctaText": "تسوق الآن",
        "ctaLink": "/collections/all"
      }
    },
    {
      "id": "collections_1",
      "type": "FEATURED_COLLECTIONS",
      "enabled": true,
      "order": 2,
      "settings": {
        "title": "تسوق حسب الفئة",
        "collections": ["men", "women", "oud"]
      }
    },
    {
      "id": "products_1",
      "type": "FEATURED_PRODUCTS",
      "enabled": true,
      "order": 3,
      "settings": {
        "title": "الأكثر مبيعاً",
        "limit": 8,
        "sortBy": "sales"
      }
    },
    {
      "id": "about_1",
      "type": "ABOUT_US",
      "enabled": true,
      "order": 4,
      "settings": {
        "title": "من نحن",
        "content": "نحن متخصصون في توفير أفضل أنواع العطور الأصلية...",
        "image": "https://..."
      }
    }
  ]
}
```

---

## 5️⃣ BACKEND API DESIGN (UPDATED)

### 5.1 Store APIs

**POST /api/stores**
```typescript
// Create new store (AI-powered)
Request:
{
  "storeName": "متجر العطور الفاخرة",
  "productType": "عطور ومستحضرات تجميل",
  "targetAudience": "رجال ونساء 25-50",
  "uniqueSellingPoint": "عطور أصلية بأسعار منافسة",
  "preferredPayment": "BOTH",
  "shippingZones": ["الرياض", "جدة"]
}

Response 202:
{
  "jobId": "job_123",
  "status": "PROCESSING",
  "message": "جاري إنشاء متجرك..."
}

// Then poll: GET /api/ai/generation-status/:jobId

Response 200 (when complete):
{
  "storeId": "store_xyz",
  "status": "COMPLETED"
}
```

**GET /api/stores**
```typescript
Response 200:
{
  "data": [
    {
      "id": "store_1",
      "name": "متجر العطور الفاخرة",
      "slug": "perfume-store-xyz",
      "status": "PUBLISHED",
      "url": "https://perfume-store-xyz.storear.com",
      "totalProducts": 45,
      "totalOrders": 230,
      "totalRevenue": 68500,
      "publishedAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

**GET /api/stores/:id**
```typescript
Response 200:
{
  "id": "store_1",
  "name": "متجر العطور الفاخرة",
  "slug": "perfume-store-xyz",
  "description": "...",
  "logo": "https://...",
  "status": "PUBLISHED",
  "theme": { /* Full theme JSON */ },
  "email": "info@store.com",
  "phone": "+966500000000",
  "whatsapp": "+966500000000",
  "currency": "SAR",
  "stats": {
    "totalProducts": 45,
    "totalOrders": 230,
    "totalRevenue": 68500,
    "totalViews": 12450
  }
}
```

**PATCH /api/stores/:id**
```typescript
Request:
{
  "name": "متجر العطور الملكية",
  "theme": { /* Updated theme */ }
}

Response 200: { /* Updated store */ }
```

**POST /api/stores/:id/publish**
**POST /api/stores/:id/pause**

---

### 5.2 Product APIs

**POST /api/stores/:storeId/products**
```typescript
// Quick add with AI
Request:
{
  "name": "عطر عود ملكي",
  "price": 29900, // 299 SAR in cents
  "images": ["https://..."],
  "useAI": true,
  "keyFeatures": ["100ml", "للرجال"]
}

Response 202:
{
  "jobId": "job_456",
  "status": "PROCESSING"
}

// Or manual (skip AI):
Request:
{
  "name": "عطر عود ملكي",
  "price": 29900,
  "description": "عطر فاخر...",
  "shortDescription": "...",
  "images": ["https://..."],
  "stock": 50,
  "sku": "PROD-001",
  "collectionIds": ["col_1", "col_2"],
  "useAI": false
}

Response 201:
{
  "id": "prod_123",
  "name": "عطر عود ملكي",
  "slug": "عطر-عود-ملكي",
  "price": 29900,
  "status": "ACTIVE"
}
```

**GET /api/stores/:storeId/products**
```typescript
Request: ?status=ACTIVE&collection=men&page=1&limit=20&sort=sales:desc

Response 200:
{
  "data": [
    {
      "id": "prod_123",
      "name": "عطر عود ملكي",
      "slug": "عطر-عود-ملكي",
      "price": 29900,
      "compareAtPrice": 39900,
      "images": ["https://..."],
      "stock": 50,
      "status": "ACTIVE",
      "sales": 120,
      "views": 1450
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20
  }
}
```

**GET /api/stores/:storeId/products/:id**
**PATCH /api/stores/:storeId/products/:id**
**DELETE /api/stores/:storeId/products/:id**

**POST /api/stores/:storeId/products/bulk-import**
```typescript
// Upload CSV
Request: FormData with CSV file

Response 202:
{
  "jobId": "job_789",
  "message": "جاري معالجة 50 منتج..."
}
```

---

### 5.3 Order APIs (Updated)

**POST /api/public/stores/:storeSlug/orders** (Public - No Auth)
```typescript
Request:
{
  "customerName": "نورة أحمد",
  "customerPhone": "0501234567",
  "customerEmail": "noura@example.com",
  "customerAddress": "حي النرجس، شارع التخصصي",
  "customerCity": "الرياض",
  "items": [
    {
      "productId": "prod_123",
      "variantId": null,
      "quantity": 2
    },
    {
      "productId": "prod_456",
      "quantity": 1
    }
  ],
  "paymentMethod": "COD",
  "notes": "يفضل التوصيل مساءً"
}

Response 201:
{
  "id": "order_789",
  "orderNumber": "ORD-20240115-001",
  "total": 89700,
  "status": "PENDING",
  "message": "تم استلام طلبك بنجاح. سنتواصل معك خلال دقائق."
}
```

**GET /api/stores/:storeId/orders**
```typescript
Request: ?status=PENDING&page=1&limit=20

Response 200:
{
  "data": [
    {
      "id": "order_789",
      "orderNumber": "ORD-20240115-001",
      "customerName": "نورة أحمد",
      "customerPhone": "0501234567",
      "total": 89700,
      "status": "PENDING",
      "paymentStatus": "PENDING",
      "itemsCount": 3,
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ],
  "meta": { "total": 156 }
}
```

**GET /api/stores/:storeId/orders/:id**
```typescript
Response 200:
{
  "id": "order_789",
  "orderNumber": "ORD-20240115-001",
  "customer": {
    "name": "نورة أحمد",
    "phone": "0501234567",
    "email": "noura@example.com",
    "address": "حي النرجس، شارع التخصصي",
    "city": "الرياض"
  },
  "items": [
    {
      "id": "item_1",
      "productName": "عطر عود ملكي",
      "productImage": "https://...",
      "variantName": null,
      "quantity": 2,
      "price": 29900,
      "total": 59800
    }
  ],
  "subtotal": 89700,
  "shipping": 0,
  "tax": 0,
  "total": 89700,
  "status": "PENDING",
  "paymentMethod": "COD",
  "paymentStatus": "PENDING",
  "fulfillmentStatus": "UNFULFILLED",
  "notes": "يفضل التوصيل مساءً",
  "createdAt": "2024-01-15T12:00:00Z"
}
```

**PATCH /api/stores/:storeId/orders/:id**
```typescript
Request:
{
  "status": "CONFIRMED",
  "fulfillmentStatus": "FULFILLED",
  "trackingNumber": "TRK123456",
  "carrier": "SMSA"
}

Response 200: { /* Updated order */ }
```

---

### 5.4 Collection APIs

**POST /api/stores/:storeId/collections**
**GET /api/stores/:storeId/collections**
**PATCH /api/stores/:storeId/collections/:id**
**DELETE /api/stores/:storeId/collections/:id**

---

### 5.5 Customer APIs

**GET /api/stores/:storeId/customers**
**GET /api/stores/:storeId/customers/:id**
**PATCH /api/stores/:storeId/customers/:id**

---

### 5.6 Analytics APIs (Updated)

**GET /api/stores/:storeId/analytics/overview**
```typescript
Response 200:
{
  "period": {
    "start": "2023-12-16",
    "end": "2024-01-15"
  },
  "metrics": {
    "totalViews": 12580,
    "totalOrders": 342,
    "totalRevenue": 102300,
    "conversionRate": 2.72,
    "averageOrderValue": 299,
    "productsViewed": 450,
    "topProduct": {
      "id": "prod_123",
      "name": "عطر عود ملكي",
      "sales": 120
    }
  },
  "charts": {
    "salesByDay": [ /* ... */ ],
    "topProducts": [ /* ... */ ],
    "topCities": [ /* ... */ ]
  }
}
```

---

## 6️⃣ FRONTEND ARCHITECTURE (UPDATED)

### 6.1 Folder Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Marketing site
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Dashboard layout
│   │   ├── page.tsx                  # Dashboard home
│   │   │
│   │   ├── stores/
│   │   │   ├── page.tsx              # Stores list
│   │   │   ├── new/page.tsx          # Create store (AI questionnaire)
│   │   │   └── [storeId]/
│   │   │       ├── page.tsx          # Store dashboard
│   │   │       │
│   │   │       ├── products/
│   │   │       │   ├── page.tsx      # Products list
│   │   │       │   ├── new/page.tsx  # Add product (AI)
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx  # Edit product
│   │   │       │       └── variants/page.tsx
│   │   │       │
│   │   │       ├── collections/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       │
│   │   │       ├── orders/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       │
│   │   │       ├── customers/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       │
│   │   │       ├── analytics/
│   │   │       │   └── page.tsx
│   │   │       │
│   │   │       ├── design/
│   │   │       │   ├── page.tsx      # Theme customization
│   │   │       │   └── pages/
│   │   │       │       └── [pageId]/page.tsx
│   │   │       │
│   │   │       └── settings/
│   │   │           ├── page.tsx      # Store settings
│   │   │           ├── domain/page.tsx
│   │   │           └── shipping/page.tsx
│   │   │
│   │   └── workspace/
│   │       └── settings/page.tsx
│   │
│   └── [storeSlug]/                  # PUBLIC STOREFRONT
│       ├── page.tsx                  # Homepage
│       ├── products/
│       │   ├── page.tsx              # All products
│       │   └── [slug]/page.tsx       # Product detail
│       ├── collections/
│       │   └── [slug]/page.tsx       # Collection page
│       ├── cart/page.tsx
│       ├── checkout/page.tsx
│       ├── about/page.tsx
│       └── contact/page.tsx
│
├── components/
│   ├── ui/                           # shadcn/ui
│   │
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StoreCard.tsx
│   │   ├── ProductCard.tsx
│   │   └── OrderCard.tsx
│   │
│   ├── storefront/                   # Public store components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── Cart.tsx
│   │   ├── CheckoutForm.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── FeaturedProducts.tsx
│   │       ├── FeaturedCollections.tsx
│   │       └── AboutSection.tsx
│   │
│   ├── theme-renderer/               # Render theme JSON
│   │   ├── StoreRenderer.tsx
│   │   └── SectionRenderer.tsx
│   │
│   └── product/
│       ├── ProductForm.tsx
│       ├── ProductImages.tsx
│       └── VariantManager.tsx
│
├── lib/
│   ├── api/
│   │   ├── stores.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   └── customers.ts
│   │
│   ├── store/                        # Zustand
│   │   ├── authStore.ts
│   │   ├── storeStore.ts
│   │   ├── cartStore.ts
│   │   └── checkoutStore.ts
│   │
│   └── utils/
│       ├── currency.ts
│       ├── inventory.ts
│       └── shipping.ts
│
└── types/
    ├── store.ts
    ├── product.ts
    ├── order.ts
    └── theme.ts
```

### 6.2 Storefront Theme Renderer

```typescript
// components/storefront/StoreRenderer.tsx
'use client';

import { Store, StoreTheme } from '@/types/store';
import { SectionRenderer } from './SectionRenderer';

interface StoreRendererProps {
  store: Store;
  theme: StoreTheme;
  children: React.ReactNode; // Page content
}

export function StoreRenderer({ store, theme, children }: StoreRendererProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: theme.fonts.body,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        direction: 'rtl',
      }}
    >
      {/* Header */}
      <Header store={store} theme={theme} />

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <Footer store={store} theme={theme} />
    </div>
  );
}
```

```typescript
// app/[storeSlug]/page.tsx (Homepage)
import { getStoreBySlug } from '@/lib/api/stores';
import { StoreRenderer } from '@/components/storefront/StoreRenderer';
import { SectionRenderer } from '@/components/storefront/SectionRenderer';

export default async function StorefrontPage({ params }) {
  const store = await getStoreBySlug(params.storeSlug);

  return (
    <StoreRenderer store={store} theme={store.theme}>
      {store.theme.homepageSections
        .filter((s) => s.enabled)
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            theme={store.theme}
            storeId={store.id}
          />
        ))}
    </StoreRenderer>
  );
}
```

### 6.3 Product Page Example

```typescript
// app/[storeSlug]/products/[slug]/page.tsx
import { getProduct } from '@/lib/api/products';
import { AddToCartButton } from '@/components/storefront/AddToCartButton';
import { ProductImages } from '@/components/storefront/ProductImages';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.storeSlug, params.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <ProductImages images={product.images} />

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary">
              {product.price / 100} ريال
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-gray-400 line-through">
                {product.compareAtPrice / 100} ريال
              </span>
            )}
          </div>

          <div className="prose prose-sm mb-6">
            {product.shortDescription}
          </div>

          {product.features && (
            <ul className="mb-6 space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Full Description */}
          <div className="mt-8 prose">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6.4 Cart & Checkout (Client Components)

```typescript
// lib/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        const existing = state.items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existing) {
          return {
            items: state.items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }

        return { items: [...state.items, item] };
      }),

      removeItem: (productId, variantId) => set((state) => ({
        items: state.items.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        ),
      })),

      updateQuantity: (productId, quantity, variantId) => set((state) => ({
        items: state.items.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity }
            : i
        ),
      })),

      clearCart: () => set({ items: [] }),

      total: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

---

## 7️⃣ MVP DEFINITION (UPDATED)

### 7.1 MVP Scope

**✅ INCLUDED IN MVP:**

**Store Management:**
- Create stores with AI (questionnaire)
- AI-generated theme and content
- Basic theme customization (colors, fonts)
- Subdomain routing: `{slug}.storear.com`
- Store pages: Home, About, Contact
- Publish/pause store

**Product Management:**
- Add products with AI descriptions
- Manual product creation
- Product images (upload to cloud)
- Simple inventory tracking
- Collections/categories
- Product variants (basic: size, color)
- Bulk import (CSV)

**Storefront:**
- Responsive store homepage
- Product listing page
- Product detail page
- Collection pages
- Shopping cart
- Checkout (COD only in MVP)
- Order confirmation

**Orders:**
- Customer order placement (COD)
- Order management dashboard
- Order status updates
- Email notifications
- Export orders to CSV

**Customers:**
- Customer database (auto-created from orders)
- Customer profile view
- Order history per customer

**Analytics:**
- Store views
- Product views
- Orders count
- Revenue tracking
- Top products
- Last 30 days chart

**Plans & Billing:**
- Free: 1 store, 10 products, 50 orders/month
- Starter ($29): 3 stores, 200 products/store, 1000 orders/month
- Pro ($79): 10 stores, unlimited products/orders
- Stripe integration

---

**❌ POSTPONED (Post-MVP):**

- Custom domains
- Multiple payment methods (Cards, Apple Pay, etc.)
- Shipping calculator
- Tax calculator
- Discount codes / Coupons
- Abandoned cart recovery
- Email marketing
- Product reviews (customer-submitted)
- Multi-language stores
- WhatsApp automation
- SMS notifications
- Advanced inventory (low stock alerts, restock)
- Product bundles
- Upsells / Cross-sells
- Customer accounts / Login
- Wishlist
- Order tracking page (public)
- Advanced analytics (conversion funnels, cohorts)
- A/B testing
- Mobile app

---

### 7.2 Free vs Paid Limits

| Feature | Free | Starter ($29/mo) | Pro ($79/mo) |
|---------|------|------------------|--------------|
| Stores | 1 | 3 | 10 |
| Products per store | 10 | 200 | Unlimited |
| Orders/month | 50 | 1,000 | Unlimited |
| AI Generations/month | 50 | 500 | 2,000 |
| Storage (images) | 500 MB | 5 GB | 20 GB |
| Custom domain | ❌ | ❌ | ✅ |
| Remove branding | ❌ | ❌ | ✅ |
| WhatsApp integration | ❌ | ❌ | ✅ |
| Advanced analytics | ❌ | ❌ | ✅ |
| Priority support | ❌ | ❌ | ✅ |
| Team members | 1 | 2 | 5 |

---

## 8️⃣ SCALABILITY & COST CONTROL

### 8.1 AI Usage Limits

```typescript
AI Generation Quotas:
Free: 50/month (1-2 stores with products)
Starter: 500/month (enough for 3 stores + 150 products)
Pro: 2000/month (10 stores + 500+ products)

Rate Limits:
Free: 5 AI generations per hour
Starter: 20 per hour
Pro: 50 per hour

Cost Control:
- Use GPT-4o-mini ($0.15/1M input tokens)
- Average product description: ~500 tokens = $0.00008
- 1000 generations ≈ $0.08
- Cache common prompts (15 min TTL)
- Batch process during off-peak
```

### 8.2 Image Storage

```typescript
Strategy:
- CloudFlare R2 (S3-compatible, cheaper egress)
- Or AWS S3 + CloudFront

Limits:
Free: 500 MB (≈50 products with 10 images each)
Starter: 5 GB (≈500 products)
Pro: 20 GB (≈2000 products)

Optimization:
- Auto-resize on upload (max 1200px width)
- WebP conversion
- Lazy loading on storefront
```

### 8.3 Database Optimization

```typescript
Indexes:
- Store.slug (subdomain routing)
- Product.storeId + status (listing)
- Order.storeId + status (dashboard)
- Order.createdAt (sorting)
- Customer.storeId + phone (unique)

Query Optimization:
- Use Prisma select to fetch only needed fields
- Paginate all lists (default 20 items)
- Use read replicas for analytics queries
```

---

## 9️⃣ COMPETITIVE DIFFERENTIATION

### Why StoreAR Beats Competitors

**vs Shopify:**

| Feature | Shopify | StoreAR |
|---------|---------|---------|
| Setup Time | 2-3 hours | **3 minutes (AI)** |
| Arabic Support | ⚠️ Apps/themes | ✅ Native AI |
| AI Content | ❌ None | ✅ Full store + products |
| Pricing | $39/mo + apps | **$29/mo all-in** |
| COD Focus | ⚠️ Generic | ✅ Optimized |
| Learning Curve | ⚠️ Complex | ✅ Zero |
| Target User | Medium+ business | **Small merchants** |

**Advantage:**
- **100x faster setup** - AI does everything
- **50% cheaper** - No expensive apps
- **Arabic-first** - Not translated
- **Simple** - Not overwhelming

---

**vs Zid / Salla (Arabic platforms):**

| Feature | Zid/Salla | StoreAR |
|---------|-----------|---------|
| AI Content | ❌ Manual | ✅ Full AI |
| Setup Speed | 30-60 min | **3 minutes** |
| Product Descriptions | ⚠️ Manual | ✅ AI-generated |
| Pricing | ~$30/mo | Same, but AI |
| Templates | ⚠️ Pick & customize | ✅ AI creates custom |

**Advantage:**
- **AI differentiation** - Only AI-first platform in Arabic
- **Speed** - 10x faster than competitors
- **Quality** - AI writes better copy than most merchants

---

**vs EasyOrder:**

| Feature | EasyOrder | StoreAR |
|---------|-----------|---------|
| Use Case | Single landing page | **Full store** |
| Products | 1 product focus | Multiple products |
| AI | ❌ None | ✅ Full AI |

**Advantage:**
- Not competing - different use case
- StoreAR for multi-product catalogs
- EasyOrder for single-product campaigns

---

### Core Unique Value Props

1. **AI-First E-Commerce**
   - Only platform where AI builds your entire store
   - AI writes all product descriptions
   - AI chooses design theme
   - Zero manual content creation

2. **3-Minute Store Launch**
   - Answer 8 questions
   - AI generates complete store
   - Add products in 1 minute each
   - Publish and sell immediately

3. **Arabic Market Expertise**
   - Built for COD (default payment)
   - Arabic copywriting optimized for conversion
   - Local shipping integrations (SMSA, Aramex)
   - Saudi/GCC market focus

4. **Simple, Not Overwhelming**
   - No complex dashboards
   - No 100 settings to configure
   - Perfect for non-technical merchants
   - Focused feature set

5. **All-in-One Pricing**
   - No hidden fees
   - No expensive apps to buy
   - Predictable monthly cost
   - Better value than competition

---

## 🎯 IMPLEMENTATION ROADMAP

### Phase 1 (Weeks 1-2): Foundation
- ✅ Prisma schema + PostgreSQL setup
- ✅ Nest.js backend structure
- ✅ Next.js frontend structure
- ✅ Authentication (email + Google)
- ✅ Workspace creation
- ✅ Basic UI with Tailwind + shadcn/ui

### Phase 2 (Weeks 3-4): AI Core
- ✅ Store Setup AI engine
- ✅ Product Description AI engine
- ✅ BullMQ + Redis setup
- ✅ AI generation pipeline
- ✅ Store creation flow

### Phase 3 (Weeks 5-6): Store & Products
- ✅ Store management dashboard
- ✅ Product CRUD
- ✅ Collections
- ✅ Image upload (CloudFlare R2)
- ✅ Theme customization UI
- ✅ Bulk product import

### Phase 4 (Weeks 7-8): Storefront
- ✅ Public store renderer
- ✅ Homepage sections
- ✅ Product listing
- ✅ Product detail page
- ✅ Shopping cart
- ✅ Checkout (COD)

### Phase 5 (Weeks 9-10): Orders & Launch
- ✅ Order management
- ✅ Customer database
- ✅ Email notifications
- ✅ Analytics dashboard
- ✅ Stripe billing
- ✅ Final testing
- ✅ Deploy to production

**Total: 10 weeks to MVP**

---

## ✅ READY TO BUILD

This is a **complete, production-ready architecture** for a multi-store e-commerce SaaS platform with AI.

**What would you like me to start building?**

1. **Complete Prisma schema + migrations** - Full database setup
2. **AI engines implementation** - Working OpenAI integration
3. **Nest.js backend** - Complete API with auth, stores, products, orders
4. **Next.js storefront renderer** - Public store with cart & checkout
5. **Dashboard UI** - Store management interface
6. **Everything in order** - Full MVP implementation phase by phase

Let me know where to begin! 🚀
