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
- `api/admin/orders/send-email` — send dispatch email to client + cc to admin
- `api/admin/orders/order/approve` — Update order status
- `api/admin/products` — list/create/update many products
- `api/admin/products/product` — CRUD single product
- `api/admin/products/search` — search products
- `api/admin/products/product/inventory` — update inventory (single/bulk)
- `api/admin/clients` — get all clients
- `api/admin/clients/client` — CRUD single client
- `api/admin/companies` — get all companies and create a company
- `api/admin/companies/[id]` — CRUD single company
- `api/admin/companies/products` — select products for a company, delete/get products for a company

Client

- `api/client` — Get client info
- `api/client/orders` — list client orders
- `api/client/orders/order` — create dispatch order; get an order detail
- `api/client/products` — list all products of a client
- `api/client/products/product` — single product detail
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

# B2B Portal Project Task Log

This log chronicles the development progress of the B2B Portal project from its inception through recent updates, based on Git commit history. Organized into Backend and Frontend features for clarity.

## Backend Features Implemented

### 1. Project Initialization

- Bootstrapped the project using Create Next App and set up core entities (Client, Products).

### 2. Database & ORM Setup

- Configured the Prisma client and tables; refined schema for clients, products, and orders.

### 3. Authentication & Authorization

- Implemented authentication APIs, configured roles for admin and clients.

### 4. Product Management APIs

- Built CRUD endpoints and search functionality for products for both admin and clients.

### 5. Order System Core Features

- Created the Orders table schema and basic Create Order API.

### 6. Order Workflow Enhancements

- Added approval, tracking, cancellation, and delivery-related details (delivery date, reference, packaging).

### 7. Inventory Integration

- Enabled automated inventory updates during order workflows and allowed manual updates (including bulk updates).

### 8. Email Functionality

- Integrated mailing workflows with real credentials, refined price handling and emailing logic.

### 9. Schema Corrections & Consistency

- Iteratively fixed inconsistencies in database schemas and adjusted functionality based on schema refinements.

### 10. Branch Merges & Conflict Resolution

- Regularly merged updates from the backend branch into main and resolved merge conflicts.

### 11. Cleanup & Dependency Management

- Removed duplicate dependencies and unwanted generated files (e.g., Prisma client files).

### 12. Environment Configuration Updates

- Updated environment variable names and placements to ensure consistent usage across the project.

### 13. Create dispatch order API by Admin

- Created an API for admin to create a dispatch order and send email to client and cc to admin.

### 14. Order Status Changed

- Order status changed to Pending, Approved, Cancelled, Ready for Dispatch, Dispatched, At Destination, and Delivered in the schema.

### 15. Multiple Clients and Companies APIs

- Developed APIs to manage multiple clients and their associated companies, allowing for better organization and retrieval of client-specific data.

### 16. Select Products for Companies API

- Created an API that allows Admin to select products for companies, facilitating a more tailored product management experience for different companies.

### 17. Price Visibility API

- Implemented an API to manage price visibility settings, enabling Admin to control which clients or companies can view products prices.

### 18. Create Dispatch order by admin splitted into two steps

- Refined the dispatch order creation process by splitting it into two distinct steps: first, creating the order, and second, sending the email notification to the client and CC to admin.

### 19. Client and company management APIs in Admin Panel

- Developed comprehensive APIs for managing clients and their associated companies within the Admin Panel, including CRUD operations and association management.

### 20. DB cleaning

- Cleaned up the database by removing redundant or obsolete data tables, ensuring a more efficient and organized data structure.

### 21. Delivery Service Addition API

- Added an API to add delivery services option by the client after the order status becomes "Dispatched", allowing clients to specify their preferred delivery service.

## Frontend Features Implemented

### 1. Next.js Migration and Core Setup

- Migrated entire frontend codebase from standard React to Next.js framework for improved performance and SEO
- Implemented client-side data fetching patterns
- Configured Next.js middleware for proper session management and secure authentication flows

### 2. Admin Dashboard Development

- Created modular admin components including metric grids, quick action panels, and recent orders sections

### 3. Product Management Interface

- product list view with multiple filtering options and search
- Created product form dialogs
- Built bulk product upload functionality with CSV file parsing, validation, and error handling
- Added bulk inventory editing interfaces with upload buttons, batch update dialogs, and bulk action dropdowns

### 4. Order Management System UI

- order creation workflow with quantity selection dialogs and shopping cart management
- Created dispatch order interface for admin for generating shipping orders for clients
- Implemented order status update dialogs

### 5. Client Management Interface

- Constructed full client CRUD (Create, Read, Update, Delete) operations interface for admin users
- Implemented client statistics grids showing performance metrics and order volumes

### 6. Inventory Control Interfaces

- Developed inventory update dialogs with detailed reason tracking and manual adjustment controls
- Added real-time inventory tracking indicators on product cards and list views with stock alerts

### 7. Client Portal Features

- cart and checkout pages with quantity management and secure order placement
- Added client order approval and tracking interfaces with email notifications

### 8. Advanced Features and Technical Integrations

- Integrated real-time data fetching with SWR hooks for optimized API performance and caching
- Implemented bulk operations across products and inventory with progress tracking and error recovery
- Created comprehensive custom hooks for data management (cart, filters, product forms, etc.)
- Developed type-safe data actions and state management for consistent application behavior
- session handling middleware for secure authentication and automatic logout functionality

---
