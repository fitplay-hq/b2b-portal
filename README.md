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

### 1. Role Base Authentication

- Implemented role based navigation and pages
- Client and Admin Login

### 2. Bulk Inventory Update

![Screenshot_21-9-2025_202016_b2b-portal-six vercel app](https://github.com/user-attachments/assets/cd724b03-24db-493c-b44a-8eb02f388631)

- Created Bulk Inventory update feature
- Easily search and select products to udpate
- Added Add/Remove inventory with reason
- Show to be stock in UI for verification

### 3. Bulk Products Add

- Created feature so admin can upload json to website
- The JSON is verified and then sent to backend

### 4. Single Product Inventory Update

![Screenshot_21-9-2025_202145_b2b-portal-six vercel app](https://github.com/user-attachments/assets/d23aca01-d512-4cc5-a5d9-5d75b60463e5)

- Created a form so Admin can add or remove stock for single product with reason
- The reason list comes from backend so it's easily configurable

### 5. Admin Products List grouped by category

![Screenshot_21-9-2025_202243_b2b-portal-six vercel app](https://github.com/user-attachments/assets/60884e26-8dc7-4db7-867f-021bf224ef79)

### 6. Products Dashboard

- Created scrollable product list
- The products can be searched through
- Added sorting by name, stock, category, price (ascending/descending)
- Filter by category

### 7. Edit Product/Add Product Form

![Screenshot_21-9-2025_202328_b2b-portal-six vercel app](https://github.com/user-attachments/assets/ca821904-fff0-40d7-9542-28c5d9209d10)

- Create drag drop, select image functionality
- Easily upload images of products from your local images

### 8. Image Uplaod API

- Created image upload backend with `uploadthing` for adding images to products

### 9. Clients Management

- Showed number of orders and company relation of clients
- Add/Edit and Delete client

### 10. Edit Client Page

![Screenshot_21-9-2025_202936_b2b-portal-six vercel app](https://github.com/user-attachments/assets/3f02d84f-f44e-4598-812e-fcdcc77f39a1)

- Created a company select feature so admin can easily change client's company
- Create a new company from this page if needed
- Configure show prices permission for client
- Add/Edit product access for the company the client belongs to
- Everything related to company can also be done on this page for ease

### 11. Add Client Page

- Added ability to set password
- Different data and APIs are called in these two pages

### 12. Companies List

![Screenshot_21-9-2025_203056_b2b-portal-six vercel app](https://github.com/user-attachments/assets/c575812b-46d4-40a7-9b58-60439f48784e)

- Show client and product association
- Companies metrics (total companies, clients and product access on average)

### 13. Add Company and Edit Company Page

![Screenshot_21-9-2025_203236_b2b-portal-six vercel app](https://github.com/user-attachments/assets/1a1f049a-b285-4841-b84d-04a94b428fce)

### 14. Sidebar

![Screenshot_21-9-2025_213043_localhost](https://github.com/user-attachments/assets/032392cb-cee1-4c2e-9ee5-fa9a37b37607)

### 15. Created list companies and patch companies API

- To enable companies selection in add and edit client form
- To enable adding new company when creating client
- Edit company data and products when editting form.

### 16. Made changes to APIs

- To match returned data with what is required on fronted

### 17. Branch Merges & Conflict Resolution

- Regularly merged updates from the backend branch into main and resolved merge conflicts.

### 18. Automatic type generation from backend

- Types are generated for frontend from backend
- This enables automatic order status and category names and reason when changed on backend

### 19. Data fetching and mutation hooks

- Created hooks for managing data updates and fetching
- data with types so it's easier to work in frontend

### 20. Visual changes

- Replaced native alerts with dialogues
- made the metrics card compact
- removed whitespace from the products card

### 21. Admin Create Order

![Screenshot_21-9-2025_21356_localhost](https://github.com/user-attachments/assets/ffc33980-ceee-487a-a4ef-846089a10bdf)

- Created a page so admin can create order for their clients
- Products search UI to easily select products to order
- Created a form so admin can easily set quantity for products in one flow
- Send mail popup. Admin optionally send mail if wanted

### 22. Order Details

![Screenshot_21-9-2025_213731_localhost](https://github.com/user-attachments/assets/4c0295d2-c255-4691-ac5e-8b163bbd2b34)

- Order details with consignee name/address, delivery mode, reference
- Show tracking details and delivery service if available
- Created button so admin can notify client about order. Change status to sent mail once sent.
- Calculate total amount of order and items price

### 23. Update Order Status

![Screenshot_21-9-2025_213952_localhost](https://github.com/user-attachments/assets/ba5e8867-2d86-415c-b1cb-eb1041ffcef5)

- Created form to ask for consignment number and delivery service if status is changed to dispatched

![Screenshot_21-9-2025_214018_localhost](https://github.com/user-attachments/assets/03778bf6-4977-40f7-beef-9c7b6dc64274)


---
