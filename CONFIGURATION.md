# Configuration, Keys & Settings

This is the single place to track every key/secret/setting the app uses — what it's
for, whether it's set, how to obtain it, and where it's used in code. Update the
**Status** column and tick the checklist as you configure things.

All settings live in **`.env`** (gitignored). A template is in **`.env.example`**.
After editing `.env`, **restart the dev server** (`npm run dev`) — env vars are read at boot.

> Node: this project requires **Node 18.18+** (an `.nvmrc` pins Node 20). Run `nvm use` first.

---

## 1. Environment variables — quick status

| Variable | Required? | What it does | Status (local dev) | Used in |
|---|---|---|---|---|
| `APP_URL` | Yes | Public base URL; used for OAuth redirect, Stripe redirect, email links | ✅ `http://localhost:4040` | google callback, stripe, mail |
| `AUTH_SECRET` | Yes | Signs the JWT session cookie (`bg_session`) | ⚠️ dev placeholder — **change for prod** | `src/lib/auth.ts` |
| `DATABASE_URL` | Yes | Database connection. SQLite by default | ✅ `file:./dev.db` | `prisma/schema.prisma`, `src/lib/db.ts` |
| `SMTP_HOST` | Optional | Mail server host (real email + OTP delivery) | ⬜ blank → **dev mailbox** | `src/lib/mail.ts` |
| `SMTP_PORT` | Optional | Mail server port (587 / 465) | ✅ `587` | `src/lib/mail.ts` |
| `SMTP_USER` | Optional | SMTP username | ⬜ blank | `src/lib/mail.ts` |
| `SMTP_PASS` | Optional | SMTP password / app password | ⬜ blank | `src/lib/mail.ts` |
| `MAIL_FROM` | Optional | "From" address on outgoing mail | ✅ set | `src/lib/mail.ts` |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth login | ⬜ blank → Google button disabled | `src/app/api/auth/google/*` |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth login | ⬜ blank | `src/app/api/auth/google/callback` |
| `STRIPE_SECRET_KEY` | Optional | Payments / plan checkout | ⬜ blank → checkout returns 503 | `src/lib/stripe.ts`, checkout route |
| `STRIPE_WEBHOOK_SECRET` | Optional | Verifies Stripe webhook signature | ⬜ blank | `src/app/api/stripe/webhook` |
| `STRIPE_PRICE_QUARTERLY` | Optional | Stripe Price ID for ₹299 plan | ⬜ blank → inline price used | `src/config/plans.ts`, checkout |
| `STRIPE_PRICE_YEARLY` | Optional | Stripe Price ID for ₹999 plan | ⬜ blank | checkout |
| `STRIPE_PRICE_LIFETIME` | Optional | Stripe Price ID for ₹1999 plan | ⬜ blank | checkout |

**Legend:** ✅ set · ⚠️ set but must change before production · ⬜ not set (feature gracefully degrades)

---

## 2. What works without any keys (current dev state)

- ✅ All 25 bill generators, templates, themes, currencies, PDF download, print.
- ✅ Sign up / Sign in with **email + password**.
- ✅ **Email OTP** login — with no SMTP set, the 6-digit code is shown in the modal
  (`Dev mode: your code is …`) and written to `./.mailbox/` + the server console.
- ✅ Save bills, My Bills, My Account (profile, change password, plan/billing UI).
- ⬜ **Google login** — needs Google keys (§4).
- ⬜ **Real email delivery** (OTP + "email this bill") — needs SMTP (§3).
- ⬜ **Payments / billing history population** — needs Stripe (§5).

**Test account (dev):** `demo@bill.test` / `demo1234`

---

## 3. Email (SMTP) — to send real OTP codes & bill emails

Without SMTP, mail is saved to `./.mailbox/*.html` and logged to the console (fine for dev).
To send for real, set these in `.env`:

```
SMTP_HOST="smtp.yourprovider.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password-or-app-password"
MAIL_FROM="Bill Generator <no-reply@yourdomain.com>"
```

- **Gmail:** enable 2FA → create an *App Password* → use it as `SMTP_PASS`, port `587`.
- **Transactional providers** (recommended for prod): SendGrid, Mailgun, Amazon SES, Postmark — use the SMTP credentials they give you.

---

## 4. Google OAuth — to enable "Continue with Google"

1. Go to **Google Cloud Console → APIs & Services → Credentials**.
2. **Create Credentials → OAuth client ID → Web application**.
3. **Authorized redirect URI** (must match exactly):
   - Local: `http://localhost:4040/api/auth/google/callback`
   - Prod: `https://YOUR_DOMAIN/api/auth/google/callback`
4. Copy the Client ID + Secret into `.env`:
   ```
   GOOGLE_CLIENT_ID="xxxxxxxx.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="xxxxxxxx"
   ```
5. Restart. The Google button now completes the flow. (If unset, it bounces back with `?auth_error=google_not_configured`.)

---

## 5. Stripe — to enable plan checkout & billing history

Plans: Quarterly ₹299 · Yearly ₹999 · Lifetime ₹1999 (defined in `src/config/plans.ts`).

1. **Stripe Dashboard → Developers → API keys** → copy the **Secret key** (use a **test** key first, `sk_test_…`):
   ```
   STRIPE_SECRET_KEY="sk_test_..."
   ```
2. *(Optional but recommended)* Create 3 **Products/Prices** in INR and put their Price IDs in:
   ```
   STRIPE_PRICE_QUARTERLY="price_..."
   STRIPE_PRICE_YEARLY="price_..."
   STRIPE_PRICE_LIFETIME="price_..."
   ```
   If left blank, the app builds the price inline from `src/config/plans.ts` (still works).
3. **Webhook** (so a successful payment records a Subscription + Payment):
   - Endpoint URL: `https://YOUR_DOMAIN/api/stripe/webhook` (locally use `stripe listen --forward-to localhost:4040/api/stripe/webhook`).
   - Event: `checkout.session.completed`.
   - Copy the signing secret:
   ```
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```
4. Restart. The **Upgrade** buttons (pricing page + My Account → Plan & Billing) now open Stripe Checkout, and **Payment history** fills in after a successful test payment.

> Note: the original site (billgenerator.org) appears to target Indian payments (UPI/cards). If you need UPI/RuPay/netbanking, confirm your Stripe account/region supports them, or swap to **Razorpay** later (the checkout layer is isolated in `src/app/api/stripe/` + `src/config/plans.ts`).

---

## 6. Production checklist

Tick these before going live:

- [ ] **`AUTH_SECRET`** — set a strong random value: `openssl rand -base64 48`.
- [ ] **Database** — switch `prisma/schema.prisma` `provider` to `postgresql`, set a Postgres `DATABASE_URL`, run `npx prisma db push` (or migrations).
- [ ] **`APP_URL`** — set to the real https domain.
- [ ] **SMTP** — configure a transactional email provider (§3).
- [ ] **Google OAuth** — add the production redirect URI (§4).
- [ ] **Stripe** — switch to **live** keys, create live Prices, register the production webhook (§5).
- [ ] **Build** — `npm run build` then `npm start` (note: a full build needs free disk; see README).
- [ ] **Remove dev test accounts** from the database.
- [ ] Confirm OTP dev-code exposure is off in prod — it already is (codes are only returned in the API response when `NODE_ENV !== "production"`; see `src/app/api/auth/otp/request/route.ts`).
- [ ] Set real WhatsApp number + social links in `src/components/layout/`.

---

## 7. Where to change things (code map)

| Setting / behavior | File |
|---|---|
| Session cookie name / expiry / JWT | `src/lib/auth.ts` |
| Email transport + dev mailbox fallback | `src/lib/mail.ts` |
| Stripe client + plan catalog | `src/lib/stripe.ts`, `src/config/plans.ts` |
| DB schema (User, Bill, Subscription, Payment, OtpCode) | `prisma/schema.prisma` |
| Generators catalog (add/rename) | `src/config/catalog.ts`, `src/config/generators/*` |
| Brand/pump/pharmacy logos | `public/brands/*`, `public/pharma/*` |
| Currencies (27) | `src/lib/currencies.ts` |
| Crumpled-paper themes (17) | `src/lib/themes.ts`, `public/crumpled/*` |

_Last updated: 2026-06-18._
