# MakerPipeline — Forge Completion Audit

Generated: 2026-05-13

This document maps every major PRD requirement to the concrete files, routes, and components that implement it.

---

## Authentication

| Requirement | Implementation |
|---|---|
| Google OAuth login | `src/auth.ts` — Google provider conditionally loaded when env vars present |
| Demo / no-credential login | `src/auth.ts` — Credentials provider (`demo-login`) |
| Session management (JWT) | `src/auth.ts` — `strategy: "jwt"`, JWT + session callbacks |
| Auth route handler | `src/app/api/auth/[...nextauth]/route.ts` |
| Login page | `src/app/login/page.tsx` + `src/components/auth/login-actions.tsx` |
| Sign-out | `src/components/auth/sign-out-button.tsx` |
| Route protection | `src/proxy.ts` (Next 16 middleware, matcher: `/app/:path*`) |
| Server-side auth helpers | `src/lib/session.ts` — `requireUser()`, `requirePrimaryShop()` |
| Auto-scaffold on first login | `src/lib/bootstrap.ts` — `ensureDemoUserScaffold()` |

---

## Data Model

| Entity | Prisma model location |
|---|---|
| User + subscription fields | `prisma/schema.prisma` — `User` |
| Shop (branding, capacity) | `prisma/schema.prisma` — `Shop` |
| Product types | `prisma/schema.prisma` — `ProductType` |
| Intake forms (JSON fields) | `prisma/schema.prisma` — `IntakeForm` |
| Orders | `prisma/schema.prisma` — `Order` |
| Holiday plans | `prisma/schema.prisma` — `HolidayPlan` |
| Team memberships + invites | `prisma/schema.prisma` — `ShopMember`, `ShopInvite` |
| Lead capture | `prisma/schema.prisma` — `Lead` |
| NextAuth sessions/accounts | `prisma/schema.prisma` — `Account`, `Session`, `VerificationToken` |
| SQLite fallback | `prisma/schema.prisma` — `provider = "sqlite"`, `url = "file:./prisma/dev.db"` |

---

## Onboarding

| Step | Implementation |
|---|---|
| 3-step wizard | `src/components/auth/onboarding-form.tsx` |
| Step 1: Shop name, accent color, logo | `OnboardingForm` — step 1 state |
| Step 2: Product type selection | `OnboardingForm` — step 2, `PRODUCT_TYPE_DEFAULTS` from `src/lib/constants.ts` |
| Step 3: Weekly hours + workflow notes | `OnboardingForm` — step 3 |
| Persist + redirect to dashboard | `src/app/api/onboarding/route.ts` → `POST /api/onboarding` |
| Onboarding page | `src/app/app/onboarding/page.tsx` |
| Logo upload component | `src/components/ui/logo-upload-field.tsx` → `POST /api/uploads` |

---

## Intake Forms (Custom Order Forms)

| Requirement | Implementation |
|---|---|
| Form builder with drag-and-drop fields | `src/components/forms/form-builder.tsx` (dnd-kit) |
| Field types: text, textarea, select, date, number, file | `src/lib/types.ts` — `IntakeFieldType`, rendered in `FormBuilder` |
| Live preview panel | `FormBuilder` — sticky preview column |
| Forms list page | `src/app/app/forms/page.tsx` |
| Form editor page | `src/app/app/forms/[formId]/edit/page.tsx` |
| Public shareable form URL | `/f/[formSlug]` — `src/app/f/[formSlug]/page.tsx` |
| Shop branding on public form | `src/app/f/[formSlug]/page.tsx` — `accentColor`, `logoUrl` applied via CSS vars |
| File upload on public form | `src/app/api/orders/route.ts` — `saveUploadedFile()` |
| Create form API | `POST /api/forms` — `src/app/api/forms/route.ts` |
| Update form API | `PUT /api/forms/[formId]` — `src/app/api/forms/[formId]/route.ts` |

---

## Order Dashboard

| Requirement | Implementation |
|---|---|
| Orders list with filters | `src/components/orders/orders-table.tsx` — search, status filter, date range, product type |
| Inline status update | `orders-table.tsx` — select dropdown → `PATCH /api/orders/[orderId]` |
| Order detail panel | `orders-table.tsx` — sticky side panel |
| Orders page | `src/app/app/orders/page.tsx` |
| Status flow: INQUIRY → CONFIRMED → IN_PRODUCTION → COMPLETE → SHIPPED | `prisma/schema.prisma` — `OrderStatus` enum |
| Order submitted via public form | `POST /api/orders` — `src/app/api/orders/route.ts` |
| New order email notification | `src/lib/email.ts` — `sendAppEmail()` called in order POST |

---

## Production Queue

| Requirement | Implementation |
|---|---|
| Kanban board (5 columns) | `src/components/queue/queue-board.tsx` |
| Drag-and-drop status moves | `QueueBoard` — dnd-kit + `PATCH /api/orders/[orderId]` |
| Daily capacity tracker | `QueueBoard` — progress bar, IN_PRODUCTION minutes vs. daily limit |
| Queue page | `src/app/app/queue/page.tsx` |

---

## Holiday Backward Planner

| Requirement | Implementation |
|---|---|
| Core calculation algorithm | `src/lib/holidayPlanner.ts` — `calculateHolidayPlan()` |
| Holidays: Q4, Valentine's Day, Mother's Day | `src/lib/constants.ts` — `HOLIDAY_DEFAULTS` |
| Interactive planner UI | `src/components/planner/planner-tool.tsx` |
| Production start date, material order date, weekly targets | Returned by `calculateHolidayPlan()`, displayed in `PlannerTool` |
| Save plan | `POST /api/holiday-plans` — `src/app/api/holiday-plans/route.ts` |
| Planner page (authenticated) | `src/app/app/planner/page.tsx` |
| Dashboard Q4 preview | `src/app/app/dashboard/page.tsx` — inline `calculateHolidayPlan()` call |

---

## Free Public Q4 Planner (Lead Magnet)

| Requirement | Implementation |
|---|---|
| Public planner tool page | `src/app/tools/q4-planner/page.tsx` |
| Same calculation engine as app | Shared `calculateHolidayPlan()` from `src/lib/holidayPlanner.ts` |
| Email capture form | `src/app/tools/q4-planner/page.tsx` → `POST /api/leads` |
| Lead storage | `src/app/api/leads/route.ts` → `Lead` table |
| CTA to full app signup | `PlannerTool` `ctaHref="/login"` |
| Marketing nav/footer | `SiteShell` wrapper added to `Q4PlannerPage` |

---

## Settings & Shop Management

| Requirement | Implementation |
|---|---|
| Shop profile (name, color, hours, logo) | `src/components/settings/settings-form.tsx` → `POST /api/settings` |
| Subscription status display | `src/app/app/settings/page.tsx` — `user.subscriptionStatus` |
| Trial end date | `src/app/app/settings/page.tsx` — `user.trialEndsAt` |
| Upgrade to Studio | Settings page form → `POST /api/checkout` |
| Billing portal | Settings page form → `POST /api/billing/portal` |
| Team invite (Studio) | `POST /api/invites` → email via Resend or local link fallback |
| Invite accept | `GET /api/invites/accept` |

---

## Stripe Billing

| Requirement | Implementation |
|---|---|
| Lazy-initialized client | `src/lib/stripe.ts` — returns `null` if key missing |
| Checkout session | `src/app/api/checkout/route.ts` |
| Webhook handler | `src/app/api/webhooks/stripe/route.ts` — updates `subscriptionStatus` |
| Customer portal | `src/app/api/billing/portal/route.ts` |
| Safe fallback with no credentials | All billing routes redirect to `/app/settings?billing=demo` |
| 4 plan definitions | `src/lib/constants.ts` — `PLAN_DEFINITIONS` |

---

## Email (Resend)

| Requirement | Implementation |
|---|---|
| Lazy-initialized Resend client | `src/lib/email.ts` — `sendAppEmail()` checks `RESEND_API_KEY` |
| New order notification | `src/app/api/orders/route.ts` — fires after order created |
| Cron reminders | `src/app/api/cron/reminders/route.ts` — due-date reminder emails |
| Invite email | `src/app/api/invites/route.ts` — send invite with accept link |
| No-credential fallback | `sendAppEmail()` logs to console when Resend key absent |

---

## Storage

| Requirement | Implementation |
|---|---|
| File uploads | `src/lib/storage.ts` — saves to `public/uploads/` |
| Upload API | `POST /api/uploads` — auth-gated, returns public URL |
| Logo upload UX | `src/components/ui/logo-upload-field.tsx` — in onboarding + settings |

---

## Marketing / SEO Pages

| Route | Implementation |
|---|---|
| `/` | `src/app/page.tsx` — hero, value props, stat grid (SiteShell) |
| `/pricing` | `src/app/(marketing)/pricing/page.tsx` |
| `/features/intake-form` | `src/app/(marketing)/features/intake-form/page.tsx` |
| `/features/production-queue` | `src/app/(marketing)/features/production-queue/page.tsx` |
| `/features/holiday-planner` | `src/app/(marketing)/features/holiday-planner/page.tsx` |
| `/blog` | `src/app/(marketing)/blog/page.tsx` |
| `/blog/custom-order-tracker-handmade-sellers` | Blog post page |
| `/blog/etsy-holiday-prep-checklist-makers` | Blog post page |
| `/blog/how-to-plan-etsy-q4-production-schedule` | Blog post page |
| `/blog/when-to-order-materials-etsy-q4` | Blog post page |
| `/sitemap.xml` | `src/app/sitemap.ts` |
| `/robots.txt` | `src/app/robots.ts` |
| Marketing layout (nav + footer) | `src/components/layout/site-shell.tsx` |

---

## Deployment

| Item | Implementation |
|---|---|
| `output: "standalone"` | `next.config.ts` |
| Multi-stage Dockerfile | `Dockerfile` — deps → builder → runner (node:20-slim) |
| `public/` copied in Dockerfile | Present (SVGs + uploads folder) |
| DB push on container start | `Dockerfile` CMD runs `prisma db push` before `node server.js` |
| `.env.example` | Present at repo root |
| `HUMAN_INPUT_NEEDED.md` | Present at repo root — covers Google OAuth, Stripe, Resend, DB, secrets |

---

## Intentionally Deferred External-Credential Items

The app runs fully in demo/local mode without any of these:

| Item | Why deferred | Graceful fallback |
|---|---|---|
| Google OAuth | Requires cloud console setup | Demo workspace login (email + name) |
| Stripe | Requires account + price IDs | Checkout → `?billing=demo` message |
| Resend | Requires account + domain | Emails logged to console |
| PostgreSQL | Requires managed DB | SQLite at `prisma/dev.db` |
| `NEXTAUTH_SECRET` | Auto-generated in dev by NextAuth | Warning shown in dev; required in prod |

All deferred items are documented in `HUMAN_INPUT_NEEDED.md`.
