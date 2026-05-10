# MakerPipeline PRD Task Checklist

Status key: `[ ]` pending, `[-]` in progress, `[x]` complete

## Foundation
- [x] Read `PRD.md` end-to-end
- [x] Read `BUILD_INSTRUCTIONS.md` end-to-end
- [-] Scaffold Next.js app in this repo
- [ ] Configure `next.config.ts` with `output: "standalone"`
- [ ] Replace network build dependencies such as `next/font/google`
- [ ] Install app dependencies for Prisma, auth, billing, email, drag-and-drop, forms, validation, and UI
- [ ] Set up shared app structure, utilities, and design system primitives

## Data model
- [ ] Define Prisma schema for auth tables
- [ ] Define Prisma schema for `User`
- [ ] Define Prisma schema for `Shop`
- [ ] Define Prisma schema for `ProductType`
- [ ] Define Prisma schema for `IntakeForm`
- [ ] Define Prisma schema for `Order`
- [ ] Define Prisma schema for `HolidayPlan`
- [ ] Define Prisma schema for team membership/invites needed for Studio
- [ ] Define Prisma schema for lead capture / email capture
- [ ] Configure local-safe database fallback so app runs without external PostgreSQL credentials
- [ ] Generate Prisma client and push schema
- [ ] Seed demo/default product types and starter data

## Auth
- [ ] Configure NextAuth v5
- [ ] Implement Google OAuth path when credentials are present
- [ ] Implement safe fallback auth path when Google credentials are absent
- [ ] Add route/session helpers
- [ ] Protect all authenticated app routes
- [ ] Build login page
- [ ] Build logout flow

## Onboarding and app shell
- [ ] Build protected dashboard shell with navigation
- [ ] Build onboarding wizard step 1: shop name, brand, logo
- [ ] Build onboarding wizard step 2: product types and defaults
- [ ] Build onboarding wizard step 3: weekly production hours
- [ ] Persist onboarding data and redirect to dashboard

## User-facing pages: authenticated app
- [ ] `/app/dashboard`
- [ ] `/app/onboarding`
- [ ] `/app/orders`
- [ ] `/app/queue`
- [ ] `/app/planner`
- [ ] `/app/forms`
- [ ] `/app/forms/[formId]/edit`
- [ ] `/app/settings`

## User-facing pages: public product and SEO
- [ ] `/`
- [ ] `/pricing`
- [ ] `/features/intake-form`
- [ ] `/features/production-queue`
- [ ] `/features/holiday-planner`
- [ ] `/tools/q4-planner`
- [ ] `/blog`
- [ ] Required PRD blog entry pages
- [ ] Public form route `/f/[formSlug]`
- [ ] SEO metadata across public pages
- [ ] `sitemap`
- [ ] `robots`

## API routes and server actions
- [ ] Auth routes
- [ ] Onboarding create/update action
- [ ] Forms create action
- [ ] Forms update action
- [ ] Public order submission action
- [ ] Order update action
- [ ] Holiday plan create/update action
- [ ] Lead capture action
- [ ] Stripe checkout route
- [ ] Stripe webhook route
- [ ] Stripe customer portal route
- [ ] Reminder cron route
- [ ] Storage upload path or safe fallback

## Core workflows
- [ ] Seller signup/login
- [ ] Onboarding completion
- [ ] Create intake form
- [ ] Share public intake form
- [ ] Submit public order
- [ ] Seller sees order in dashboard
- [ ] Update order status and notes
- [ ] Manage production queue via drag/drop or equivalent
- [ ] View daily capacity tracker
- [ ] Calculate holiday plan
- [ ] Save holiday plan
- [ ] Trigger reminder processing flow
- [ ] Use free Q4 planner with CTA to signup

## Billing, email, storage integrations or safe fallbacks
- [ ] Stripe subscription integration
- [ ] Trial handling and subscription status UI
- [ ] Studio upgrade path
- [ ] Customer portal management
- [ ] Resend order notification emails
- [ ] Resend reminder emails
- [ ] Safe no-credential email fallback
- [ ] Logo/file upload storage
- [ ] Safe no-credential storage fallback

## Marketing and conversion
- [ ] Professional homepage with differentiated visual design
- [ ] Pricing page with Solo vs Studio comparison
- [ ] Feature pages with internal linking
- [ ] Blog index and starter content
- [ ] Conversion CTAs from free tool to signup

## Deployment and ops
- [ ] `.env.example` / production env template
- [ ] `HUMAN_INPUT_NEEDED.md` for external credentials
- [ ] Production-ready `Dockerfile`
- [ ] Ensure Dockerfile only copies existing directories
- [ ] Coolify/deploy notes

## Verification
- [ ] Re-read PRD sections after each major phase and update this file
- [ ] Run `npm run build`
- [ ] Fix build errors and rerun build until clean
- [ ] Start dev server
- [ ] Smoke-test primary routes
- [ ] Test major interactions and forms
- [ ] Review UI visually and polish rough areas
- [ ] Run `docker build .` if Docker is available
- [ ] Create `FORGE_COMPLETION_AUDIT.md`
- [ ] Confirm app is production-ready before declaring `FORGE_BUILD_COMPLETE`
