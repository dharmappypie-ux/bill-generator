# Bill Generator

A faithful, full-stack replica of [billgenerator.org](https://billgenerator.org/) — an online bill / invoice / receipt generator. Built with **Next.js 15 (App Router) + TypeScript + Tailwind**, a **real backend** (auth, persistence, email, payments), and a **config-driven generator engine**.

> For documentation/demo use only — not for fraudulent or unlawful purposes.

## What's implemented

**Marketing site (chrome + homepage)**
- Sticky header with a **Bills mega-dropdown** (all 22+ generators grouped by category), responsive mobile menu, auth-aware actions.
- Homepage: hero, 8 benefit cards, 3-step how-it-works, featured generators, why-choose + stats, pricing (₹299 / ₹999 / ₹1999 with coupons), 10-review testimonials carousel, FAQ accordion, CTA band.
- Footer (bill links, company, legal, social, "Digitrix Agency" attribution), sticky WhatsApp button.
- `/bills` catalog, `/pricing`, `/contact`, `/legal/{privacy,terms,refund,disclaimer}`, `/dashboard` (saved bills).

**Generators (vertical slice)** — driven by a config + preview registry, so adding the other 20 is data, not code:
- **Fuel Bill** — ~30 fields, **6 templates**, **17 themes**, **27 currencies**, brand logos (Indian Oil / BPCL / HPCL / Essar), normal/**crumpled** paper, live preview.
- **Rent Receipt** — 3 templates, HRA-style.
- Toolbar: **Download PDF** (client-side html2canvas + jsPDF), **Email** (PDF attachment via API), **Save / Update** (to your account), **Print**, **Clear**, and load a saved bill via `?load=<id>`.
- The other 22+ generators are listed everywhere and render a "being set up" page that points to the live ones.

**Backend (real)**
- **Auth**: email+password (bcrypt), passwordless **email OTP**, **Google OAuth** — sessions are signed JWTs (`jose`) in an httpOnly cookie.
- **Persistence**: Prisma + SQLite (`User`, `OtpCode`, `Bill`, `Subscription`). Bills sync across devices.
- **Email**: nodemailer; with no SMTP configured it writes to `./.mailbox/*.html` and logs OTP codes to the console (fully testable offline).
- **Payments**: Stripe Checkout for the three plans + webhook to activate the subscription; demo coupons (`WELCOME10`, `SAVE20`, `BILL50`). All payment UI degrades gracefully when Stripe isn't configured.

## Getting started

This project requires **Node 18.18+** (an `.nvmrc` pins Node 20).

```bash
nvm use            # -> Node 20
npm install
cp .env.example .env   # (a working dev .env is already included)
npm run db:push        # create the SQLite database
npm run dev            # http://localhost:4040
```

### Auth/email/payments in dev
- **OTP & email work with zero config**: codes/emails are saved to `./.mailbox/` and printed to the server console.
- **Google login**: set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (redirect URI `http://localhost:4040/api/auth/google/callback`).
- **Stripe**: set `STRIPE_SECRET_KEY` (+ optional `STRIPE_PRICE_*`) and run a webhook listener to `/api/stripe/webhook`.

See `.env.example` for every variable.

## Architecture notes

- **Add a generator**: drop a `GeneratorConfig` in `src/config/generators/`, register it in `src/config/catalog.ts`, and add a preview component to `src/components/generator/previewRegistry.ts`. The form UI is generated from the config's `fields`.
- **Design tokens** (lifted from the original site) live in `tailwind.config.ts` and `src/app/globals.css`: brand purple `#af78d4`, indigo `#4154b9`, orange CTA `#ff8c00`, lavender sections `#f4f5fc`, Montserrat.
- **Production DB**: switch `prisma/schema.prisma` `provider` to `postgresql` and point `DATABASE_URL` at Postgres.

## Scripts
`dev` · `build` · `start` · `db:push` · `db:generate` · `db:studio` · `lint`

## Not yet built (next steps)
- The remaining ~20 generators (cab, Uber/Ola, flight, GST invoice, restaurant, hotel, medical, …) — each is now ~1 config + 1 preview file.
- Real coupon objects in Stripe; subscription cancel/renew lifecycle; contact-form backend.
