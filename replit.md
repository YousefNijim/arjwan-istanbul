# ARJWAN Istanbul – Replit Project

## Overview
A luxury Turkish perfume brand website for ARJWAN Istanbul. Built as a full-stack app with React frontend and Express backend, supporting Arabic, English, and Turkish languages.

## Architecture
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express on port 3001 (API server)
- **Database**: PostgreSQL via Drizzle ORM
- **Routing**: React Router DOM v6
- **State**: Zustand (cart), TanStack React Query (server data)
- **Animations**: Framer Motion
- **i18n**: Custom i18n in `src/i18n/` (AR/EN/TR)

## Development Setup
Two workflows run simultaneously:
1. **Start application** (`npm run dev`) — Vite dev server on port 5000 with proxy to API
2. **API Server** (`npx tsx server/index.ts`) — Express API on port 3001

Vite proxies `/api/*` and `/uploads/*` to `http://localhost:3001`.

## Admin Panel
- **URL**: `/admin` (redirects to `/admin/login`)
- **Credentials**: `admin` / `arjwan2024`
- **Pages**: Dashboard, Products (CRUD), Offers (discounts), Orders, Settings

## Project Structure
```
shared/
  schema.ts        - Drizzle schema (all DB tables)

server/
  index.ts         - Express server (port 3001)
  db.ts            - Drizzle DB connection
  auth.ts          - JWT sign/verify + requireAuth middleware
  routes.ts        - All API endpoints
  seed.ts          - Initial data seeding script

src/
  App.tsx          - Routes (including /admin/*)
  components/      - Reusable UI components
  pages/
    Index.tsx, PerfumesPage.tsx, ProductDetailPage.tsx, CartPage.tsx
    admin/         - AdminLogin, AdminLayout, AdminDashboard, AdminProducts, AdminProductForm, AdminOffers, AdminOrders, AdminSettings
  hooks/
    useProducts.ts - React Query hook for /api/perfumes
    useOffers.ts   - React Query hook for /api/offers
  lib/
    adminApi.ts    - Admin API client (JWT auth)
    transformProduct.ts - DB row → frontend Product shape
  store/           - Zustand stores
  data/products.ts - Type definitions + brands array (products now in DB)
  i18n/            - Multilingual support
```

## Database Tables
- `perfumes` — Product catalog (12 seeded)
- `admin_users` — Admin credentials (bcrypt hashed)
- `offers` — Discount offers (by product/brand/category/all)
- `orders` — Customer orders from cart checkout
- `site_settings` — Key-value settings (logo, WhatsApp, backgrounds)

## Key API Endpoints
**Public:**
- `GET /api/perfumes` — all active products
- `GET /api/perfumes/:id` — single product
- `GET /api/offers` — active discount offers
- `GET /api/settings` — site configuration
- `POST /api/orders` — create order from cart

**Admin (JWT required):**
- `POST /api/admin/login` — get JWT token
- `GET/POST/PUT/DELETE /api/admin/perfumes`
- `GET/POST/PUT/DELETE /api/admin/offers`
- `GET /api/admin/orders`, `PUT /api/admin/orders/:id`
- `PUT /api/admin/settings`
- `POST /api/admin/upload` — image upload
- `GET /api/admin/stats` — dashboard stats

## Brand Colors
- Background: `hsl(0 0% 4%)` — near black
- Gold: `hsl(43 76% 52%)` — primary accent
- Deep Purple: `hsl(270 52% 34%)` — secondary accent

## Running Fresh
1. Ensure PostgreSQL is provisioned (DATABASE_URL env var set)
2. Create tables: `npx tsx server/seed.ts` (also seeds 12 perfumes + admin)
3. Both workflows auto-start
