## Fitplay B2B Order Portal

This portal streamlines B2B product ordering, order management, and client–admin collaboration for Fitplay.

### Overview

- Primarily client-side rendered (CSR) using React on Next.js App Router
- APIs via Next.js API routes; Prisma + PostgreSQL for data
- Optimized for interactive dashboards with SWR caching and role-based views

---

## Getting Started

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open `http://localhost:3000` in your browser.

### Requirements

- Node.js 18+
- PostgreSQL (local or managed)

### Environment Variables

Create `.env.local` with:

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

ADMIN_EMAIL=admin_email
ADMIN_PASSWORD=admin_password
CLIENT_EMAIL=client_email
CC_EMAIL_1=cc_email_1

RESEND_API_KEY=resend_api_key
```

### Install & Database Setup

```bash
pnpm install
npx prisma generate
npx prisma db push
# optional
pnpm run seed
```

### Scripts

```bash
pnpm dev      # start dev server
pnpm build    # prisma generate + next build
pnpm start    # start production server
pnpm lint     # run linter
```

---

## Technology Stack

- Next.js 15 (App Router), TypeScript
- Tailwind CSS, shadcn/ui (Radix), Lucide
- SWR for data fetching/caching/mutations
- NextAuth (email/password), Zod validation
- Prisma ORM + PostgreSQL
- Resend for emails

---

## Project Structure

```
.
├── app                 # Routes (admin, client, login, api)
│   ├── admin           # Admin dashboard
│   ├── api             # API routes (auth, admin, client)
│   ├── client          # Client portal
│   └── login           # Auth UI
├── components          # Reusable components
│   └── ui              # shadcn/radix primitives
├── data                # Client fetchers/actions per domain
│   ├── client
│   ├── order
│   └── product
├── hooks               # UI/business hooks
├── lib                 # Utilities & Prisma client output
├── prisma              # Schema & migrations
├── public              # Static assets
└── types               # Shared types
```

---

## Backend (API Routes)


Existing (high-level)

- `api/auth`: NextAuth (admin/client)

Admin

- `api/admin/orders` — list orders
- `api/admin/orders/order` — get by id, create dispatch order
- `api/admin/orders/order/approve` — approve/reject order
- `api/admin/products` — list/create many products
- `api/admin/products/product` — CRUD single product
- `api/admin/products/search` — search products

Client

- `api/client/orders` — list client orders
- `api/client/orders/order` — create dispatch order; get order detail
- `api/client/products` — list products
- `api/client/products/product` — product detail
- `api/client/products/search` — search products

Database

- PostgreSQL via Prisma (`prisma/schema.prisma`): `Admin`, `Client`, `Product`, `Order`, `OrderItem` and enums (`Status`, `Category`, `Modes`, etc.)
- Production: NeonDB. Local: Docker/local Postgres

---

## Frontend (Client-Side)

Why CSR

- Interactive dashboards and frequent UI interactions
- SWR for caching, revalidation, optimistic updates
- Role-based personalization (admin vs client)

Rendering & Data Flow

- Client components with React hooks + SWR
- `data/*` hooks/actions → `app/api/**` → Prisma → DB
- Errors via toasts; loading via skeletons
- Admin-only UI hidden client-side and enforced server-side

Where Things Live

- UI primitives: `components/ui/*`
- Admin: `app/admin/**`
- Client: `app/client/**`
- Hooks/state: `hooks/*`, `data/*/*.hooks.ts`
- Fetchers/mutations: `data/*/*.actions.ts`

---

## Email

- Resend for dispatch/notification emails
- Edit email copy under `app/api/client/orders/order`

---

## Deployment

- App: Vercel
- DB: NeonDB
- Secrets/ENV configured in Vercel (owner: `@chirag-droid`)

---

## Contribution

- Follow existing code style; concise commits
- Feature branches; PRs into `main`
- Test locally with env vars (ask before committing secrets)
- Update docs when adding/changing features

---

## Quick How‑Tos

- New admin page: `app/admin/<feature>/page.tsx` + `components/ui` + `data/<feature>`
- New API-backed action: `app/api/<area>/route.ts` + `data/<area>/<name>.actions.ts` + hook
- Form validation: Zod schema near form; parse client + API

---

## Troubleshooting

- Prisma not found: `npx prisma generate`
- Auth callbacks: check `NEXTAUTH_URL`/`NEXTAUTH_SECRET`; clear cookies
- DB drift: `prisma db push` in dev; review migrations for prod
