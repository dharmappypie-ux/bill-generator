# Project Tasks & Status

Living checklist of what's built and what's next for the Bill Generator
(billgenerator.org replica). Tick items as they're completed. Keys/settings for any
of these live in **[CONFIGURATION.md](CONFIGURATION.md)**; the gap analysis vs the
original is in **[COMPARISON_REPORT.md](COMPARISON_REPORT.md)**.

---

## ✅ Done

**Foundation**
- [x] Next.js 15 (App Router) + TypeScript + Tailwind app, brand design tokens (purple/indigo/orange, Montserrat).
- [x] Prisma + SQLite DB; models: `User`, `OtpCode`, `Bill`, `Subscription`, `Payment`.
- [x] Auth: email+password, **email OTP**, **Google OAuth** (key-gated); JWT httpOnly session cookie.
- [x] Email layer (nodemailer) with dev mailbox fallback. Stripe checkout + webhook (key-gated).

**Site**
- [x] Header (Bills mega-menu of all generators), footer, WhatsApp button, auth modal (3 methods).
- [x] Homepage (hero, benefits, how-it-works, featured, pricing, testimonials, FAQ).
- [x] `/bills`, `/pricing`, `/contact`, `/legal/*`.
- [x] **Per-generator FAQ** on every generator page.

**Generators (25 total)**
- [x] Generator engine: config-driven form + live preview, **fit-to-width** scaling, multiple templates.
- [x] **Fuel Bill** — 6 templates, 17 crumpled-paper themes, 27 currencies, 4 pump logos, normal/crumpled, brand-specific headers/footers.
- [x] **Rent Receipt** — 4 templates incl. the **Classic blue receipt-book** form, ₹1 revenue stamp.
- [x] **23 more** via multi-agent build: cab, Uber, Ola, flight, LTA, internet, wifi, mobile, recharge, gym, restaurant, hotel, e-commerce, GST, general, stationery, mart, medical, book, driver-salary, daily-helper, school, donation.
- [x] **Line-items** field type (restaurant/GST/hotel/mart/medical/etc.).
- [x] **Medical Bill** pharmacy logo selector.
- [x] Toolbar: Download PDF, Email, Save, Print; `?template=` / `?theme=` deep-links.

**Account**
- [x] Save bills → `/dashboard` ("My Bills").
- [x] `/account` hub: **Profile** (edit name/mobile), **Security** (change/set password), **Plan & Billing** (plan status + upgrade + payment history).
- [x] APIs: `/api/account`, `/api/account/profile`, `/api/account/password`.

**Docs**
- [x] `README.md`, `CONFIGURATION.md`, `COMPARISON_REPORT.md`, this file.

---

## 🔑 Needs a key/setting to go live (see CONFIGURATION.md)
- [ ] **Google login** → `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
- [ ] **Real email** (OTP + "email this bill") → `SMTP_*`.
- [ ] **Payments + billing history** → `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*`.
- [ ] **Production hardening** → strong `AUTH_SECRET`, Postgres `DATABASE_URL`, real `APP_URL`.

---

## 🛠️ Roadmap / pending work

**P0 — correctness (from COMPARISON_REPORT.md)**
- [ ] GST invoice: add **CESS** + per-line **Place of Supply** to the tax engine.
- [ ] Re-probe the original `/mobile-bill` slug and field-audit it (was 404 on probe → currently unverified).

**P1 — feature parity**
- [ ] Restaurant: **Tax/VAT toggle** + stamp options.
- [ ] Hotel: **dual signatures** (Guest + Receptionist), per-line tax split.
- [ ] Fuel: confirm every niche field/enum matches the original 1:1.

**P2 — polish**
- [ ] Lock template counts per generator to match the original.
- [ ] More brand/store logo selectors (restaurant, hotel, mart, gym).
- [ ] Align a few display labels/slugs to the original ("Stationary", "Hotel-Room Bill", "Internet Invoice") for SEO.

**Account / UX enhancements**
- [ ] Sign-out confirmation + **Delete account**.
- [ ] Profile **avatar upload**.
- [ ] Wire **real Stripe test keys** so billing history populates end-to-end.
- [ ] Coupon objects in Stripe (currently demo coupons: `WELCOME10`, `SAVE20`, `BILL50`).

**Infra**
- [ ] Production deploy (Postgres + host); confirm disk for `next build`.
- [ ] Consider Razorpay/UPI if Indian payment methods are required.

---

## ▶️ Run / test locally
```bash
nvm use 20
npm install
npm run db:push          # create/refresh SQLite tables
npm run dev              # http://localhost:4040
```
- Test login: `demo@bill.test` / `demo1234`, or Sign Up (email + 6+ char password), or Email OTP (code shown in the modal in dev).
- Check session: visit `/api/auth/me`.

_Last updated: 2026-06-18._
