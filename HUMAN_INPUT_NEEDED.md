# Human Input Needed

The app runs fully without any of these credentials — demo/local mode is always available. The items below unlock production-grade functionality.

---

## 1. Google OAuth (for production sign-in)

**Why**: Without these the app falls back to a demo workspace login (email + name, no password). The demo mode is fully functional for testing.

**Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add authorised redirect URI: `https://yourdomain.com/api/auth/callback/google`
4. Copy the Client ID and Client Secret

**Add to `.env`**:
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## 2. Stripe (for paid subscriptions)

**Why**: Without Stripe the checkout buttons redirect back to `/app/settings?billing=demo` with a graceful message. All app features remain available during the 14-day trial and in demo mode.

**Steps**:
1. Create a [Stripe](https://stripe.com) account
2. In the Stripe dashboard create 4 products with recurring prices:
   - Solo Monthly ($19/mo) — note the Price ID
   - Solo Annual ($190/yr) — note the Price ID
   - Studio Monthly ($39/mo) — note the Price ID
   - Studio Annual ($390/yr) — note the Price ID
3. Set up a webhook endpoint pointing to `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the webhook signing secret

**Add to `.env`**:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SOLO_MONTHLY_PRICE_ID=price_...
STRIPE_SOLO_ANNUAL_PRICE_ID=price_...
STRIPE_STUDIO_MONTHLY_PRICE_ID=price_...
STRIPE_STUDIO_ANNUAL_PRICE_ID=price_...
```

---

## 3. Resend (for transactional email)

**Why**: Without Resend the app logs emails to the server console instead of sending them. Invite links are still usable locally; order confirmations are skipped gracefully.

**Steps**:
1. Create a [Resend](https://resend.com) account
2. Add and verify your sending domain
3. Generate an API key

**Add to `.env`**:
```
RESEND_API_KEY=re_...
```

Also update the `from` address in `src/lib/email.ts` if you want a custom sender domain (defaults to `onboarding@resend.dev` for sandbox testing).

---

## 4. Production database (PostgreSQL)

**Why**: The app ships with SQLite at `prisma/dev.db` which is fine for a single instance. For multi-replica or managed cloud deployments use PostgreSQL.

**Steps**:
1. Provision a PostgreSQL database (Railway, Supabase, Neon, etc.)
2. Copy the connection string

**Update `prisma/schema.prisma`**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Add to `.env`**:
```
DATABASE_URL=postgresql://user:password@host:5432/makerpipeline
```

Then run:
```bash
npx prisma db push
```

---

## 5. `NEXTAUTH_SECRET`

**Why**: Required in production to sign JWT session tokens. The app will warn in dev mode if it is missing.

**Generate**:
```bash
openssl rand -base64 32
```

**Add to `.env`**:
```
NEXTAUTH_SECRET=your-random-secret
```

---

## 6. `NEXT_PUBLIC_BASE_URL`

**Why**: Used for generating invite links and the sitemap `metadataBase`. Defaults to `http://localhost:3000`.

**Add to `.env`**:
```
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## 7. Cron job for email reminders

**Why**: The `/api/cron/reminders` route sends order due-date reminders. It must be called on a schedule externally.

**Coolify / cron setup**: Add a cron job that calls:
```
GET https://yourdomain.com/api/cron/reminders
Authorization: Bearer <CRON_SECRET>
```

**Add to `.env`**:
```
CRON_SECRET=a-random-secret-string
```
