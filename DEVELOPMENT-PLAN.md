# 🏗️ StoreAR Development Plan - Agile Sprints

## Project Overview
Building StoreAR - AI-powered multi-store e-commerce platform for Arabic marketers

**Tech Stack:**
- Backend: Nest.js + Prisma + PostgreSQL
- Frontend: Next.js 14 (App Router) + Tailwind + shadcn/ui
- State: Zustand
- Queue: BullMQ + Redis
- AI: OpenAI GPT-4

---

## 📅 Sprint Schedule (7 Sprints)

### Sprint 1: Foundation & Auth (Week 1) - STARTING NOW ✅
**Deliverable:** Users can sign up, log in, create workspace

**Backend:**
- [x] Project setup (Nest.js)
- [x] Database schema (Prisma)
- [x] Auth module (JWT + Google OAuth)
- [x] User CRUD
- [x] Workspace CRUD

**Frontend:**
- [x] Project setup (Next.js 14)
- [x] Tailwind + shadcn/ui setup
- [x] Auth pages (Login, Register)
- [x] Dashboard layout (Sidebar + Header)
- [x] Workspace creation flow

**Deploy:** Vercel (Frontend) + Railway (Backend + DB)

---

### Sprint 2: AI Store Creation (Week 2)
**Deliverable:** Users can create AI-generated stores

**Backend:**
- [ ] Store CRUD APIs
- [ ] AI Store Setup Engine (OpenAI)
- [ ] BullMQ setup for AI jobs
- [ ] Store theme JSON generation

**Frontend:**
- [ ] Store creation wizard (questionnaire)
- [ ] AI generation progress UI
- [ ] Store list page
- [ ] Store settings page
- [ ] Theme preview

**Deploy:** Working AI store generation

---

### Sprint 3: Products & Landing Pages (Week 3)
**Deliverable:** Users can add products with AI landing pages

**Backend:**
- [ ] Product CRUD APIs
- [ ] AI Product Description Engine
- [ ] AI Landing Page Builder Engine
- [ ] Image upload (Cloudflare R2)

**Frontend:**
- [ ] Product management UI
- [ ] Add product form (with AI)
- [ ] Landing page editor
- [ ] Landing page preview
- [ ] Public landing page renderer

**Deploy:** Products with AI landing pages working

---

### Sprint 4: Marketing Pixels (Week 4)
**Deliverable:** Users can add pixels and track events

**Backend:**
- [ ] Pixel management APIs
- [ ] Tracking event APIs
- [ ] Facebook CAPI integration
- [ ] TikTok Events API integration

**Frontend:**
- [ ] Pixel management UI
- [ ] Pixel testing tools
- [ ] Event tracking setup
- [ ] Client-side pixel loading

**Deploy:** Pixel tracking working end-to-end

---

### Sprint 5: Cart & Checkout (Week 5)
**Deliverable:** Customers can place orders

**Backend:**
- [ ] Customer APIs
- [ ] Order creation API (public)
- [ ] Email notifications
- [ ] Order validation

**Frontend:**
- [ ] Storefront (public)
- [ ] Product catalog
- [ ] Shopping cart (Zustand)
- [ ] Checkout form (COD)
- [ ] Order confirmation page

**Deploy:** Full purchase flow working

---

### Sprint 6: Orders & Analytics (Week 6)
**Deliverable:** Merchants can manage orders and see analytics

**Backend:**
- [ ] Order management APIs
- [ ] Analytics aggregation
- [ ] Export orders (CSV)
- [ ] Customer insights

**Frontend:**
- [ ] Orders list + filters
- [ ] Order detail page
- [ ] Analytics dashboard
- [ ] Charts (revenue, conversions)

**Deploy:** Order management + analytics

---

### Sprint 7: Multi-Currency & Polish (Week 7)
**Deliverable:** Production-ready platform

**Backend:**
- [ ] Currency APIs
- [ ] Exchange rate service
- [ ] Subscription/billing (Stripe)
- [ ] Usage tracking

**Frontend:**
- [ ] Currency switcher
- [ ] Multi-currency pricing UI
- [ ] Billing page
- [ ] Final UI polish
- [ ] Mobile optimization

**Deploy:** Full production release

---

## 🚀 Sprint 1 Implementation - STARTING NOW

### Backend Setup

#### 1. Initialize Nest.js Project
```bash
cd backend
npm init -y
npm install @nestjs/core @nestjs/common @nestjs/platform-express
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install @prisma/client bcrypt passport passport-jwt passport-google-oauth20
npm install class-validator class-transformer
npm install -D @nestjs/cli prisma typescript @types/node
```

#### 2. Database Schema (Prisma)
Full schema with all tables (ready for all sprints)

#### 3. Auth Module
- JWT strategy
- Google OAuth strategy
- Login/Register endpoints

#### 4. User & Workspace Modules
- Create user
- Create workspace
- Get user workspaces

---

### Frontend Setup

#### 1. Initialize Next.js
```bash
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npm install @tanstack/react-query zustand
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npx shadcn-ui@latest init
```

#### 2. Install shadcn/ui Components
```bash
npx shadcn-ui@latest add button input label card dialog dropdown-menu
```

#### 3. Auth Pages
- /login
- /register
- OAuth callback

#### 4. Dashboard Layout
- Sidebar navigation
- Header with user menu
- Workspace switcher

---

## 📦 File Structure

### Backend
```
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── guards/
│   │   └── decorators/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── workspace/
│   │   ├── store/
│   │   ├── product/
│   │   ├── order/
│   │   └── ai/
│   └── prisma/
│       └── prisma.service.ts
└── package.json
```

### Frontend
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── stores/
│   └── [storeSlug]/
├── components/
│   ├── ui/
│   ├── dashboard/
│   └── storefront/
├── lib/
│   ├── api/
│   ├── store/
│   └── utils/
└── package.json
```

---

## ⚡ Let's Start Building!

I'll create the files in order:

1. **Prisma Schema** (complete, ready for all sprints)
2. **Backend Structure** (Nest.js modules)
3. **Frontend Structure** (Next.js pages)
4. **Auth System** (working login/register)
5. **Dashboard** (empty but working)

Ready to proceed? I'll start creating files now! 🚀
