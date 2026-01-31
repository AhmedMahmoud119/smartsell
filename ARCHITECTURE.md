# 🚀 ConvertAR - AI-Powered Arabic Landing Page SaaS

## Product Name: ConvertAR
**Tagline:** من فكرة إلى صفحة مبيعات في دقائق - AI-Powered Conversion Pages for Arabic Merchants

---

## 1️⃣ PRODUCT ARCHITECTURE

### 1.1 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                            │
├─────────────────────────────────────────────────────────────┤
│  Sign Up → Answer Questions → AI Generates → Edit →         │
│  Publish → Share Link → Collect Orders → Analytics          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PLATFORM MODULES                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth &     │  │  AI Engine   │  │   Builder    │     │
│  │   Tenant     │  │   Module     │  │   Editor     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Page       │  │   Orders &   │  │  Analytics   │     │
│  │   Renderer   │  │   Leads      │  │   & Stats    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Subscription│  │   Webhooks   │  │   Admin      │     │
│  │  & Billing   │  │   & API      │  │   Panel      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Multi-Tenant Architecture

**Tenant Model:** Workspace-based multi-tenancy

```typescript
Tenant Hierarchy:
└── User (email login)
    └── Workspace(s) (team/business)
        └── Projects (product categories)
            └── Pages (individual landing pages)
                └── Orders/Leads
```

**Isolation Strategy:**
- Row-Level Security (RLS) via Prisma middleware
- All queries filtered by `workspaceId`
- Subdomain routing: `{workspace-slug}.convertar.com`
- Custom domain support (premium feature)

**Resource Limits per Tenant:**
- Free: 1 workspace, 3 pages, 100 AI generations/month
- Starter: 1 workspace, 20 pages, 1000 generations/month
- Pro: 3 workspaces, unlimited pages, 5000 generations/month
- Enterprise: Custom

### 1.3 Core User Journey (Detailed)

**Step 1: Onboarding (2 minutes)**
```
Sign Up (Email/Google)
  ↓
Create Workspace (business name)
  ↓
Select Plan (Free to start)
  ↓
Skip tour → "Create First Page" CTA
```

**Step 2: AI Generation (30 seconds)**
```
Smart Questionnaire (8-10 questions):
  1. ما المنتج الذي تبيعه؟ (What are you selling?)
  2. من هو الزبون المثالي؟ (Target customer?)
  3. ما السعر؟ (Price?)
  4. ما الميزة الأهم؟ (Top benefit?)
  5. هل لديك عرض خاص؟ (Special offer?)
  6. ما نوع الصفحة؟ (Page type: Product / Service / Lead Gen)
  7. طريقة التواصل؟ (Contact method: WhatsApp / Form / Phone)
  8. هل تريد نموذج طلب؟ (Order form: Yes/No)

  ↓
AI Processing (3 engines run in parallel):
  - Copywriting Engine → Headlines, benefits, CTAs
  - Layout Engine → Section selection & order
  - Offer Engine → Pricing, urgency, guarantees

  ↓
Generate JSON Page Schema (5-7 sections)
```

**Step 3: Visual Editing (5 minutes)**
```
Builder Interface:
  - Preview (mobile-first)
  - Section list (draggable, locked AI sections highlighted)
  - Inline text editing
  - Image upload
  - Style tweaks (colors, fonts)
  - CTA customization

No code → Only content + style
```

**Step 4: Publish & Share (instant)**
```
Publish → Generate unique URL
  ↓
Share via:
  - WhatsApp
  - Facebook
  - Instagram bio
  - QR Code
```

**Step 5: Collect Orders (ongoing)**
```
Customer fills form → Order created
  ↓
Merchant gets:
  - Real-time notification (email/WhatsApp)
  - Order in dashboard
  - Customer details exported
```

---

## 2️⃣ DATABASE DESIGN (PostgreSQL + Prisma)

### 2.1 Complete Prisma Schema

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
  passwordHash  String?   // null if OAuth
  name          String
  phone         String?
  locale        String    @default("ar") // ar, en

  emailVerified Boolean   @default(false)
  verifiedAt    DateTime?

  provider      String?   // google, email
  providerId    String?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  // Relations
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
  name        String   // Business name
  slug        String   @unique // URL slug

  // Branding
  logo        String?
  primaryColor String  @default("#2563eb")

  // Subdomain / Custom domain
  subdomain   String?  @unique
  customDomain String? @unique
  domainVerified Boolean @default(false)

  // Limits
  planId      String

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  plan        Plan     @relation(fields: [planId], references: [id])
  members     WorkspaceMember[]
  projects    Project[]
  subscriptions Subscription[]
  usage       UsageRecord[]

  @@index([slug])
  @@index([subdomain])
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
  name            String   // Free, Starter, Pro, Enterprise
  slug            String   @unique

  price           Int      // Monthly price in cents
  currency        String   @default("USD")

  // Limits
  maxWorkspaces   Int      @default(1)
  maxPages        Int      @default(3)
  maxAiGenerations Int     @default(100)
  maxOrdersPerMonth Int    @default(1000)

  // Features
  customDomain    Boolean  @default(false)
  whatsappIntegration Boolean @default(false)
  analyticsAdvanced Boolean @default(false)
  apiAccess       Boolean  @default(false)
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
// PROJECTS & PAGES
// =====================

model Project {
  id          String   @id @default(cuid())
  workspaceId String

  name        String   // e.g., "منتجات العناية"
  description String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  pages       Page[]

  @@index([workspaceId])
}

model Page {
  id          String   @id @default(cuid())
  projectId   String
  workspaceId String   // Denormalized for faster queries

  // Metadata
  title       String
  slug        String   // URL slug
  description String?

  // Status
  status      PageStatus @default(DRAFT)
  publishedAt DateTime?

  // Page Type
  type        PageType   @default(PRODUCT)

  // JSON Schema (CORE)
  schema      Json       // Full page definition

  // SEO
  metaTitle   String?
  metaDescription String?
  ogImage     String?

  // Analytics
  views       Int      @default(0)
  conversions Int      @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  orders      Order[]
  leads       Lead[]
  generations AiGeneration[]

  @@unique([workspaceId, slug])
  @@index([workspaceId])
  @@index([status])
}

enum PageStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum PageType {
  PRODUCT      // Single product landing page
  SERVICE      // Service offering page
  LEAD_GEN     // Lead capture (free consultation, etc.)
  ECOMMERCE    // Multi-product simple store
}

// =====================
// AI GENERATIONS
// =====================

model AiGeneration {
  id          String   @id @default(cuid())
  pageId      String?
  workspaceId String

  // Input
  inputs      Json     // User questionnaire answers

  // Output
  outputs     Json     // Generated content

  // Metadata
  engine      AiEngine
  model       String   // e.g., "gpt-4"
  tokensUsed  Int

  status      GenerationStatus @default(PENDING)
  error       String?

  createdAt   DateTime @default(now())
  completedAt DateTime?

  page        Page?    @relation(fields: [pageId], references: [id], onDelete: SetNull)

  @@index([workspaceId])
  @@index([createdAt])
}

enum AiEngine {
  COPYWRITING
  LAYOUT
  OFFER
}

enum GenerationStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

// =====================
// ORDERS & LEADS
// =====================

model Order {
  id          String   @id @default(cuid())
  pageId      String
  workspaceId String   // Denormalized

  // Customer Info
  customerName  String
  customerPhone String
  customerEmail String?
  customerAddress String?
  customerCity    String?
  customerNotes   String?

  // Order Details
  items       Json     // [{product, quantity, price}]
  subtotal    Int      // In cents
  shipping    Int      @default(0)
  total       Int
  currency    String   @default("SAR")

  // Status
  status      OrderStatus @default(NEW)

  // Tracking
  source      String?  // utm_source

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  page        Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@index([workspaceId])
  @@index([status])
  @@index([createdAt])
}

enum OrderStatus {
  NEW
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELED
}

model Lead {
  id          String   @id @default(cuid())
  pageId      String
  workspaceId String

  // Lead Info
  name        String
  phone       String
  email       String?
  message     String?

  // Custom fields
  customFields Json?

  // Status
  status      LeadStatus @default(NEW)

  // Tracking
  source      String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  page        Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@index([workspaceId])
  @@index([status])
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  CONVERTED
  LOST
}

// =====================
// USAGE TRACKING
// =====================

model UsageRecord {
  id          String   @id @default(cuid())
  workspaceId String

  // Metrics
  metric      UsageMetric
  value       Int      @default(1)

  // Period
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
  PAGE_VIEW
  ORDER_CREATED
  LEAD_CREATED
}
```

### 2.2 Database Indexes Strategy

**Critical Indexes (Already included):**
- `User.email` (unique + index) - Fast login lookups
- `Workspace.slug` - Subdomain routing
- `Page.workspaceId + status` - Dashboard queries
- `Order.workspaceId + createdAt` - Order list with pagination
- `UsageRecord.workspaceId + year + month` - Billing calculations

**Query Patterns:**
```sql
-- Most common queries:
1. Get workspace pages: WHERE workspaceId = ? AND status = 'PUBLISHED'
2. Get workspace orders: WHERE workspaceId = ? ORDER BY createdAt DESC
3. Calculate monthly usage: WHERE workspaceId = ? AND year = ? AND month = ?
```

---

## 3️⃣ AI SYSTEM DESIGN

### 3.1 Overview

Three specialized AI engines run in parallel (BullMQ jobs) and results merge into final page schema.

```
User Answers → Queue 3 Jobs → Process in Parallel → Merge Results → Save Page
```

### 3.2 Engine A: Copywriting Engine

**Purpose:** Generate conversion-focused Arabic copy

**Inputs:**
```typescript
interface CopywritingInput {
  productName: string;          // "كريم الكولاجين"
  productDescription: string;   // "يشد البشرة ويزيل التجاعيد"
  targetAudience: string;       // "سيدات 30-50 سنة"
  mainBenefit: string;          // "بشرة شابة في أسبوعين"
  price: number;                // 299
  currency: string;             // "SAR"
  specialOffer?: string;        // "خصم 50% + شحن مجاني"
  pageType: 'PRODUCT' | 'SERVICE' | 'LEAD_GEN';
}
```

**Outputs:**
```typescript
interface CopywritingOutput {
  headline: string;              // "احصلي على بشرة شابة خالية من التجاعيد"
  subheadline: string;           // "كريم الكولاجين الألماني - نتائج مثبتة في 14 يوم"

  benefitsList: string[];        // ["يشد البشرة", "يزيل التجاعيد", ...]

  socialProof: string;           // "أكثر من 10,000 زبونة راضية"

  cta: {
    primary: string;             // "اطلبي الآن"
    secondary: string;           // "تواصلي معنا"
  };

  urgency: string;              // "العرض ينتهي خلال 48 ساعة"

  guarantee: string;            // "ضمان استرجاع المال خلال 30 يوم"

  faqs: Array<{
    question: string;
    answer: string;
  }>;
}
```

**Prompt Structure:**
```typescript
const COPYWRITING_PROMPT = `
أنت خبير كتابة إعلانات تسويقية عربية متخصص في زيادة المبيعات للتجار العرب.

مهمتك: كتابة نصوص مقنعة لصفحة هبوط تبيع منتج.

قواعد الكتابة:
- استخدم اللغة العربية الفصحى المبسطة
- ركز على الفوائد وليس المميزات
- استخدم أسلوب عاطفي مقنع
- اجعل العميل يتخيل النتيجة
- استخدم أرقام محددة
- أضف عنصر الاستعجال

معلومات المنتج:
اسم المنتج: {{productName}}
الوصف: {{productDescription}}
الجمهور المستهدف: {{targetAudience}}
الفائدة الرئيسية: {{mainBenefit}}
السعر: {{price}} {{currency}}
العرض الخاص: {{specialOffer}}

اكتب:
1. عنوان رئيسي قوي (10-15 كلمة)
2. عنوان فرعي يشرح الفائدة (15-20 كلمة)
3. قائمة 5 فوائد رئيسية
4. جملة دليل اجتماعي
5. نص زر الشراء الرئيسي
6. نص زر تواصل ثانوي
7. جملة استعجال
8. ضمان مطمئن
9. 3 أسئلة شائعة مع أجوبة

أرجع النتيجة بصيغة JSON فقط:
{
  "headline": "...",
  "subheadline": "...",
  "benefitsList": ["...", "..."],
  "socialProof": "...",
  "cta": {
    "primary": "...",
    "secondary": "..."
  },
  "urgency": "...",
  "guarantee": "...",
  "faqs": [
    {"question": "...", "answer": "..."}
  ]
}
`;
```

**Validation Rules:**
```typescript
function validateCopywriting(output: CopywritingOutput): boolean {
  return (
    output.headline.length >= 10 &&
    output.headline.length <= 100 &&
    output.benefitsList.length >= 3 &&
    output.benefitsList.length <= 7 &&
    output.faqs.length >= 3 &&
    /[\u0600-\u06FF]/.test(output.headline) // Contains Arabic
  );
}
```

**Fallback Behavior:**
- If generation fails: Use template-based copy with variable substitution
- If validation fails: Retry with adjusted prompt (max 2 retries)
- If still fails: Return default Arabic templates

---

### 3.3 Engine B: Layout Decision Engine

**Purpose:** Select optimal sections and order based on page type and product

**Inputs:**
```typescript
interface LayoutInput {
  pageType: 'PRODUCT' | 'SERVICE' | 'LEAD_GEN';
  hasOffer: boolean;
  hasTestimonials: boolean;
  hasImages: boolean;
  targetAction: 'ORDER' | 'WHATSAPP' | 'LEAD_FORM';
  productComplexity: 'SIMPLE' | 'COMPLEX'; // Simple = single product, Complex = needs explanation
}
```

**Outputs:**
```typescript
interface LayoutOutput {
  sections: Array<{
    id: string;
    type: SectionType;
    required: boolean;      // Can't be deleted by user
    order: number;
    variant: string;        // e.g., "hero-image-right", "hero-centered"
  }>;
}

type SectionType =
  | 'HERO'
  | 'BENEFITS'
  | 'SOCIAL_PROOF'
  | 'HOW_IT_WORKS'
  | 'OFFER'
  | 'FAQ'
  | 'ORDER_FORM'
  | 'TESTIMONIALS'
  | 'GUARANTEE'
  | 'URGENCY';
```

**Decision Logic (Rule-Based + AI):**

```typescript
// Rule-based core logic
const LAYOUT_RULES = {
  PRODUCT: {
    required: ['HERO', 'BENEFITS', 'ORDER_FORM'],
    recommended: ['SOCIAL_PROOF', 'GUARANTEE', 'FAQ'],
    optional: ['HOW_IT_WORKS', 'TESTIMONIALS'],
  },
  SERVICE: {
    required: ['HERO', 'BENEFITS', 'LEAD_FORM'],
    recommended: ['HOW_IT_WORKS', 'SOCIAL_PROOF', 'FAQ'],
    optional: ['TESTIMONIALS', 'GUARANTEE'],
  },
  LEAD_GEN: {
    required: ['HERO', 'BENEFITS', 'LEAD_FORM'],
    recommended: ['SOCIAL_PROOF'],
    optional: ['FAQ'],
  },
};

// AI Enhancement Prompt
const LAYOUT_PROMPT = `
أنت خبير تصميم صفحات هبوط عالية التحويل.

المهمة: اختر الأقسام الأمثل لصفحة بيع {{pageType}}.

المعطيات:
- نوع الصفحة: {{pageType}}
- لديه عرض خاص: {{hasOffer}}
- تعقيد المنتج: {{productComplexity}}
- الإجراء المطلوب: {{targetAction}}

القواعد:
- صفحة المنتج البسيط: 5-6 أقسام فقط
- صفحة المنتج المعقد: 7-8 أقسام
- التركيز على السرعة والوضوح
- القسم الأول دائماً HERO
- القسم الأخير دائماً نموذج الطلب

اختر الأقسام المناسبة من:
HERO, BENEFITS, SOCIAL_PROOF, HOW_IT_WORKS, OFFER, FAQ, ORDER_FORM, TESTIMONIALS, GUARANTEE, URGENCY

أرجع JSON:
{
  "sections": [
    {"type": "HERO", "required": true, "order": 1, "variant": "hero-image-right"},
    ...
  ]
}
`;
```

**Validation:**
```typescript
function validateLayout(output: LayoutOutput): boolean {
  const hasHero = output.sections.some(s => s.type === 'HERO');
  const hasForm = output.sections.some(s =>
    s.type === 'ORDER_FORM' || s.type === 'LEAD_FORM'
  );
  const totalSections = output.sections.length;

  return hasHero && hasForm && totalSections >= 4 && totalSections <= 8;
}
```

**Fallback:**
- Use rule-based templates per page type
- Default order: HERO → BENEFITS → SOCIAL_PROOF → FAQ → FORM

---

### 3.4 Engine C: Offer & CTA Engine

**Purpose:** Create urgency, pricing structure, and compelling CTAs

**Inputs:**
```typescript
interface OfferInput {
  basePrice: number;
  currency: string;
  hasDiscount: boolean;
  discountPercent?: number;
  hasFreeShipping: boolean;
  hasGift: boolean;
  giftDescription?: string;
  paymentMethod: 'COD' | 'ONLINE' | 'BOTH';
}
```

**Outputs:**
```typescript
interface OfferOutput {
  pricing: {
    original: number;
    current: number;
    savings: number;
    displayText: string;       // "299 ريال بدلاً من 599 ريال"
  };

  offer: {
    badge: string;             // "خصم 50%"
    title: string;             // "عرض لفترة محدودة"
    description: string;       // "اطلب الآن واحصل على شحن مجاني + هدية"
    expiresIn: string;         // "ينتهي خلال 48 ساعة"
  };

  cta: {
    text: string;              // "اطلب الآن - ادفع عند الاستلام"
    subtext: string;           // "شحن مجاني لجميع مدن المملكة"
  };

  guarantee: {
    icon: string;              // "shield"
    text: string;              // "ضمان استرجاع المال 100%"
  };
}
```

**Prompt:**
```typescript
const OFFER_PROMPT = `
أنت خبير تسعير وعروض تجارية للسوق العربي (خصوصاً السعودية ومصر).

المهمة: صمم عرض مغري يزيد معدل التحويل.

المعطيات:
- السعر الأساسي: {{basePrice}} {{currency}}
- يوجد خصم: {{hasDiscount}} ({{discountPercent}}%)
- شحن مجاني: {{hasFreeShipping}}
- هدية مجانية: {{hasGift}} ({{giftDescription}})
- طريقة الدفع: {{paymentMethod}}

قواعد السوق العربي:
- الدفع عند الاستلام مهم جداً (يزيد الثقة)
- الشحن المجاني عامل قوي
- الهدايا المجانية فعالة
- الاستعجال ضروري (عرض محدود)
- الضمان يقلل المخاطر

اكتب:
1. نص السعر الجذاب
2. شارة العرض
3. وصف العرض الكامل
4. مدة انتهاء العرض (24-72 ساعة)
5. نص زر الشراء قوي
6. نص فرعي مطمئن
7. نص الضمان

أرجع JSON فقط.
`;
```

**Validation:**
```typescript
function validateOffer(output: OfferOutput): boolean {
  return (
    output.pricing.current > 0 &&
    output.pricing.current <= output.pricing.original &&
    output.cta.text.length >= 5 &&
    output.cta.text.length <= 50 &&
    output.offer.expiresIn !== ''
  );
}
```

**Fallback:**
- Use pricing as-is from input
- Default CTA: "اطلب الآن"
- Default guarantee: "ضمان الاسترجاع"

---

### 3.5 AI Pipeline Orchestration

**BullMQ Queue Setup:**

```typescript
// ai-generation.queue.ts

import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const aiGenerationQueue = new Queue('ai-generation', {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

// Job Types
export interface GeneratePageJob {
  workspaceId: string;
  userId: string;
  inputs: QuestionnaireAnswers;
}

export interface QuestionnaireAnswers {
  productName: string;
  productDescription: string;
  targetAudience: string;
  price: number;
  currency: string;
  mainBenefit: string;
  specialOffer?: string;
  pageType: 'PRODUCT' | 'SERVICE' | 'LEAD_GEN';
  contactMethod: 'WHATSAPP' | 'FORM' | 'PHONE';
  needsOrderForm: boolean;
  hasImages: boolean;
  productComplexity: 'SIMPLE' | 'COMPLEX';
}
```

**Worker Process:**

```typescript
// ai-generation.worker.ts

import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { generateCopywriting, generateLayout, generateOffer } from './engines';

const prisma = new PrismaClient();

export const aiWorker = new Worker(
  'ai-generation',
  async (job) => {
    const { workspaceId, userId, inputs } = job.data as GeneratePageJob;

    // Update progress
    await job.updateProgress(10);

    // Run 3 engines in parallel
    const [copywriting, layout, offer] = await Promise.all([
      generateCopywriting(inputs),
      generateLayout(inputs),
      generateOffer(inputs),
    ]);

    await job.updateProgress(60);

    // Merge results into page schema
    const pageSchema = mergeEngineOutputs(copywriting, layout, offer, inputs);

    await job.updateProgress(80);

    // Save to database
    const page = await prisma.page.create({
      data: {
        workspaceId,
        projectId: inputs.projectId || await getDefaultProject(workspaceId),
        title: inputs.productName,
        slug: generateSlug(inputs.productName),
        type: inputs.pageType,
        schema: pageSchema,
        status: 'DRAFT',
      },
    });

    // Track usage
    await prisma.usageRecord.create({
      data: {
        workspaceId,
        metric: 'AI_GENERATION',
        value: 1,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      },
    });

    await job.updateProgress(100);

    return { pageId: page.id };
  },
  {
    connection: redis,
    concurrency: 10, // Process 10 jobs in parallel
  }
);

aiWorker.on('completed', (job) => {
  console.log(`✅ Page generated: ${job.returnvalue.pageId}`);
});

aiWorker.on('failed', (job, err) => {
  console.error(`❌ Generation failed: ${job.id}`, err);
});
```

---

## 4️⃣ PAGE JSON SCHEMA

### 4.1 Schema Structure

```typescript
// types/page-schema.ts

export interface PageSchema {
  version: string;              // "1.0"
  metadata: PageMetadata;
  theme: PageTheme;
  sections: Section[];
}

export interface PageMetadata {
  title: string;
  description: string;
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
  favicon?: string;
}

export interface PageTheme {
  colors: {
    primary: string;            // "#2563eb"
    secondary: string;
    background: string;
    text: string;
    textLight: string;
    success: string;
    error: string;
  };
  fonts: {
    heading: string;            // "Cairo"
    body: string;               // "Tajawal"
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg';
  spacing: 'compact' | 'normal' | 'relaxed';
}

export interface Section {
  id: string;                   // Unique section ID
  type: SectionType;
  locked: boolean;              // AI-generated sections locked from deletion
  visible: boolean;
  order: number;
  variant: string;              // Section variant/style
  data: SectionData;
  style?: SectionStyle;
}

export type SectionType =
  | 'HERO'
  | 'BENEFITS'
  | 'SOCIAL_PROOF'
  | 'HOW_IT_WORKS'
  | 'OFFER'
  | 'FAQ'
  | 'ORDER_FORM'
  | 'TESTIMONIALS'
  | 'GUARANTEE'
  | 'URGENCY'
  | 'FOOTER';

export interface SectionData {
  [key: string]: any; // Type-specific data
}

export interface SectionStyle {
  background?: string;
  padding?: {
    top: number;
    bottom: number;
  };
  textAlign?: 'left' | 'center' | 'right';
}

// =====================
// SECTION-SPECIFIC DATA
// =====================

export interface HeroSectionData extends SectionData {
  headline: string;
  subheadline: string;
  image?: string;
  cta: {
    text: string;
    action: CTAction;
  };
  secondaryCta?: {
    text: string;
    action: CTAction;
  };
}

export interface BenefitsSectionData extends SectionData {
  title: string;
  subtitle?: string;
  benefits: Array<{
    id: string;
    icon: string;               // Icon name or emoji
    title: string;
    description: string;
  }>;
}

export interface SocialProofSectionData extends SectionData {
  text: string;                 // "أكثر من 10,000 زبون راضي"
  stats?: Array<{
    value: string;              // "10,000+"
    label: string;              // "زبون راضي"
  }>;
}

export interface OfferSectionData extends SectionData {
  badge: string;
  title: string;
  description: string;
  pricing: {
    original: number;
    current: number;
    currency: string;
    displayText: string;
  };
  features: string[];
  cta: {
    text: string;
    subtext?: string;
    action: CTAction;
  };
  urgency?: {
    text: string;
    icon?: string;
  };
}

export interface FAQSectionData extends SectionData {
  title: string;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

export interface OrderFormSectionData extends SectionData {
  title: string;
  subtitle?: string;
  fields: FormField[];
  submitButton: {
    text: string;
    loadingText?: string;
  };
  paymentMethods: Array<'COD' | 'CARD' | 'BANK'>;
  shippingInfo?: string;
  privacyText?: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];           // For select fields
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface TestimonialsSectionData extends SectionData {
  title: string;
  testimonials: Array<{
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    text: string;
    location?: string;
  }>;
}

export interface GuaranteeSectionData extends SectionData {
  icon: string;
  title: string;
  description: string;
}

export type CTAction =
  | { type: 'SCROLL_TO_FORM' }
  | { type: 'WHATSAPP'; phone: string; message: string }
  | { type: 'PHONE'; number: string }
  | { type: 'URL'; url: string };
```

### 4.2 Full Example JSON Output

```json
{
  "version": "1.0",
  "metadata": {
    "title": "كريم الكولاجين الألماني - بشرة شابة خالية من التجاعيد",
    "description": "احصلي على بشرة مشدودة ونضرة في أسبوعين فقط. عرض خاص: خصم 50% + شحن مجاني",
    "language": "ar",
    "direction": "rtl"
  },
  "theme": {
    "colors": {
      "primary": "#10b981",
      "secondary": "#059669",
      "background": "#ffffff",
      "text": "#1f2937",
      "textLight": "#6b7280",
      "success": "#10b981",
      "error": "#ef4444"
    },
    "fonts": {
      "heading": "Cairo",
      "body": "Tajawal"
    },
    "borderRadius": "lg",
    "spacing": "normal"
  },
  "sections": [
    {
      "id": "hero_001",
      "type": "HERO",
      "locked": true,
      "visible": true,
      "order": 1,
      "variant": "hero-image-right",
      "data": {
        "headline": "احصلي على بشرة شابة خالية من التجاعيد في 14 يوم فقط",
        "subheadline": "كريم الكولاجين الألماني - تركيبة طبيعية مثبتة علمياً تعيد شباب بشرتك",
        "image": "https://placeholder.co/600x400",
        "cta": {
          "text": "اطلبي الآن - ادفعي عند الاستلام",
          "action": {
            "type": "SCROLL_TO_FORM"
          }
        },
        "secondaryCta": {
          "text": "تواصلي معنا عبر واتساب",
          "action": {
            "type": "WHATSAPP",
            "phone": "+966500000000",
            "message": "مرحباً، أريد الاستفسار عن كريم الكولاجين"
          }
        }
      },
      "style": {
        "background": "#f9fafb",
        "padding": {
          "top": 80,
          "bottom": 80
        }
      }
    },
    {
      "id": "social_proof_001",
      "type": "SOCIAL_PROOF",
      "locked": false,
      "visible": true,
      "order": 2,
      "variant": "stats-centered",
      "data": {
        "text": "انضمي إلى آلاف السيدات اللواتي استعدن جمال بشرتهن",
        "stats": [
          {
            "value": "12,000+",
            "label": "زبونة راضية"
          },
          {
            "value": "98%",
            "label": "نتائج إيجابية"
          },
          {
            "value": "14 يوم",
            "label": "متوسط النتائج"
          }
        ]
      }
    },
    {
      "id": "benefits_001",
      "type": "BENEFITS",
      "locked": true,
      "visible": true,
      "order": 3,
      "variant": "benefits-grid",
      "data": {
        "title": "لماذا كريم الكولاجين الألماني؟",
        "subtitle": "تركيبة طبيعية 100% تعطي نتائج مذهلة",
        "benefits": [
          {
            "id": "benefit_1",
            "icon": "✨",
            "title": "يشد البشرة بشكل ملحوظ",
            "description": "يحفز إنتاج الكولاجين الطبيعي في البشرة لشد فوري"
          },
          {
            "id": "benefit_2",
            "icon": "🌸",
            "title": "يزيل التجاعيد والخطوط الدقيقة",
            "description": "تقليل ظهور التجاعيد بنسبة تصل إلى 73% خلال أسبوعين"
          },
          {
            "id": "benefit_3",
            "icon": "💧",
            "title": "ترطيب عميق يدوم 24 ساعة",
            "description": "حمض الهيالورونيك يحبس الرطوبة داخل البشرة"
          },
          {
            "id": "benefit_4",
            "icon": "🛡️",
            "title": "حماية من علامات الشيخوخة",
            "description": "فيتامينات C و E تحمي من الجذور الحرة والشمس"
          },
          {
            "id": "benefit_5",
            "icon": "🌿",
            "title": "مكونات طبيعية 100%",
            "description": "خالي من البارابين والكيماويات الضارة"
          }
        ]
      },
      "style": {
        "padding": {
          "top": 60,
          "bottom": 60
        }
      }
    },
    {
      "id": "offer_001",
      "type": "OFFER",
      "locked": true,
      "visible": true,
      "order": 4,
      "variant": "offer-highlight",
      "data": {
        "badge": "خصم 50% - عرض محدود",
        "title": "عرض خاص لفترة محدودة",
        "description": "اطلبي الآن واحصلي على:",
        "pricing": {
          "original": 599,
          "current": 299,
          "currency": "SAR",
          "displayText": "299 ريال فقط بدلاً من 599 ريال"
        },
        "features": [
          "خصم 50% على السعر الأصلي",
          "شحن مجاني لجميع مدن المملكة",
          "هدية مجانية: سيروم فيتامين C (قيمة 149 ريال)",
          "ضمان استرجاع المال خلال 30 يوم"
        ],
        "cta": {
          "text": "اطلبي الآن بخصم 50%",
          "subtext": "الدفع عند الاستلام متاح",
          "action": {
            "type": "SCROLL_TO_FORM"
          }
        },
        "urgency": {
          "text": "ينتهي العرض خلال 48 ساعة",
          "icon": "⏰"
        }
      },
      "style": {
        "background": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "padding": {
          "top": 60,
          "bottom": 60
        }
      }
    },
    {
      "id": "testimonials_001",
      "type": "TESTIMONIALS",
      "locked": false,
      "visible": true,
      "order": 5,
      "variant": "testimonials-cards",
      "data": {
        "title": "ماذا تقول زبوناتنا؟",
        "testimonials": [
          {
            "id": "test_1",
            "name": "نورة أحمد",
            "avatar": "https://i.pravatar.cc/150?img=1",
            "rating": 5,
            "text": "ما صدقت النتيجة! بشرتي صارت مشدودة والتجاعيد حول العين خفت بشكل واضح. أنصح فيه بقوة",
            "location": "الرياض، السعودية"
          },
          {
            "id": "test_2",
            "name": "فاطمة محمد",
            "avatar": "https://i.pravatar.cc/150?img=2",
            "rating": 5,
            "text": "استخدمته لمدة أسبوعين وشفت فرق كبير. بشرتي صارت نضرة ومشرقة. يستاهل كل ريال",
            "location": "جدة، السعودية"
          },
          {
            "id": "test_3",
            "name": "مريم خالد",
            "avatar": "https://i.pravatar.cc/150?img=3",
            "rating": 5,
            "text": "أحسن كريم جربته! ريحته حلوة وملمسه خفيف وما يسبب حبوب. النتيجة رهيبة",
            "location": "دبي، الإمارات"
          }
        ]
      }
    },
    {
      "id": "faq_001",
      "type": "FAQ",
      "locked": true,
      "visible": true,
      "order": 6,
      "variant": "faq-accordion",
      "data": {
        "title": "الأسئلة الشائعة",
        "faqs": [
          {
            "id": "faq_1",
            "question": "متى أشوف النتائج؟",
            "answer": "معظم زبوناتنا يشوفون نتائج واضحة خلال 7-14 يوم من الاستخدام المنتظم. للنتائج المثالية، ننصح بالاستخدام لمدة شهر كامل."
          },
          {
            "id": "faq_2",
            "question": "هل الكريم مناسب لجميع أنواع البشرة؟",
            "answer": "نعم، الكريم مصنوع من مكونات طبيعية ومناسب لجميع أنواع البشرة (جافة، دهنية، مختلطة، حساسة)."
          },
          {
            "id": "faq_3",
            "question": "كيف طريقة الاستخدام؟",
            "answer": "ضعي كمية بحجم حبة البازلاء على الوجه والرقبة النظيفة مرتين يومياً (صباحاً ومساءً). دلكي بحركات دائرية لطيفة حتى الامتصاص الكامل."
          },
          {
            "id": "faq_4",
            "question": "هل الشحن فعلاً مجاني؟",
            "answer": "نعم، الشحن مجاني تماماً لجميع مدن المملكة. التوصيل يستغرق 2-4 أيام عمل."
          },
          {
            "id": "faq_5",
            "question": "ماذا لو ما عجبني المنتج؟",
            "answer": "نحن واثقون من جودة منتجنا. إذا لم تكوني راضية بنسبة 100%، يمكنك إرجاع المنتج خلال 30 يوم واسترجاع كامل المبلغ."
          }
        ]
      },
      "style": {
        "padding": {
          "top": 60,
          "bottom": 60
        }
      }
    },
    {
      "id": "guarantee_001",
      "type": "GUARANTEE",
      "locked": false,
      "visible": true,
      "order": 7,
      "variant": "guarantee-badge",
      "data": {
        "icon": "🛡️",
        "title": "ضمان استرجاع المال خلال 30 يوم",
        "description": "نحن واثقون من جودة منتجنا. جربيه لمدة 30 يوم، وإذا لم تكوني راضية بنسبة 100%، سنرجع لك كامل المبلغ بدون أسئلة."
      },
      "style": {
        "background": "#f0fdf4",
        "padding": {
          "top": 40,
          "bottom": 40
        },
        "textAlign": "center"
      }
    },
    {
      "id": "order_form_001",
      "type": "ORDER_FORM",
      "locked": true,
      "visible": true,
      "order": 8,
      "variant": "form-centered",
      "data": {
        "title": "اطلبي الآن واحصلي على خصم 50%",
        "subtitle": "املأي النموذج وسنتواصل معك خلال دقائق",
        "fields": [
          {
            "id": "name",
            "name": "customerName",
            "label": "الاسم الكامل",
            "type": "text",
            "required": true,
            "placeholder": "مثال: نورة أحمد",
            "validation": {
              "minLength": 3
            }
          },
          {
            "id": "phone",
            "name": "customerPhone",
            "label": "رقم الجوال",
            "type": "tel",
            "required": true,
            "placeholder": "مثال: 0501234567",
            "validation": {
              "pattern": "^(05|\\+9665)[0-9]{8}$"
            }
          },
          {
            "id": "city",
            "name": "customerCity",
            "label": "المدينة",
            "type": "select",
            "required": true,
            "options": [
              "الرياض",
              "جدة",
              "الدمام",
              "مكة",
              "المدينة",
              "الطائف",
              "تبوك",
              "القصيم",
              "حائل",
              "أخرى"
            ]
          },
          {
            "id": "address",
            "name": "customerAddress",
            "label": "العنوان التفصيلي",
            "type": "textarea",
            "required": true,
            "placeholder": "الحي، الشارع، رقم المبنى",
            "validation": {
              "minLength": 10
            }
          },
          {
            "id": "quantity",
            "name": "quantity",
            "label": "الكمية",
            "type": "select",
            "required": true,
            "options": [
              "1 علبة - 299 ريال",
              "2 علبة - 549 ريال (وفري 49 ريال)",
              "3 علبة - 799 ريال (وفري 98 ريال)"
            ]
          },
          {
            "id": "notes",
            "name": "customerNotes",
            "label": "ملاحظات إضافية (اختياري)",
            "type": "textarea",
            "required": false,
            "placeholder": "أي ملاحظات أو استفسارات"
          }
        ],
        "submitButton": {
          "text": "أكد الطلب الآن",
          "loadingText": "جاري إرسال الطلب..."
        },
        "paymentMethods": ["COD"],
        "shippingInfo": "شحن مجاني - التوصيل خلال 2-4 أيام عمل",
        "privacyText": "معلوماتك محمية ولن نشاركها مع أي جهة خارجية"
      },
      "style": {
        "background": "#ffffff",
        "padding": {
          "top": 80,
          "bottom": 80
        }
      }
    },
    {
      "id": "footer_001",
      "type": "FOOTER",
      "locked": false,
      "visible": true,
      "order": 9,
      "variant": "footer-simple",
      "data": {
        "businessName": "متجر الجمال الألماني",
        "phone": "+966500000000",
        "email": "info@example.com",
        "whatsapp": "+966500000000",
        "socialLinks": {
          "instagram": "https://instagram.com/example",
          "snapchat": "https://snapchat.com/add/example"
        },
        "copyright": "© 2024 جميع الحقوق محفوظة",
        "links": [
          {
            "text": "سياسة الخصوصية",
            "url": "/privacy"
          },
          {
            "text": "شروط الاستخدام",
            "url": "/terms"
          },
          {
            "text": "سياسة الاسترجاع",
            "url": "/refund"
          }
        ]
      },
      "style": {
        "background": "#1f2937",
        "padding": {
          "top": 40,
          "bottom": 40
        }
      }
    }
  ]
}
```

---

## 5️⃣ BACKEND API DESIGN (Nest.js)

### 5.1 Project Structure

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── workspace.decorator.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── workspace.guard.ts
│   │   ├── interceptors/
│   │   │   └── tenant.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── strategies/
│   │   │       ├── jwt.strategy.ts
│   │   │       └── google.strategy.ts
│   │   │
│   │   ├── workspace/
│   │   │   ├── workspace.module.ts
│   │   │   ├── workspace.controller.ts
│   │   │   └── workspace.service.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── ai.module.ts
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── engines/
│   │   │   │   ├── copywriting.engine.ts
│   │   │   │   ├── layout.engine.ts
│   │   │   │   └── offer.engine.ts
│   │   │   └── queue/
│   │   │       ├── ai-generation.queue.ts
│   │   │       └── ai-generation.worker.ts
│   │   │
│   │   ├── page/
│   │   │   ├── page.module.ts
│   │   │   ├── page.controller.ts
│   │   │   ├── page.service.ts
│   │   │   └── dto/
│   │   │       ├── create-page.dto.ts
│   │   │       └── update-page.dto.ts
│   │   │
│   │   ├── order/
│   │   │   ├── order.module.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   └── dto/
│   │   │       └── create-order.dto.ts
│   │   │
│   │   ├── lead/
│   │   │   ├── lead.module.ts
│   │   │   ├── lead.controller.ts
│   │   │   └── lead.service.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts
│   │   │   └── analytics.service.ts
│   │   │
│   │   └── webhook/
│   │       ├── webhook.module.ts
│   │       ├── webhook.controller.ts
│   │       └── webhook.service.ts
│   │
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts
│
└── prisma/
    └── schema.prisma
```

### 5.2 API Endpoints

#### Authentication APIs

**POST /api/auth/register**
```typescript
// Request
{
  "email": "merchant@example.com",
  "password": "SecurePass123!",
  "name": "أحمد محمد",
  "workspaceName": "متجر الجمال"
}

// Response 201
{
  "user": {
    "id": "usr_123",
    "email": "merchant@example.com",
    "name": "أحمد محمد"
  },
  "workspace": {
    "id": "ws_123",
    "name": "متجر الجمال",
    "slug": "متجر-الجمال-ws123"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**POST /api/auth/login**
```typescript
// Request
{
  "email": "merchant@example.com",
  "password": "SecurePass123!"
}

// Response 200
{
  "user": { ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**POST /api/auth/google**
```typescript
// Request
{
  "token": "google_oauth_token"
}

// Response 200 (same as login)
```

#### AI Generation APIs

**POST /api/ai/generate-page**
```typescript
// Request
Authorization: Bearer {accessToken}
X-Workspace-Id: ws_123

{
  "productName": "كريم الكولاجين الألماني",
  "productDescription": "كريم طبيعي يشد البشرة ويزيل التجاعيد",
  "targetAudience": "سيدات 30-50 سنة",
  "price": 299,
  "currency": "SAR",
  "mainBenefit": "بشرة شابة خالية من التجاعيد",
  "specialOffer": "خصم 50% + شحن مجاني",
  "pageType": "PRODUCT",
  "contactMethod": "WHATSAPP",
  "whatsappNumber": "+966500000000",
  "needsOrderForm": true,
  "hasImages": false,
  "productComplexity": "SIMPLE"
}

// Response 202 Accepted
{
  "jobId": "job_abc123",
  "status": "PROCESSING",
  "estimatedTime": 15000, // ms
  "message": "جاري إنشاء صفحتك..."
}
```

**GET /api/ai/generation-status/:jobId**
```typescript
// Response 200
{
  "jobId": "job_abc123",
  "status": "COMPLETED", // PENDING | PROCESSING | COMPLETED | FAILED
  "progress": 100,
  "result": {
    "pageId": "page_xyz789"
  }
}

// Response 200 (if still processing)
{
  "jobId": "job_abc123",
  "status": "PROCESSING",
  "progress": 60
}
```

#### Page APIs

**GET /api/pages**
```typescript
// Request
Authorization: Bearer {accessToken}
X-Workspace-Id: ws_123
?status=PUBLISHED&page=1&limit=20

// Response 200
{
  "data": [
    {
      "id": "page_123",
      "title": "كريم الكولاجين",
      "slug": "كريم-الكولاجين",
      "status": "PUBLISHED",
      "type": "PRODUCT",
      "views": 1250,
      "conversions": 43,
      "conversionRate": 3.44,
      "publishedAt": "2024-01-15T10:00:00Z",
      "url": "https://ws-slug.convertar.com/كريم-الكولاجين"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

**GET /api/pages/:id**
```typescript
// Response 200
{
  "id": "page_123",
  "title": "كريم الكولاجين",
  "slug": "كريم-الكولاجين",
  "status": "PUBLISHED",
  "type": "PRODUCT",
  "schema": { /* Full JSON schema */ },
  "metaTitle": "...",
  "metaDescription": "...",
  "views": 1250,
  "conversions": 43,
  "createdAt": "2024-01-15T09:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "publishedAt": "2024-01-15T10:00:00Z"
}
```

**PATCH /api/pages/:id**
```typescript
// Request
{
  "title": "كريم الكولاجين المطور",
  "schema": { /* Updated schema */ }
}

// Response 200
{
  "id": "page_123",
  "title": "كريم الكولاجين المطور",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

**POST /api/pages/:id/publish**
```typescript
// Response 200
{
  "id": "page_123",
  "status": "PUBLISHED",
  "publishedAt": "2024-01-15T11:30:00Z",
  "url": "https://ws-slug.convertar.com/كريم-الكولاجين"
}
```

**POST /api/pages/:id/duplicate**
```typescript
// Response 201
{
  "id": "page_456",
  "title": "كريم الكولاجين (نسخة)",
  "status": "DRAFT"
}
```

**DELETE /api/pages/:id**
```typescript
// Response 204 No Content
```

#### Order APIs

**POST /api/public/orders** (Public - No Auth)
```typescript
// Request
{
  "pageId": "page_123",
  "customerName": "نورة أحمد",
  "customerPhone": "0501234567",
  "customerEmail": "noura@example.com",
  "customerAddress": "الرياض، حي النرجس، شارع التخصصي",
  "customerCity": "الرياض",
  "customerNotes": "يفضل التوصيل مساءً",
  "items": [
    {
      "product": "كريم الكولاجين",
      "quantity": 2,
      "price": 299
    }
  ],
  "subtotal": 598,
  "shipping": 0,
  "total": 598,
  "source": "facebook"
}

// Response 201
{
  "id": "order_789",
  "orderNumber": "ORD-20240115-001",
  "status": "NEW",
  "total": 598,
  "createdAt": "2024-01-15T12:00:00Z",
  "message": "تم استلام طلبك بنجاح. سنتواصل معك خلال دقائق."
}
```

**GET /api/orders**
```typescript
// Request
Authorization: Bearer {accessToken}
X-Workspace-Id: ws_123
?status=NEW&page=1&limit=20&sort=createdAt:desc

// Response 200
{
  "data": [
    {
      "id": "order_789",
      "orderNumber": "ORD-20240115-001",
      "customerName": "نورة أحمد",
      "customerPhone": "0501234567",
      "customerCity": "الرياض",
      "total": 598,
      "status": "NEW",
      "createdAt": "2024-01-15T12:00:00Z",
      "page": {
        "id": "page_123",
        "title": "كريم الكولاجين"
      }
    }
  ],
  "meta": {
    "total": 156,
    "page": 1,
    "limit": 20
  }
}
```

**GET /api/orders/:id**
```typescript
// Response 200
{
  "id": "order_789",
  "orderNumber": "ORD-20240115-001",
  "customerName": "نورة أحمد",
  "customerPhone": "0501234567",
  "customerEmail": "noura@example.com",
  "customerAddress": "الرياض، حي النرجس، شارع التخصصي",
  "customerCity": "الرياض",
  "customerNotes": "يفضل التوصيل مساءً",
  "items": [
    {
      "product": "كريم الكولاجين",
      "quantity": 2,
      "price": 299
    }
  ],
  "subtotal": 598,
  "shipping": 0,
  "total": 598,
  "currency": "SAR",
  "status": "NEW",
  "source": "facebook",
  "createdAt": "2024-01-15T12:00:00Z",
  "page": {
    "id": "page_123",
    "title": "كريم الكولاجين"
  }
}
```

**PATCH /api/orders/:id/status**
```typescript
// Request
{
  "status": "CONFIRMED"
}

// Response 200
{
  "id": "order_789",
  "status": "CONFIRMED",
  "updatedAt": "2024-01-15T13:00:00Z"
}
```

**GET /api/orders/export**
```typescript
// Response 200
Content-Type: text/csv
Content-Disposition: attachment; filename="orders-2024-01-15.csv"

[CSV file with all orders]
```

#### Analytics APIs

**GET /api/analytics/overview**
```typescript
// Request
Authorization: Bearer {accessToken}
X-Workspace-Id: ws_123
?period=30d // 7d, 30d, 90d, custom

// Response 200
{
  "period": {
    "start": "2023-12-16T00:00:00Z",
    "end": "2024-01-15T23:59:59Z"
  },
  "metrics": {
    "totalViews": 12580,
    "totalOrders": 342,
    "totalRevenue": 102300,
    "conversionRate": 2.72,
    "averageOrderValue": 299
  },
  "comparison": {
    // Compare to previous period
    "views": {
      "current": 12580,
      "previous": 10234,
      "change": 22.9
    },
    "orders": {
      "current": 342,
      "previous": 298,
      "change": 14.8
    }
  },
  "chart": {
    "labels": ["2023-12-16", "2023-12-17", ...],
    "views": [420, 385, ...],
    "orders": [11, 9, ...]
  }
}
```

**GET /api/analytics/pages/:pageId**
```typescript
// Response 200
{
  "pageId": "page_123",
  "title": "كريم الكولاجين",
  "metrics": {
    "views": 1250,
    "orders": 43,
    "revenue": 12757,
    "conversionRate": 3.44
  },
  "sources": [
    {
      "source": "facebook",
      "views": 650,
      "orders": 25,
      "conversionRate": 3.85
    },
    {
      "source": "instagram",
      "views": 400,
      "orders": 12,
      "conversionRate": 3.0
    },
    {
      "source": "direct",
      "views": 200,
      "orders": 6,
      "conversionRate": 3.0
    }
  ],
  "topCities": [
    { "city": "الرياض", "orders": 18 },
    { "city": "جدة", "orders": 12 },
    { "city": "الدمام", "orders": 7 }
  ]
}
```

#### Webhook APIs

**GET /api/webhooks**
```typescript
// Response 200
{
  "data": [
    {
      "id": "webhook_1",
      "url": "https://example.com/webhook",
      "events": ["order.created", "order.confirmed"],
      "active": true,
      "secret": "whsec_abc123...",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

**POST /api/webhooks**
```typescript
// Request
{
  "url": "https://example.com/webhook",
  "events": ["order.created", "order.confirmed"]
}

// Response 201
{
  "id": "webhook_1",
  "url": "https://example.com/webhook",
  "events": ["order.created", "order.confirmed"],
  "active": true,
  "secret": "whsec_abc123..."
}
```

**DELETE /api/webhooks/:id**
```typescript
// Response 204
```

### 5.3 Rate Limiting Strategy

```typescript
// rate-limit.config.ts
import { ThrottlerModule } from '@nestjs/throttler';

export const rateLimitConfig = ThrottlerModule.forRoot({
  ttl: 60,
  limit: 100, // 100 requests per minute per IP
});

// Custom limits for specific endpoints
export const AI_GENERATION_LIMIT = {
  ttl: 3600, // 1 hour
  limit: 50,  // 50 generations per hour per workspace
};

export const PUBLIC_ORDER_LIMIT = {
  ttl: 60,
  limit: 10, // 10 orders per minute per IP (prevent spam)
};
```

---

## 6️⃣ FRONTEND ARCHITECTURE (Next.js)

### 6.1 Folder Structure (App Router)

```
frontend/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page (marketing)
│   ├── globals.css
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx                # Auth layout (centered)
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Dashboard layout (sidebar + header)
│   │   ├── page.tsx                  # Dashboard home (redirect to pages)
│   │   │
│   │   ├── pages/
│   │   │   ├── page.tsx              # Pages list
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # AI questionnaire
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # Page editor
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx      # Page settings
│   │   │
│   │   ├── orders/
│   │   │   ├── page.tsx              # Orders list
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Order details
│   │   │
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   │
│   │   └── settings/
│   │       ├── page.tsx              # Workspace settings
│   │       ├── billing/
│   │       │   └── page.tsx
│   │       └── team/
│   │           └── page.tsx
│   │
│   └── [workspace]/                  # Public page renderer
│       └── [slug]/
│           └── page.tsx              # Render published page
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── pages/
│   │   ├── PagesList.tsx
│   │   ├── PageCard.tsx
│   │   └── PageStats.tsx
│   │
│   ├── editor/
│   │   ├── PageEditor.tsx
│   │   ├── SectionList.tsx
│   │   ├── SectionEditor.tsx
│   │   ├── PreviewFrame.tsx
│   │   └── PropertyPanel.tsx
│   │
│   ├── renderer/                     # JSON → React
│   │   ├── PageRenderer.tsx
│   │   ├── SectionRenderer.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── BenefitsSection.tsx
│   │       ├── OfferSection.tsx
│   │       ├── FAQSection.tsx
│   │       ├── OrderFormSection.tsx
│   │       └── ...
│   │
│   ├── questionnaire/
│   │   ├── AIQuestionnaire.tsx
│   │   ├── QuestionStep.tsx
│   │   └── GenerationProgress.tsx
│   │
│   └── orders/
│       ├── OrdersList.tsx
│       ├── OrderCard.tsx
│       └── OrderDetails.tsx
│
├── lib/
│   ├── api/                          # API client
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── pages.ts
│   │   ├── orders.ts
│   │   └── analytics.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useWorkspace.ts
│   │   ├── usePages.ts
│   │   └── useOrders.ts
│   │
│   ├── store/                        # Zustand stores
│   │   ├── authStore.ts
│   │   ├── editorStore.ts
│   │   └── workspaceStore.ts
│   │
│   └── utils/
│       ├── cn.ts                     # Tailwind class merger
│       ├── validators.ts
│       └── formatters.ts
│
├── types/
│   ├── page-schema.ts
│   ├── api.ts
│   └── models.ts
│
└── public/
    ├── images/
    └── icons/
```

### 6.2 JSON Render Engine

**Core Renderer Component:**

```typescript
// components/renderer/PageRenderer.tsx
'use client';

import { PageSchema } from '@/types/page-schema';
import { SectionRenderer } from './SectionRenderer';

interface PageRendererProps {
  schema: PageSchema;
  mode?: 'preview' | 'public';
}

export function PageRenderer({ schema, mode = 'public' }: PageRendererProps) {
  const { metadata, theme, sections } = schema;

  return (
    <div
      className="min-h-screen"
      style={{
        direction: metadata.direction,
        fontFamily: theme.fonts.body,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
      dir={metadata.direction}
    >
      {sections
        .filter((section) => section.visible)
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            theme={theme}
            mode={mode}
          />
        ))}
    </div>
  );
}
```

**Section Renderer:**

```typescript
// components/renderer/SectionRenderer.tsx
import { Section, PageTheme } from '@/types/page-schema';
import { HeroSection } from './sections/HeroSection';
import { BenefitsSection } from './sections/BenefitsSection';
import { OfferSection } from './sections/OfferSection';
import { FAQSection } from './sections/FAQSection';
import { OrderFormSection } from './sections/OrderFormSection';
// ... import all section types

interface SectionRendererProps {
  section: Section;
  theme: PageTheme;
  mode: 'preview' | 'public';
}

export function SectionRenderer({ section, theme, mode }: SectionRendererProps) {
  const SectionComponent = getSectionComponent(section.type);

  if (!SectionComponent) {
    console.warn(`Unknown section type: ${section.type}`);
    return null;
  }

  return (
    <section
      id={section.id}
      style={{
        backgroundColor: section.style?.background || 'transparent',
        paddingTop: `${section.style?.padding?.top || 0}px`,
        paddingBottom: `${section.style?.padding?.bottom || 0}px`,
      }}
    >
      <SectionComponent data={section.data} theme={theme} mode={mode} />
    </section>
  );
}

function getSectionComponent(type: string) {
  const components = {
    HERO: HeroSection,
    BENEFITS: BenefitsSection,
    OFFER: OfferSection,
    FAQ: FAQSection,
    ORDER_FORM: OrderFormSection,
    SOCIAL_PROOF: SocialProofSection,
    TESTIMONIALS: TestimonialsSection,
    GUARANTEE: GuaranteeSection,
    FOOTER: FooterSection,
  };

  return components[type];
}
```

**Example Section Component:**

```typescript
// components/renderer/sections/HeroSection.tsx
import { HeroSectionData, PageTheme } from '@/types/page-schema';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  data: HeroSectionData;
  theme: PageTheme;
  mode: 'preview' | 'public';
}

export function HeroSection({ data, theme, mode }: HeroSectionProps) {
  const handleCTA = () => {
    if (data.cta.action.type === 'SCROLL_TO_FORM') {
      document.getElementById('order_form')?.scrollIntoView({ behavior: 'smooth' });
    } else if (data.cta.action.type === 'WHATSAPP') {
      window.open(
        `https://wa.me/${data.cta.action.phone}?text=${encodeURIComponent(data.cta.action.message)}`,
        '_blank'
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div className="order-2 md:order-1">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
          >
            {data.headline}
          </h1>

          <p
            className="text-lg md:text-xl mb-6"
            style={{ color: theme.colors.textLight }}
          >
            {data.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleCTA}
              size="lg"
              className="text-lg"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {data.cta.text}
            </Button>

            {data.secondaryCta && (
              <Button
                variant="outline"
                size="lg"
                className="text-lg"
                onClick={() => {
                  if (data.secondaryCta.action.type === 'WHATSAPP') {
                    window.open(
                      `https://wa.me/${data.secondaryCta.action.phone}`,
                      '_blank'
                    );
                  }
                }}
              >
                {data.secondaryCta.text}
              </Button>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="order-1 md:order-2">
          {data.image && (
            <img
              src={data.image}
              alt={data.headline}
              className="w-full h-auto rounded-lg shadow-xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

### 6.3 Builder UI Logic

**Page Editor Layout:**

```typescript
// app/(dashboard)/pages/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageEditor } from '@/components/editor/PageEditor';
import { usePage } from '@/lib/hooks/usePages';

export default function PageEditorPage() {
  const params = useParams();
  const { page, isLoading, updatePage } = usePage(params.id as string);

  if (isLoading) return <div>Loading...</div>;
  if (!page) return <div>Page not found</div>;

  return (
    <PageEditor
      page={page}
      onSave={(updatedSchema) => updatePage({ schema: updatedSchema })}
    />
  );
}
```

**Editor Component:**

```typescript
// components/editor/PageEditor.tsx
'use client';

import { useState } from 'react';
import { Page, PageSchema } from '@/types/page-schema';
import { SectionList } from './SectionList';
import { PreviewFrame } from './PreviewFrame';
import { PropertyPanel } from './PropertyPanel';
import { Button } from '@/components/ui/button';

interface PageEditorProps {
  page: Page;
  onSave: (schema: PageSchema) => Promise<void>;
}

export function PageEditor({ page, onSave }: PageEditorProps) {
  const [schema, setSchema] = useState<PageSchema>(page.schema);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(schema);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSection = (sectionId: string, updates: any) => {
    setSchema((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
  };

  const reorderSections = (fromIndex: number, toIndex: number) => {
    const newSections = [...schema.sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);

    setSchema((prev) => ({
      ...prev,
      sections: newSections.map((s, idx) => ({ ...s, order: idx + 1 })),
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Section List */}
      <div className="w-80 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">أقسام الصفحة</h2>
        </div>
        <SectionList
          sections={schema.sections}
          selectedId={selectedSection}
          onSelect={setSelectedSection}
          onReorder={reorderSections}
        />
      </div>

      {/* Center - Preview */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10">
          <h1 className="font-bold">{page.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline">معاينة</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </div>
        <PreviewFrame schema={schema} selectedSection={selectedSection} />
      </div>

      {/* Right Sidebar - Properties */}
      {selectedSection && (
        <div className="w-80 border-l overflow-y-auto">
          <PropertyPanel
            section={schema.sections.find((s) => s.id === selectedSection)!}
            onUpdate={(updates) => updateSection(selectedSection, updates)}
          />
        </div>
      )}
    </div>
  );
}
```

**Drag & Drop System:**

```typescript
// components/editor/SectionList.tsx
'use client';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Section } from '@/types/page-schema';
import { Lock, GripVertical } from 'lucide-react';

interface SectionListProps {
  sections: Section[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function SectionList({ sections, selectedId, onSelect, onReorder }: SectionListProps) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="p-2">
            {sections.map((section, index) => (
              <Draggable
                key={section.id}
                draggableId={section.id}
                index={index}
                isDragDisabled={section.locked}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`
                      p-3 mb-2 rounded border cursor-pointer
                      ${selectedId === section.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                      ${section.locked ? 'bg-yellow-50' : 'bg-white'}
                    `}
                    onClick={() => onSelect(section.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div {...provided.dragHandleProps}>
                        {section.locked ? (
                          <Lock className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{getSectionLabel(section.type)}</div>
                        {section.locked && (
                          <div className="text-xs text-yellow-600">قسم محمي من الذكاء الاصطناعي</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

function getSectionLabel(type: string): string {
  const labels = {
    HERO: 'القسم الرئيسي',
    BENEFITS: 'الفوائد',
    OFFER: 'العرض',
    FAQ: 'الأسئلة الشائعة',
    ORDER_FORM: 'نموذج الطلب',
    // ...
  };
  return labels[type] || type;
}
```

### 6.4 Mobile-First Enforcement

All sections are designed mobile-first with Tailwind responsive classes:

```typescript
// Always start with mobile styles, then add md: and lg: breakpoints
<div className="px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
  <h1 className="text-3xl md:text-4xl lg:text-5xl">...</h1>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    ...
  </div>
</div>
```

Preview frame defaults to mobile view with toggle:

```typescript
const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

<div className={previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}>
  <PageRenderer schema={schema} mode="preview" />
</div>
```

---

## 7️⃣ MVP DEFINITION

### 7.1 MVP Scope (Launch in 6-8 weeks)

**✅ INCLUDED IN MVP:**

**Authentication:**
- Email/password registration and login
- Google OAuth
- Email verification
- Password reset

**Workspace:**
- Single workspace per user
- Basic workspace settings (name, logo)

**AI Generation:**
- Complete questionnaire (8-10 questions)
- 3 AI engines (Copywriting, Layout, Offer)
- Generate PRODUCT pages only (not SERVICE or LEAD_GEN yet)
- Arabic language only
- 100 free generations, then paid

**Page Editor:**
- Visual preview (mobile + desktop)
- Inline text editing
- Section reordering (drag & drop)
- Image upload (sections that support it)
- Basic color customization
- Locked AI sections (can't delete)
- Publish/unpublish

**Public Pages:**
- Subdomain routing: `{slug}.convertar.com`
- Fully responsive rendering
- Order form submission
- WhatsApp CTA integration

**Orders:**
- Public order form (no auth)
- Order list in dashboard
- Order details view
- Update order status (NEW, CONFIRMED, etc.)
- Export to CSV
- Email notification on new order

**Analytics:**
- Page views tracking
- Orders count
- Basic conversion rate
- Last 30 days chart

**Plans & Billing:**
- Free plan: 3 pages, 100 generations/month
- Starter plan: $29/month, 20 pages, 1000 generations
- Stripe integration for subscriptions
- Basic usage tracking

---

**❌ POSTPONED (Post-MVP):**

- Multiple workspaces per user
- Team members & permissions
- Custom domains
- SERVICE and LEAD_GEN page types
- Multi-language (English support)
- Advanced analytics (sources, heatmaps)
- A/B testing
- Webhook integrations
- API access
- WhatsApp automation (send confirmations)
- SMS notifications
- Advanced AI: regenerate specific sections
- Template marketplace
- Video sections
- Payment gateway integration (online payments)
- Inventory management
- Mobile app

### 7.2 Free vs Paid Limits

| Feature | Free | Starter ($29/mo) | Pro ($79/mo) |
|---------|------|------------------|--------------|
| Workspaces | 1 | 1 | 3 |
| Pages | 3 | 20 | Unlimited |
| AI Generations/month | 100 | 1000 | 5000 |
| Orders/month | 100 | 1000 | Unlimited |
| Custom domain | ❌ | ❌ | ✅ |
| Remove branding | ❌ | ❌ | ✅ |
| WhatsApp automation | ❌ | ❌ | ✅ |
| Advanced analytics | ❌ | ❌ | ✅ |
| Priority support | ❌ | ❌ | ✅ |

---

## 8️⃣ SCALABILITY & COST CONTROL

### 8.1 AI Usage Limits

**Rate Limiting:**
```typescript
// Per workspace limits
- Free: 100 generations/month, max 5/hour
- Starter: 1000 generations/month, max 20/hour
- Pro: 5000 generations/month, max 50/hour

// Implementation
@UseGuards(AiUsageLimitGuard)
@Post('generate-page')
async generatePage(@CurrentWorkspace() workspace) {
  // Guard checks:
  // 1. Monthly quota not exceeded
  // 2. Hourly rate limit not exceeded
  // 3. Workspace subscription active
}
```

**Cost Control:**
- Use GPT-4-mini for copywriting (cheaper, faster)
- Cache common prompts in Redis (15 min TTL)
- Batch process during off-peak hours
- Monitor token usage per workspace

**Fallback Strategy:**
- If OpenAI API fails: Use template-based generation
- If quota exceeded: Suggest upgrade or wait until next month
- Store failed generations for retry

### 8.2 Background Jobs (BullMQ)

**Queue Architecture:**

```typescript
// Queues:
1. ai-generation (high priority)
2. email-notifications (medium priority)
3. analytics-aggregation (low priority)
4. export-orders (low priority)

// Workers:
- ai-worker: 10 concurrent jobs
- email-worker: 5 concurrent jobs
- analytics-worker: 2 concurrent jobs (runs hourly)

// Redis Configuration
const redisConfig = {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  maxMemory: '512mb',
  maxMemoryPolicy: 'allkeys-lru',
};
```

**Job Priorities:**
```typescript
// High priority: User-facing actions
aiGenerationQueue.add('generate', data, { priority: 1 });

// Medium: Notifications
emailQueue.add('send', data, { priority: 5 });

// Low: Background tasks
analyticsQueue.add('aggregate', data, { priority: 10 });
```

### 8.3 Abuse Prevention

**1. Rate Limiting (Express Rate Limit + Redis)**
```typescript
// Global limit
app.use(rateLimit({
  store: new RedisStore({ client: redis }),
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per 15 min per IP
}));

// AI endpoint stricter
aiRouter.use(rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 per hour per IP
}));
```

**2. CAPTCHA on Public Forms**
- Use Cloudflare Turnstile (free, privacy-friendly)
- Enabled on order form submission
- Prevents bot spam

**3. Email Verification**
- Users must verify email before using AI generation
- Prevents throwaway email abuse

**4. Credit Card Requirement for Higher Plans**
- Free plan: No card required
- Paid plans: Card on file (prevents abuse)

**5. Monitoring & Alerts**
- Alert if workspace exceeds 2x normal usage
- Auto-suspend suspicious accounts
- Manual review queue

### 8.4 Horizontal Scaling

**Architecture:**

```
┌─────────────────────────────────────────────┐
│         Load Balancer (Nginx / AWS ALB)      │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
   ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
   │ NestJS  │ │ NestJS  │ │ NestJS  │
   │ Instance│ │ Instance│ │ Instance│
   │    1    │ │    2    │ │    3    │
   └────┬────┘ └────┬────┘ └────┬────┘
        │           │           │
        └───────────┼───────────┘
                    │
        ┌───────────▼───────────┐
        │   PostgreSQL (Primary)│
        │   + Read Replicas     │
        └───────────┬───────────┘
                    │
        ┌───────────▼───────────┐
        │   Redis Cluster       │
        └───────────────────────┘
```

**Stateless API Servers:**
- No session storage in memory
- JWT tokens (no server-side sessions)
- All state in PostgreSQL or Redis

**Database:**
- PostgreSQL primary + 2 read replicas
- Write to primary, read from replicas
- Connection pooling (PgBouncer)

**CDN for Static Assets:**
- Next.js static files on Vercel/CloudFlare
- Uploaded images on CloudFlare R2 or AWS S3 + CloudFront

**Caching Strategy:**
```typescript
// Redis cache layers:
1. Published pages (TTL: 5 min) - Reduce DB load
2. Analytics aggregates (TTL: 1 hour)
3. User sessions (TTL: 7 days)
4. AI prompt responses (TTL: 15 min)
```

---

## 9️⃣ COMPETITIVE DIFFERENTIATION

### Why ConvertAR Beats Competitors in Arabic Market

**vs EasyOrder:**

| Feature | EasyOrder | ConvertAR |
|---------|-----------|-----------|
| AI Content Generation | ❌ Manual | ✅ Full AI copywriting |
| Page Structure | ❌ Fixed template | ✅ AI-optimized layout |
| Arabic Optimization | ⚠️ Basic RTL | ✅ Native Arabic, COD-focused |
| Pricing | ~$20/mo | $29/mo (better value) |
| Speed to Launch | ~30 min | **< 2 minutes** |
| Conversion Focus | ⚠️ Generic | ✅ Built for COD sales |

**Advantage:**
- **10x faster** to create a high-converting page
- AI writes better sales copy than most merchants
- Optimized for Arabic psychology (urgency, social proof, guarantees)

---

**vs Shopify:**

| Feature | Shopify | ConvertAR |
|---------|---------|-----------|
| Setup Complexity | ⚠️ High (products, shipping, payments) | ✅ Simple questionnaire |
| Arabic Support | ⚠️ Translation plugins | ✅ Native Arabic AI |
| COD Focus | ⚠️ Generic | ✅ Built for COD |
| Price | $39/mo + apps | $29/mo all-in |
| Use Case | Full e-commerce | **Single-product landing pages** |

**Advantage:**
- **Not competing with Shopify** - different use case
- Shopify for catalogs, ConvertAR for single-product campaigns
- Faster, cheaper, easier for small merchants
- AI does the marketing work (Shopify doesn't)

---

**vs Webflow:**

| Feature | Webflow | ConvertAR |
|---------|---------|-----------|
| Target User | Designers, agencies | **Non-technical merchants** |
| Arabic | ⚠️ Manual RTL | ✅ Native |
| AI | ❌ None | ✅ Full AI generation |
| Learning Curve | ⚠️ Steep | ✅ Zero (questionnaire) |
| Conversion Focus | ❌ Design-focused | ✅ Sales-focused |

**Advantage:**
- **Not a page builder** - it's an AI conversion platform
- Merchants don't want design tools, they want sales
- AI removes creative burden
- Purpose-built for Arabic COD market

---

### Core Differentiation (Unique Value Props)

1. **AI-First, Not Template-First**
   - Competitors: Pick a template → Fill it
   - ConvertAR: Answer questions → AI creates custom page

2. **Conversion-Optimized for Arabic Market**
   - Deep understanding of Arabic buyer psychology
   - COD-specific features (urgency, guarantees, trust)
   - Social proof emphasis

3. **2-Minute Launch**
   - Fastest time-to-market in the industry
   - No design skills needed
   - No content writing needed

4. **Built for Small Merchants**
   - Not for enterprises
   - Not for designers
   - For solo sellers, small businesses, COD merchants

5. **Single-Product Focus**
   - Not trying to be a full e-commerce platform
   - Perfect for Facebook/Instagram campaign landing pages
   - Optimized for one goal: conversion

---

## 🎯 NEXT STEPS

This architecture is ready for implementation. Here's the recommended build order:

**Phase 1 (Weeks 1-2): Foundation**
1. Set up Nest.js backend + Prisma + PostgreSQL
2. Set up Next.js frontend + Tailwind + shadcn/ui
3. Implement authentication (email + Google)
4. Basic workspace setup

**Phase 2 (Weeks 3-4): AI Core**
1. Implement 3 AI engines
2. Set up BullMQ + Redis
3. Build questionnaire UI
4. Test AI generation pipeline

**Phase 3 (Weeks 5-6): Editor & Renderer**
1. Build JSON renderer for all section types
2. Build page editor with drag & drop
3. Implement inline editing
4. Public page routing

**Phase 4 (Weeks 7-8): Orders & Launch**
1. Order form + submission
2. Orders dashboard
3. Email notifications
4. Analytics basics
5. Stripe billing integration
6. Final testing + deploy

---

**Would you like me to start implementing any specific part of this architecture?**

Options:
1. Start with Prisma schema + migrations
2. Build AI engines with actual prompts
3. Create the JSON renderer components
4. Set up the complete Nest.js backend structure
5. Build the Next.js frontend folder structure

Let me know which part to begin with, and I'll write production-ready code.
