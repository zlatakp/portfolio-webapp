---
version: 1.0.0
agent_role: "Lead Fullstack Engineer"
last_synced_commit: "" 
status: "Active"
---
# Agent Project Specification — Photographer Portfolio & Booking System

> **Scope:** MVP only. Do not implement anything not listed in this document.

---

## 1. Project Overview

- **Name:** Photographer Portfolio & Booking System
- **Description:** A premium, mobile-first photography portfolio website with a fully custom-built booking system. Clients can browse the portfolio, select a photography service, pick an available date and time, and submit a booking — all without creating an account. The photographer manages bookings, availability, and services via a protected admin dashboard.
- **Primary Goal:** A production-ready Next.js application deployed on Vercel, where the photographer can receive and manage bookings end-to-end with automated email notifications.
- **Current State:** Starting from scratch. Development runs inside a Docker container. Production deployment is Vercel.

---

## 2. Technical Stack

- **Language:** TypeScript 5 — strict mode, no `any` types
- **Framework:** Next.js 14 (App Router, Server Components by default)
- **Database:** PostgreSQL via Supabase (free tier)
- **ORM:** Prisma
- **Styling:** Tailwind CSS — mobile-first, utility classes only
- **Auth:** NextAuth.js with credentials provider (single admin user)
- **Email:** Resend + React Email
- **Storage:** Supabase Storage (portfolio image uploads)
- **Validation:** Zod on all API route inputs
- **Package Manager:** npm exclusively
- **Dev Environment:** Docker (containerised local development only — not used in production)
- **Deployment:** Vercel Hobby (free tier)
- **DNS/CDN:** Cloudflare (free tier)


---

## 2a. Local Development Environment (Docker)

Docker is used **for local development only**. Production deploys to Vercel unchanged. The Docker setup provides a consistent dev environment with a local PostgreSQL instance so Supabase is not required during development.

### Files to create

**`Dockerfile`** — dev-only image:
```dockerfile
FROM node:20-alpine
RUN corepack enable && corepack prepare npm@latest --activate
WORKDIR /app
COPY package.json npm-lock.yaml ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "dev"]
```

**`docker-compose.yml`** — local dev services:
```yaml

services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app              # Hot reload — mounts local code
      - /app/node_modules
      - /app/.next
    env_file: .env
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/photographer
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"        # Expose for local DB clients (TablePlus, etc.)
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: photographer
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**`.dockerignore`**:
```
node_modules
.next
.env
*.md
.git
```

### Dev workflow commands
```bash
# Start dev environment
docker compose up

# Run migrations inside container
docker compose exec app npm prisma migrate dev

# Seed database
docker compose exec app npm prisma db seed

# Run tests
docker compose exec app npm vitest

# Open Prisma Studio
docker compose exec app npm prisma studio
```

### Critical rules for Docker dev
- The database host inside Docker Compose is `db`, not `localhost`. The `DATABASE_URL` in `docker-compose.yml` overrides whatever is in `.env` for the container.
- `.env` is still required for all Supabase, Resend, NextAuth, and app variables. Only `DATABASE_URL` is overridden by Docker Compose for local dev.
- Never commit `.env` to Git.
- Do not add `output: 'standalone'` to `next.config.js` — this is not a Docker production deployment.
- The `Dockerfile` is dev-only. It does not need a multi-stage build or production optimisation.

---

## 3. Core Features & Requirements

1. **Portfolio Gallery:** Display photography work fetched from Supabase Storage. Rendered with Next.js `<Image />` for optimised delivery. Responsive grid, mobile-first.

2. **Service Listings:** Public page showing all active photography services (name, duration, price, description) with a "Book Now" CTA per service linking to the booking flow.

3. **Multi-Step Booking Flow (public, no auth required):**
   - Step 1: Client selects a service
   - Step 2: Client picks a date from a calendar; available time slots load dynamically based on photographer's availability rules minus existing bookings
   - Step 3: Client fills intake form (name, email, phone optional, notes optional) and submits
   - On success: redirect to confirmation state, emails sent automatically
   - On slot conflict (slot taken between Step 2 and Step 3): return 409, show clear error, do not create booking

4. **Availability Engine:** Server-side slot generation from weekly availability rules (by day of week) with support for date-specific overrides and blocked days. Slots generated in `service.duration` increments. Existing PENDING and CONFIRMED bookings excluded from available slots.

5. **Automated Emails:** Transactional emails via Resend triggered on booking lifecycle events — submission, confirmation, cancellation, and 24hr reminder (via Vercel Cron).

6. **Admin Dashboard (protected):**
   - Bookings: view all, filter by status/date, confirm or cancel with one click
   - Availability: set weekly working hours per day, add/remove blocked dates
   - Services: create, edit, deactivate services (soft delete only)
   - Portfolio: upload images to Supabase Storage

7. **SEO Layer:** `generateMetadata()` per page, `sitemap.ts`, `robots.ts`, JSON-LD `LocalBusiness` schema on homepage, Open Graph tags.

---

## 4. Architecture & Desired File Structure

```text
photographer-portfolio/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx                    # Shared nav + footer
│   │   ├── page.tsx                      # Hero + JSON-LD
│   │   ├── portfolio/
│   │   │   └── page.tsx
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── book/
│   │       ├── page.tsx                  # Step 1: Choose service
│   │       ├── [serviceId]/
│   │       │   └── page.tsx              # Step 2: Choose date & time
│   │       └── confirm/
│   │           └── page.tsx              # Step 3: Intake form + submit
│   │
│   ├── (admin)/
│   │   ├── layout.tsx                    # Auth guard + sidebar nav
│   │   └── dashboard/
│   │       ├── page.tsx                  # Redirects to /dashboard/bookings
│   │       ├── bookings/
│   │       │   └── page.tsx
│   │       ├── availability/
│   │       │   └── page.tsx
│   │       ├── services/
│   │       │   └── page.tsx
│   │       └── portfolio/
│   │           └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── bookings/
│   │   │   ├── route.ts                  # GET (protected), POST (public)
│   │   │   └── [id]/
│   │   │       └── route.ts              # PATCH status (protected)
│   │   ├── availability/
│   │   │   └── route.ts                  # GET slots (public), POST/PATCH/DELETE rules (protected)
│   │   ├── services/
│   │   │   ├── route.ts                  # GET (public), POST (protected)
│   │   │   └── [id]/
│   │   │       └── route.ts              # PATCH, DELETE (protected)
│   │   └── cron/
│   │       └── reminders/
│   │           └── route.ts              # Daily reminder trigger
│   │
│   ├── login/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx                        # Root layout + root metadata
│   ├── sitemap.ts
│   └── robots.ts
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Calendar.tsx
│   ├── booking/
│   │   ├── ServiceCard.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   ├── BookingForm.tsx
│   │   └── BookingConfirmationCard.tsx
│   ├── gallery/
│   │   └── GalleryGrid.tsx
│   └── admin/
│       ├── BookingsTable.tsx
│       ├── AvailabilityEditor.tsx
│       ├── ServicesEditor.tsx
│       └── PortfolioUploader.tsx
│
├── emails/
│   ├── BookingConfirmation.tsx
│   ├── BookingConfirmed.tsx
│   ├── BookingCancellation.tsx
│   └── BookingReminder.tsx
│
├── lib/
│   ├── prisma.ts                         # Prisma singleton
│   ├── supabase.ts                       # Supabase service role client
│   ├── resend.ts                         # Email client + all send functions
│   ├── availability.ts                   # getAvailableSlots() algorithm
│   └── auth.ts                           # NextAuth config
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── vercel.json                           # Cron job config
├── next.config.js
├── Dockerfile                            # Dev container only
├── docker-compose.yml                    # Local dev services
└── .dockerignore
```

---

## 5. Data Models & State

### Prisma Schema

```prisma
model Service {
  id          String    @id @default(cuid())
  name        String
  duration    Int                         // minutes
  description String
  price       Int                         // pence/cents
  active      Boolean   @default(true)
  bookings    Booking[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Availability {
  id        String    @id @default(cuid())
  dayOfWeek Int?                          // 0=Sun–6=Sat. Null = specific date override
  date      DateTime?                     // Specific date. Used when dayOfWeek is null
  startTime String                        // "09:00" 24hr
  endTime   String                        // "17:00" 24hr
  isBlocked Boolean   @default(false)
  createdAt DateTime  @default(now())
}

model Booking {
  id          String        @id @default(cuid())
  serviceId   String
  service     Service       @relation(fields: [serviceId], references: [id])
  clientName  String
  clientEmail String
  clientPhone String?
  notes       String?
  date        DateTime
  startTime   String        // "10:00"
  endTime     String        // "11:30"
  status      BookingStatus @default(PENDING)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String                        // bcrypt hashed
  createdAt DateTime @default(now())
}
```

### Key TypeScript Interfaces

```typescript
// Booking with service included (used in email send functions and admin table)
type BookingWithService = Booking & { service: Service }

// API response shapes
interface SlotsResponse { slots: string[] }
interface BookingResponse { booking: BookingWithService }
interface BookingsResponse { bookings: BookingWithService[] }
interface ServicesResponse { services: Service[] }
interface ServiceResponse { service: Service }

// Booking form submission body
interface CreateBookingBody {
  serviceId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  notes?: string
  date: string        // "YYYY-MM-DD"
  startTime: string   // "HH:MM"
}

// Booking step 2 → step 3 handoff via sessionStorage
interface BookingHandoff {
  serviceId: string
  date: string        // "YYYY-MM-DD"
  startTime: string   // "HH:MM"
}
```

### Availability Algorithm (implement exactly)

```
getAvailableSlots(date: string, serviceId: string): Promise<string[]>

1. Parse date → get dayOfWeek (0–6)
2. Check for date-specific Availability override (dayOfWeek = null, date matches)
   - If found and isBlocked = true → return []
   - If found and isBlocked = false → use its startTime/endTime
3. If no override, fetch Availability where dayOfWeek matches and date = null
   - If not found OR isBlocked = true → return []
4. Fetch Service by serviceId → get duration. If inactive → return []
5. Generate slots: startTime to endTime in duration-minute steps
   Stop if slotStart + duration > endTime
6. Fetch all Bookings for date where status IN [PENDING, CONFIRMED]
7. Remove slots that overlap any existing booking
   Overlap: slotStart < existingEndTime AND slotEnd > existingStartTime
8. Return remaining slots as string[] e.g. ["09:00", "10:30"]
```

---

## 6. External APIs & Third-Party Dependencies

### Supabase
- **Purpose:** PostgreSQL database + file storage for portfolio images
- **Usage:**
  - Database via Prisma (use `DATABASE_URL` connection string)
  - Storage via `@supabase/supabase-js` service role client
  - Bucket name: `portfolio`, set to public
  - Upload path: `gallery/{filename}`
  - Public URL: `{SUPABASE_URL}/storage/v1/object/public/portfolio/gallery/{filename}`
  - List files: `supabase.storage.from('portfolio').list('gallery')`

### Resend
- **Purpose:** Transactional email delivery
- **Usage:** Four email triggers — booking submitted, booking confirmed, booking cancelled, 24hr reminder
- **From address:** `process.env.RESEND_FROM_EMAIL`
- **Photographer notification:** plain-text email to `process.env.PHOTOGRAPHER_EMAIL` on new booking

### NextAuth.js
- **Purpose:** Admin authentication (single user)
- **Provider:** Credentials (email + password, bcrypt hashed)
- **Strategy:** JWT session
- **Protected routes:** all `/dashboard/*` and all protected API routes
- **Sign-in page:** `/login`
- **On unauthenticated access:** redirect to `/login`

### Vercel Cron
- **Purpose:** Daily reminder emails to clients with confirmed bookings tomorrow
- **Schedule:** `0 8 * * *` (08:00 UTC daily)
- **Route:** `POST /api/cron/reminders`
- **Security:** Bearer token check against `NEXTAUTH_SECRET`

---

## 7. Agent Coding Guidelines & Constraints

### Style & Structure
- Functional components with hooks only — no class components
- Server Components by default — only add `'use client'` where interactivity requires it (forms, date pickers, slot selection, admin editors)
- Prefer early returns to reduce nesting
- JSDoc comments on all functions in `lib/` (especially `getAvailableSlots`)
- Named exports for components, default exports only where Next.js requires it (pages, layouts)

### Error Handling
- Wrap all database calls in `try/catch`, return typed error responses from API routes
- API routes must return consistent error shape: `{ error: string }`
- Zod validation on every API route body — return 400 with validation errors if invalid
- Slot conflict re-check server-side in `POST /api/bookings` — never trust client-side state
- 409 response if slot no longer available: `{ error: "This slot is no longer available" }`
- 404 response if resource not found: `{ error: "Not found" }`
- 401 response if protected route accessed without valid session

### Data Integrity
- Never hard delete — soft delete only (`active = false` on services, status changes on bookings)
- Always recalculate `endTime` server-side from `startTime + service.duration` — never accept `endTime` from client
- Re-validate slot availability inside `POST /api/bookings` even if client already checked

### Testing
- Write unit tests for `lib/availability.ts` — cover: blocked day, no rule, slot generation, overlap removal, date override precedence
- Do not write tests for UI components at MVP
- Use `vitest` for unit tests

### Workflow
- Propose the implementation plan for each phase before writing any files
- Wait for approval before starting each phase
- Complete one phase fully before moving to the next
- Run `npm build` at the end of each phase — fix all errors before reporting complete

### Forbidden
- No `any` types
- No third-party booking tools (Calendly, Cal.com, Acuity, etc.)
- No hard-coded credentials, emails, or URLs — use environment variables
- No Cloudinary — Supabase Storage only
- No Docker in production — Docker is for local development only; production target is Vercel
- No features outside this document

---

## 8. Step-by-Step Implementation Plan

### Phase 1 — Data Layer

**Step 1 — Create Docker files on the host machine (before any container starts):**

Write `Dockerfile`, `docker-compose.yml`, and `.dockerignore` as specified in Section 2a. Then start the environment:

```bash
docker compose up --build
```

Confirm both containers are running:
- `app` reachable at `http://localhost:3000`
- `db` reachable at `localhost:5432`

**Step 2 — Scaffold the Next.js project inside the container:**

```bash
docker compose exec app sh
```

Then inside the container shell:

```bash
npx create-next-app@14 . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

**Step 3 — Install dependencies:**

```bash
npm add prisma @prisma/client \
  @supabase/supabase-js \
  resend \
  @react-email/components \
  react-email \
  next-auth \
  bcryptjs \
  date-fns \
  zod \
  node-cron

npm add -D @types/bcryptjs @types/node-cron vitest
```

**Step 4 — Initialise Prisma:**

```bash
npx prisma init
```

**Step 5 — Write `prisma/schema.prisma`** as specified in Section 5, then run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Step 6 — Write and run the seed file:**

Write `prisma/seed.ts` as specified in the coding agent spec. Add to `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Then run:

```bash
npx prisma db seed
```

**Step 7 — Write lib files:**

Write `lib/prisma.ts` and `lib/supabase.ts` as specified in Section 5.

**Step 8 — Supabase Storage bucket:**

This is done manually in the Supabase dashboard, not via code:
- Create bucket named `portfolio`
- Set to public
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

**Verify Phase 1 is complete before proceeding:**
- `docker compose exec app npx prisma studio` — confirm tables exist and admin user is seeded
- `http://localhost:3000` — confirms Next.js dev server is running inside the container

### Phase 2 — Auth & Admin Shell
Write `lib/auth.ts`, NextAuth route, `app/login/page.tsx`, `app/(admin)/layout.tsx` with auth guard and sidebar. Confirm unauthenticated access to `/dashboard` redirects correctly.

### Phase 3 — Availability Algorithm & API Routes
Write `lib/availability.ts` with full slot generation logic. Write unit tests. Write all API routes: services (CRUD), availability (GET slots + CRUD rules), bookings (GET, POST, PATCH). Test all routes with a REST client before proceeding.

### Phase 4 — Email
Write all four React Email templates and all send functions in `lib/resend.ts`. Write cron route `app/api/cron/reminders/route.ts`. Write `vercel.json`.

### Phase 5 — Admin Dashboard Pages
Write all admin dashboard pages and their components: `BookingsTable`, `AvailabilityEditor`, `ServicesEditor`, `PortfolioUploader`. Wire all actions to API routes.

### Phase 6 — Public Booking Flow
Write shared UI components. Write all three booking flow pages. Implement sessionStorage handoff between steps. Handle all success, error, and conflict states.

### Phase 7 — Public Portfolio Pages
Write `(public)/layout.tsx` with nav and footer. Write homepage, portfolio gallery, services, and about pages. Implement `GalleryGrid` with Next.js `<Image />`.

### Phase 8 — SEO & Config
Write `generateMetadata()` on all public pages. Write `sitemap.ts`, `robots.ts`, JSON-LD on homepage. Write `next.config.js` with Supabase image remote pattern.

### Phase 9 — Build & Quality Pass
Inside the Docker container: run `npm build` — zero errors. Run `tsc --noEmit --strict` — zero type errors. Run `npm vitest` — all unit tests pass. Full manual test of booking flow and admin dashboard at `http://localhost:3000` on mobile viewport (375px). Confirm the build also passes outside the container (`npm build` locally) before pushing to Vercel.

---

## 9. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
# For local dev: overridden by docker-compose.yml to point to local db container
# For Vercel: set to Supabase connection string
DATABASE_URL=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Admin seed credentials
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=
PHOTOGRAPHER_EMAIL=

# App
NEXT_PUBLIC_BASE_URL=
```

---

## 10. API Route Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/services` | None | List active services |
| POST | `/api/services` | Admin | Create service |
| PATCH | `/api/services/[id]` | Admin | Update service |
| DELETE | `/api/services/[id]` | Admin | Soft delete service |
| GET | `/api/availability` | None | Get available slots (`?date=&serviceId=`) |
| POST | `/api/availability` | Admin | Create availability rule |
| PATCH | `/api/availability/[id]` | Admin | Update availability rule |
| DELETE | `/api/availability/[id]` | Admin | Delete availability rule |
| GET | `/api/bookings` | Admin | List bookings (optional `?status=&date=`) |
| POST | `/api/bookings` | None | Create booking (public) |
| PATCH | `/api/bookings/[id]` | Admin | Update booking status |
| POST | `/api/cron/reminders` | Bearer | Send 24hr reminder emails |

---

## 11. Email Trigger Reference

| Trigger | Template | Recipients |
|---|---|---|
| Booking submitted | `BookingConfirmation` | Client + photographer (plain text) |
| Admin confirms booking | `BookingConfirmed` | Client |
| Admin cancels booking | `BookingCancellation` | Client |
| Daily cron — session tomorrow | `BookingReminder` | Client |

---

## Suggested Additional Sections to Add to the Template

The following sections were missing from the template but proved essential for this project. Consider adding them as standard template sections:

**9. Environment Variables** — list every `process.env` variable the app uses, with a description and required/optional flag. Agents regularly hallucinate variable names without this.

**10. API Route Reference** — a table of all routes, methods, auth requirements, and purpose. Prevents the agent inventing route shapes or auth behaviour.

**11. Email / Notification Reference** — when transactional emails or notifications are involved, a trigger table prevents the agent from missing or duplicating sends.

**12. Soft Delete & Data Integrity Rules** — explicit rules about what can/cannot be deleted and how status transitions work. Without this, agents often implement hard deletes by default.

**13. Forbidden Patterns** — an explicit list of what not to build or use. Agents often add features they infer you might want. A "do not build" list is as important as a "build this" list.