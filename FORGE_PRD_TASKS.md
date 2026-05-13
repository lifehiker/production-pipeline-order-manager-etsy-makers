# MakerPipeline PRD Task Checklist

Status key: `[ ]` pending, `[-]` in progress, `[x]` complete

Last reviewed: 2026-05-13 — full completion audit pass.

## Foundation
- [x] Read `PRD.md` end-to-end
- [x] Read `BUILD_INSTRUCTIONS.md` end-to-end
- [x] Audit existing scaffold and routes against PRD requirements
- [x] Configure `next.config.ts` with `output: "standalone"`
- [x] Avoid `next/font/google` and other build-time network font fetches
- [x] Avoid module-scope initialization for Stripe/Resend clients
- [x] Align framework/runtime conventions with current Next version (`middleware` deprecated → `proxy.ts`)
- [x] Dependency install health and generated Prisma client verified

## Data model
- [x] Define Prisma schema for auth tables
- [x] Define Prisma schema for `User`
- [x] Define Prisma schema for `Shop`
- [x] Define Prisma schema for `ProductType`
- [x] Define Prisma schema for `IntakeForm`
- [x] Define Prisma schema for `Order`
- [x] Define Prisma schema for `HolidayPlan`
- [x] Define Prisma schema for team membership/invites
- [x] Define Prisma schema for lead capture / email capture
- [x] Configure local-safe SQLite database fallback
- [x] Generate Prisma client and local DB usable
- [x] Seed demo/default product types and starter form scaffolding via `bootstrap.ts`

## Auth
- [x] Configure auth entrypoint (`src/auth.ts`) and route handlers
- [x] Implement Google OAuth path when credentials are present
- [x] Implement safe fallback demo-login path when Google credentials are absent
- [x] Add session helpers (`src/lib/session.ts`)
- [x] Protect authenticated app routes via `src/proxy.ts` (Next 16 middleware)
- [x] Build login page
- [x] Build logout flow (`SignOutButton`)

## Onboarding and app shell
- [x] Build protected dashboard shell with sidebar navigation
- [x] Build onboarding wizard step 1: shop name, brand, logo upload
- [x] Build onboarding wizard step 2: product types and defaults
- [x] Build onboarding wizard step 3: weekly production hours + workflow notes
- [x] Persist onboarding data and redirect to dashboard
- [x] Logo upload field component (`LogoUploadField`) in onboarding and settings

## User-facing pages: authenticated app
- [x] `/app/dashboard` — stats, capacity, holiday preview, recent orders
- [x] `/app/onboarding` — 3-step wizard
- [x] `/app/orders` — orders table with search, filter, inline status update
- [x] `/app/queue` — Kanban board with drag-and-drop, daily capacity tracker
- [x] `/app/planner` — holiday backward planner with save
- [x] `/app/forms` — forms list with create/delete actions
- [x] `/app/forms/[formId]/edit` — form builder with drag-and-drop fields + live preview
- [x] `/app/settings` — shop profile, subscription status, billing portal, team invite

## User-facing pages: public product and SEO
- [x] `/` — hero, value props, social proof stats (with SiteShell nav/footer)
- [x] `/pricing` — plan cards with checkout forms
- [x] `/features/intake-form`
- [x] `/features/production-queue`
- [x] `/features/holiday-planner`
- [x] `/tools/q4-planner` — free live planner with email capture (with SiteShell nav/footer)
- [x] `/blog` — blog index
- [x] 4 required PRD blog post pages
- [x] `/f/[formSlug]` — public intake form with branding
- [x] `sitemap.xml`
- [x] `robots.txt`

## API routes and server actions
- [x] Auth routes (`/api/auth/[...nextauth]`)
- [x] Onboarding (`POST /api/onboarding`)
- [x] Forms list/create (`GET/POST /api/forms`)
- [x] Form update (`PUT /api/forms/[formId]`)
- [x] Public order submission (`POST /api/orders`)
- [x] Order status update (`PATCH /api/orders/[orderId]`)
- [x] Holiday plan create (`GET/POST /api/holiday-plans`)
- [x] Lead capture (`POST /api/leads`)
- [x] Stripe checkout (`POST /api/checkout`)
- [x] Stripe webhook (`POST /api/webhooks/stripe`)
- [x] Stripe customer portal (`POST /api/billing/portal`)
- [x] Cron reminders (`GET /api/cron/reminders`)
- [x] File upload (`POST /api/uploads`)
- [x] Invite create (`POST /api/invites`)
- [x] Invite accept (`GET /api/invites/accept`)
- [x] Shop settings save (`POST /api/settings`)

## Core workflows
- [x] Seller signup/login (Google OAuth + demo fallback)
- [x] Onboarding completion → shop scaffold created
- [x] Create and edit intake forms
- [x] Share public intake form URL
- [x] Customer submits public order → lands in dashboard
- [x] Seller views and filters orders
- [x] Update order status and notes
- [x] Drag-and-drop production queue
- [x] Daily capacity tracker
- [x] Calculate holiday plan (backward from shipping cutoff)
- [x] Save holiday plan to account
- [x] Cron reminder processing
- [x] Free Q4 planner public tool with CTA to signup
- [x] Lead email capture from Q4 planner

## Billing, email, storage integrations or safe fallbacks
- [x] Stripe subscription integration with safe no-credential fallback
- [x] Trial handling and subscription status UI
- [x] Studio upgrade path
- [x] Customer portal management
- [x] Resend order notification emails
- [x] Resend reminder emails
- [x] Safe no-credential email fallback (console log)
- [x] Safe no-credential local file storage (public/uploads)
- [x] Logo upload UX in onboarding, settings, and forms

## Marketing and conversion
- [x] Professional homepage with SiteShell nav/footer
- [x] Pricing page with plan comparison
- [x] Feature pages (intake forms, queue, holiday planner)
- [x] Blog index and 4 blog posts
- [x] Free tool CTA → signup funnel
- [x] Email lead capture on Q4 planner page

## Deployment and ops
- [x] `.env.example` exists with all required keys
- [x] `HUMAN_INPUT_NEEDED.md` created (credentials guide)
- [x] `Dockerfile` created (multi-stage, standalone output)
- [x] `FORGE_COMPLETION_AUDIT.md` created

## Verification
- [x] Re-read PRD and BUILD_INSTRUCTIONS — full pass
- [x] `npm run build` passes clean
- [x] Dev server starts and serves HTML
- [x] Database in sync (`prisma db push`)
- [x] All 38 routes verified in build output
