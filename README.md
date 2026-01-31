# 🚀 StoreAR - AI-Powered Multi-Store E-Commerce Platform

**The complete SaaS platform for Arabic marketers to create AI-generated online stores with product landing pages and marketing pixel integration.**

---

## 📋 Project Status

### Sprint 1: Foundation & Auth ✅ COMPLETE
- [x] Database schema (Prisma) - Complete (20+ tables)
- [x] Backend setup (Nest.js) - Complete
- [x] Auth module - Complete (Email/Password + Google OAuth)
- [x] Frontend setup (Next.js 14) - Complete
- [x] Dashboard layout - Complete
- [x] Full authentication flow - Complete

### Upcoming Sprints
- Sprint 2: AI Store Creation
- Sprint 3: Products & Landing Pages
- Sprint 4: Marketing Pixels
- Sprint 5: Cart & Checkout
- Sprint 6: Orders & Analytics
- Sprint 7: Multi-Currency & Launch

---

## 🏗️ Tech Stack

### Backend
- **Framework:** Nest.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Queue:** BullMQ + Redis
- **AI:** OpenAI GPT-4
- **Auth:** JWT + Passport (Google OAuth)

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **API:** React Query (TanStack Query)

### Infrastructure
- **Hosting:** Vercel (Frontend) + Railway (Backend)
- **Database:** Railway PostgreSQL
- **Redis:** Railway Redis
- **Storage:** Cloudflare R2
- **CDN:** Cloudflare

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Redis instance
- OpenAI API key

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with default data
npm run prisma:seed

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3001`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with API URL

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 📁 Project Structure

```
saas/
├── backend/               # Nest.js Backend
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   ├── common/       # Shared code
│   │   └── main.ts       # Entry point
│   └── package.json
│
├── frontend/              # Next.js Frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   └── package.json
│
├── ARCHITECTURE-FINAL.md  # Complete architecture
├── CURRENCY-FEATURE.md    # Currency feature docs
├── DEVELOPMENT-PLAN.md    # Agile sprint plan
└── README.md             # This file
```

---

## 📖 Documentation

- [**Complete Architecture**](ARCHITECTURE-FINAL.md) - Full platform architecture with all features
- [**Currency Feature**](CURRENCY-FEATURE.md) - Multi-currency system documentation
- [**Development Plan**](DEVELOPMENT-PLAN.md) - Agile sprint schedule

---

## 🎯 Key Features

### For Merchants
- ✅ Create unlimited stores with AI
- ✅ AI-generated store themes and content
- ✅ AI-powered product descriptions
- ✅ AI landing page builder for each product
- ✅ Multi-currency support (11 currencies)
- ✅ COD & online payments
- ✅ Order management
- ✅ Customer database
- ✅ Analytics dashboard

### For Marketers
- ✅ Marketing pixel integration (Facebook, TikTok, Google, Clarity)
- ✅ Server-side conversion tracking (CAPI)
- ✅ UTM tracking
- ✅ Conversion-optimized product landing pages
- ✅ A/B testing ready
- ✅ Performance analytics

### AI Features
- **Store Setup AI** - Generates complete store theme, pages, and policies
- **Product Description AI** - SEO-optimized product copy
- **Landing Page Builder AI** - High-conversion product landing pages

---

## 🗄️ Database Schema

### Core Tables
- `User` - User accounts
- `Workspace` - Business accounts (multi-tenant)
- `Store` - Online stores
- `Product` - Products with variants
- `Order` - Orders with line items
- `Customer` - Customer database
- `StorePixels` - Marketing pixels
- `TrackingEvent` - Pixel event tracking
- `AiGeneration` - AI generation history
- `ExchangeRate` - Currency exchange rates

See [prisma/schema.prisma](backend/prisma/schema.prisma) for complete schema.

---

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
OPENAI_API_KEY="..."
REDIS_URL="..."
EXCHANGE_RATE_API_KEY="..."
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="..."
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 🚢 Deployment

### Backend (Railway)
```bash
# Railway will auto-detect and deploy
railway up
```

### Frontend (Vercel)
```bash
# Connect GitHub repo to Vercel
# Auto-deploy on push to main
```

---

## 📊 API Documentation

Once backend is running, visit:
- Swagger Docs: `http://localhost:3001/api/docs`
- Health Check: `http://localhost:3001/api/health`

---

## 🛠️ Development Commands

### Backend
```bash
npm run start:dev      # Start development server
npm run prisma:studio  # Open Prisma Studio (DB GUI)
npm run prisma:migrate # Run migrations
npm run lint           # Lint code
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Lint code
```

---

## 🎨 Design System

Frontend uses **shadcn/ui** components built on **Radix UI** and **Tailwind CSS**.

Available components:
- Button, Input, Label
- Card, Dialog, Dropdown Menu
- Select, Checkbox, Radio
- Toast, Alert, Badge
- And more...

---

## 🌍 Multi-Currency

Supports 11 currencies:
- SAR (Saudi Riyal)
- AED (UAE Dirham)
- USD (US Dollar)
- EUR (Euro)
- EGP (Egyptian Pound)
- KWD, BHD, OMR, QAR, JOD, MAD

Features:
- Auto currency detection
- Live exchange rates
- Manual multi-currency pricing
- Currency switcher on storefront

---

## 📱 Marketing Pixels

Integrated pixels:
- Facebook Pixel + Conversion API
- TikTok Pixel + Events API
- Google Tag Manager
- Google Analytics 4
- Microsoft Clarity
- Snapchat Pixel

All events tracked client-side + server-side for iOS 14+ accuracy.

---

## 🤝 Contributing

This is a proprietary project. For collaboration opportunities, contact the team.

---

## 📞 Support

- Documentation: Check `/docs` folder
- Issues: Report via GitHub Issues
- Email: support@storear.com

---

## 📄 License

Proprietary - All Rights Reserved

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Database schema
- [ ] Auth system
- [ ] Store creation with AI
- [ ] Product management
- [ ] Order management
- [ ] Basic analytics

### Phase 2: Marketing Features
- [ ] Marketing pixels
- [ ] Landing page builder
- [ ] Conversion tracking
- [ ] Advanced analytics

### Phase 3: Advanced Features
- [ ] Multi-currency
- [ ] WhatsApp integration
- [ ] Email marketing
- [ ] A/B testing
- [ ] Mobile app

---

**Built with ❤️ for Arabic marketers and merchants**
