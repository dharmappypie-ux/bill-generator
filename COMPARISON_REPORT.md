# Bill Generator — Replica vs. Original (billgenerator.org) Gap Report

**Date:** 2026-06-18
**Reviewer:** QA analyst (automated comparison)
**Our build:** `/Applications/MAMP/htdocs/bill-generator`
**Reference site:** https://billgenerator.org/

---

## 0. Method & Source Reliability

Pages were fetched live from billgenerator.org and parsed. The fetch source for each claim is noted so you know what is verified vs. inferred.

| Page | URL | Fetch result | Used for |
|------|-----|--------------|----------|
| Homepage | `/` | OK | Generator list, site-wide features, pricing |
| Fuel Bill | `/fuel-bill` | OK | Field/template/theme/logo/currency parity |
| Rent Receipt | `/rent-receipt` | OK | Field/template/stamp parity |
| Restaurant Bill | `/restaurant-bill` | OK | Line-item/tax/template/stamp parity |
| GST Invoice | `/gst-invoice` | OK | GST tax model, templates |
| Hotel Bill | `/hotel-bill` (served as "Hotel-Room Bill") | OK | Fields, line items, templates |
| Mobile Bill | `/mobile-bill` | **404 Not Found** | Could not verify — see note below |

> **Explicit caveat on mobile-bill:** `/mobile-bill` returned HTTP 404. The homepage nav *does* list "Mobile Bill" as a generator, so the page exists under a different slug (likely `/mobile-bill-generator` or similar) that was not probed. **All mobile-bill comparison rows below are marked "UNVERIFIED — based on general knowledge of the original," not on a live fetch.** Treat them as provisional.
>
> Minor cross-page count inconsistencies reported by the parser (e.g. "26 currencies" on restaurant vs "27" on rent vs "29" on fuel) are almost certainly the same shared currency dropdown counted imperfectly by the page parser, not three different lists. Where the original and our build are both ~26–29, treat currency as **at parity** and do not over-index on the exact integer.

---

## 1. Executive Summary

Our build is at or **ahead of** the original on the two flagship generators (fuel-bill, rent-receipt) and matches the original's full generator catalog. The original site appears to offer **fewer templates per generator** and **fewer themes on most generators** than the homepage marketing implies — its richness is concentrated in fuel-bill, exactly like ours.

The **most material gaps** are not coverage gaps (we have every generator the original lists) — they are **per-generator depth gaps** in the opposite direction we expected, plus a few **field-completeness gaps** on specialized bills. See §6 for the prioritized list.

---

## 2. Generator Coverage Gaps

### 2.1 Original site catalog (from homepage nav/footer)

Fuel Bill, Restaurant Bill, Hotel-Room Bill, Internet Invoice, Rent Receipt, Gym Bill, Medical Bill, Flight Bill, LTA Receipt, Mobile Bill, Book Invoice, Wifi Bill, E-Commerce Invoice, Mart Bill, Donation Receipt, Driver Salary, General Bill, GST Invoice, Cab Bill, Daily Helper, Recharge Bill, Stationary Bill, School Receipt. *(23 named on the homepage.)*

### 2.2 Coverage matrix

| Generator (original name) | On original? | In our build? | Notes |
|---|---|---|---|
| Fuel Bill | Yes | **Yes** | Flagship; our depth ≥ theirs |
| Rent Receipt | Yes | **Yes** | We have 3 templates vs their 2 |
| Restaurant Bill | Yes | **Yes** | |
| Hotel / Hotel-Room Bill | Yes | **Yes** | |
| Internet Invoice / Internet Bill | Yes | **Yes** (`internet-bill`) | Confirm slug/label match (§5) |
| Gym Bill | Yes | **Yes** | |
| Medical Bill | Yes | **Yes** | |
| Flight Bill | Yes | **Yes** | |
| LTA Receipt | Yes | **Yes** | |
| Mobile Bill | Yes | **Yes** | Original page 404'd on our probe |
| Book Invoice | Yes | **Yes** (`book-invoice`) | |
| Wifi Bill | Yes | **Yes** | |
| E-Commerce Invoice | Yes | **Yes** (`ecommerce-invoice`) | |
| Mart Bill | Yes | **Yes** | |
| Donation Receipt | Yes | **Yes** | |
| Driver Salary | Yes | **Yes** | |
| General Bill | Yes | **Yes** | |
| GST Invoice | Yes | **Yes** | |
| Cab Bill | Yes | **Yes** | |
| Daily Helper | Yes | **Yes** | |
| Recharge Bill | Yes | **Yes** | |
| Stationary Bill | Yes | **Yes** (`stationery-bill`) | Spelling differs (§5) |
| School Receipt | Yes | **Yes** | |
| **Uber Bill** | Not separately listed | **Yes** | **We are ahead** — likely folded into Cab Bill on original |
| **Ola Bill** | Not separately listed | **Yes** | **We are ahead** — likely folded into Cab Bill on original |

**Coverage verdict:** **No coverage gap.** We cover 100% of the original's homepage-listed generators and add 2 extra (Uber, Ola). The only open question is whether the original has additional generators reachable only from deeper pages that aren't on the homepage nav — worth a follow-up crawl.

---

## 3. Per-Generator Field / Template / Feature Differences (fetched pages only)

### 3.1 Fuel Bill — VERIFIED

| Aspect | Original | Our build | Verdict |
|---|---|---|---|
| Templates | 6 | 6 | **Match** |
| Themes (crumpled-paper photos) | 17 | 17 | **Match** |
| Normal / Crumpled variant | Yes | Yes | **Match** |
| Brand logos | Bharat Petroleum, Indian Oil, HP, Essar (4) | BP, Indian Oil, HP, Essar (4) | **Match** |
| Currency options | ~27–29 | 27 | **Match** (parser variance) |
| Vehicle Type options | Diesel, Petrol, CNG, Electric | confirm | Check ours includes CNG + Electric |
| Receipt Type | Physical, Digital, E-Receipt | confirm | Verify present |
| Preset Type | Local, Interstate, Export, Retail, Wholesale | confirm | Verify present |
| Tax label options | CST TIN / GST TIN / TXN NO / TIN No | confirm | Verify selectable label |
| Density field (740–770) | Yes | confirm | Niche but visible on original |
| Bay/Nozzle/FIP/FCC/Attendant IDs | Yes | confirm | Verify all 5 present |
| Bank Image toggle | Yes | confirm | Verify |

**Verdict:** Structurally at parity. **Action:** field-level audit to confirm the dropdown enumerations (Vehicle Type, Receipt Type, Preset Type, Tax label) and the niche IDs (FIP/FCC/Attendant/Density/Bank-image toggle) all exist in our fuel-bill form.

### 3.2 Rent Receipt — VERIFIED

| Aspect | Original | Our build | Verdict |
|---|---|---|---|
| Templates | 2 | **3** | **We are ahead** |
| Revenue stamp | Yes (Re.1, shown in preview) | Yes (Re.1) | **Match** |
| Currency options | 27 | 27 | **Match** |
| "Received By" dropdown | Manager / Landlord | confirm | Verify both options |
| Signature URL + upload | Yes | confirm | Verify upload path |
| Month dropdown (Jan–Dec) | Yes | confirm | Verify |

**Verdict:** We meet or beat the original. Confirm "Received By" enum and signature upload.

### 3.3 Restaurant Bill — VERIFIED

| Aspect | Original | Our build | Verdict |
|---|---|---|---|
| Templates | 4 | confirm | **Verify count** |
| Normal / Crumpled | Yes | confirm | Verify crumpled offered here |
| Themes | 17 | confirm | **Verify count** |
| Stamp options | 5 + None | confirm | **Likely gap** — verify we have 5 stamps |
| Line-item columns | Description, Item Price, Qty, Total, Action | confirm | Verify |
| Tax Mode | Tax **or VAT** toggle | confirm | **Likely gap** — verify VAT mode exists |
| Service Charge | Yes | confirm | Verify |
| KOT No. (Kitchen Order Ticket) | Yes | confirm | Niche — verify |
| Waiter Number / Table No | Yes | confirm | Verify |
| Comment 1 / Comment 2 / Comment | Yes (3 comment fields) | confirm | Verify |
| GST No. | Yes | confirm | Verify |

**Verdict:** Watch **stamp count (5+None)**, **Tax/VAT toggle**, and **KOT No.** — these are the fields most likely missing in a fresh build.

### 3.4 GST Invoice — VERIFIED

| Aspect | Original | Our build | Verdict |
|---|---|---|---|
| Templates | 3 | confirm | Verify count |
| Tax model | Per-line **IGST / SGST / CGST / CESS** | confirm | **Critical** — verify all 4, incl. **CESS** |
| Seller GSTIN + Buyer GSTIN | Yes | confirm | Verify both |
| Place of Supply (state dropdown) | Yes | confirm | **Important for GST correctness** |
| State dropdowns (all Indian states) ×3 | Yes (seller, buyer, place-of-supply) | confirm | Verify |
| Due Date | Yes | confirm | Verify |
| HSN code | Shown in preview, not clearly an input | confirm | Verify whether ours exposes HSN input |
| Currency selector | Not shown (INR assumed) | confirm | Original may *not* have currency here |
| T&C checkbox | Yes | confirm | Verify |

**Verdict:** The GST tax engine (IGST/SGST/CGST + **CESS**, per-line) and **Place of Supply** are the correctness-critical items. CESS and Place-of-Supply are the two most commonly omitted.

### 3.5 Hotel / Hotel-Room Bill — VERIFIED

| Aspect | Original | Our build | Verdict |
|---|---|---|---|
| Templates | **1** | confirm | Original is shallow here; match or exceed |
| Themes / Crumpled | None | confirm | Original has none |
| Line-item columns | Description, Price/Night, Total Nights, Tax %, Total, Action | confirm | Verify per-line **Tax %** |
| Per-line tax → CGST/SGST split in preview | Yes | confirm | Verify split rendering |
| Room Type | Executive / Standard / Suite / Deluxe | confirm | Verify enum |
| Guest Reg Card No / Reservation No | Yes | confirm | Niche — verify |
| Nationality (Indian/Other) | Yes | confirm | Verify |
| Guest **and** Receptionist signatures | Two signature fields | confirm | **Likely gap** — verify both |
| Payment Method incl. **Wallet** | Cash/Online/Card/Wallet | confirm | Verify Wallet option |
| Check-in/out date **and time** | Yes | confirm | Verify time fields |

**Verdict:** Original hotel page is shallow (1 template, no themes). Easy parity. Watch the **dual signatures** and **per-line tax → CGST/SGST split**.

### 3.6 Mobile Bill — UNVERIFIED (original page 404'd)

Could not fetch `/mobile-bill`. Based on general knowledge of the original and the pattern of sibling telco bills (wifi/internet/recharge), the original mobile-bill likely includes: carrier/operator selection, plan/tariff line items, billing period, account/relationship number, taxes, and 1–3 templates. **Do not treat this row as confirmed.** Re-probe the correct slug before drawing conclusions.

---

## 4. Site-Wide Functionality Parity Matrix

| Feature | Original | Our build | Verdict |
|---|---|---|---|
| Generators in nav/footer | 23 listed | 25+ | **We are ahead** (+Uber, +Ola) |
| Per-generator templates | Varies (1–6) | Varies | Parity where checked |
| Themes (Theme 1–17 = crumpled-paper photos) | 17 (fuel, restaurant) | 17 | **Match** |
| Crumpled paper toggle (thermal types) | Yes | Yes | **Match** |
| Currency selector | ~27 | 27 | **Match** |
| Brand logos (fuel) | 4 (BP/IOC/HP/Essar) | 4 | **Match** |
| Download PDF | Yes ("10 seconds") | Yes (html2canvas+jsPDF) | **Match** |
| Email bill (PDF attachment) | Yes | Yes | **Match** |
| Save bill to account | Yes (optional account) | Yes | **Match** |
| Print (isolated to receipt) | Not explicitly advertised | **Yes** | **We are ahead** (or at parity) |
| Auth: email + password | Yes | Yes | **Match** |
| Auth: email OTP | Yes (Submit OTP flow seen) | Yes | **Match** |
| Auth: Google OAuth | Yes | Yes | **Match** |
| Pricing tiers | ₹299 (3 mo) / ₹999 (1 yr) / ₹1999 (lifetime) | Rs299 / Rs999 / Rs1999 | **Match on price** — verify **duration labels** (3-month / 1-year / lifetime) |
| Coupons | Yes (Apply code) | Yes | **Match** |
| Payment processor | (unspecified on page) | Stripe | Verify original isn't Razorpay (India-focused); **possible mismatch** |
| WhatsApp button | Yes | Yes | **Match** |
| Legal pages | Implied | Yes | **Match** |
| Languages | English only (no switcher found) | English | **Match** |

**Two things to verify, not assume:**
1. **Plan duration semantics.** Prices match, but the original frames them as **3-month / 1-year / lifetime** "unlimited bills." Confirm our tiers carry the same durations and the "unlimited" framing, not just the same numbers.
2. **Payment processor.** The original is India-first (INR, GST, WhatsApp). Indian sites commonly use **Razorpay/PayU**. We use **Stripe**. Not a feature gap, but confirm Stripe supports the same Indian payment methods (UPI, RuPay, netbanking) your users expect.

---

## 5. Labeling / Slug Consistency Gaps

These won't break functionality but hurt 1:1 recognizability and SEO parity:

| Original label | Our slug/label | Recommendation |
|---|---|---|
| Stationary Bill | `stationery-bill` | Original uses the (mis)spelling "Stationary." Match their slug/label for SEO, or add a redirect/alias. |
| Internet Invoice | `internet-bill` | Confirm visible label reads the same as original ("Internet Invoice"). |
| Hotel-Room Bill | `hotel-bill` | Original label is "Hotel-Room Bill." Align display name or alias. |
| E-Commerce Invoice | `ecommerce-invoice` | Confirm hyphenation/casing of display label. |

---

## 6. Prioritized Gap List

> Priority = correctness/billing impact × likelihood it's actually missing in a fresh build. **P0 = fix before launch.**

| # | Priority | Gap / Risk | Affected generator(s) | Why it matters |
|---|---|---|---|---|
| 1 | **P0** | GST tax engine must include **CESS** alongside IGST/SGST/CGST, per-line, plus **Place of Supply** state | gst-invoice | Tax correctness; invoices are legally formatted documents |
| 2 | **P0** | Re-probe `/mobile-bill` correct slug and field-audit it | mobile-bill | We have *zero* verified data; could be silently broken or shallow |
| 3 | **P1** | Restaurant **Tax/VAT toggle** + **5 stamp options (+None)** | restaurant-bill | Visible, differentiating features on original |
| 4 | **P1** | Hotel **dual signatures** (Guest + Receptionist) and per-line **Tax % → CGST/SGST split** rendering | hotel-bill | Distinctive original behavior; easy to miss |
| 5 | **P1** | Fuel niche fields: **Density (740–770)**, FIP/FCC/Attendant IDs, **Bank Image toggle**, Vehicle Type incl. **CNG/Electric**, Preset Type enum | fuel-bill | Flagship page — must be 1:1 |
| 6 | **P2** | Confirm template counts match per generator (Restaurant 4, GST 3, Hotel 1) | multiple | Parity claim depends on counts |
| 7 | **P2** | Plan **duration labels** (3-mo / 1-yr / lifetime) + "unlimited" framing | pricing | Prices match; framing may not |
| 8 | **P2** | Restaurant **KOT No.**, Waiter No., 3 comment fields; Hotel Room-Type/Nationality/Reservation enums | restaurant, hotel | Field completeness |
| 9 | **P3** | Slug/label alignment ("Stationary", "Hotel-Room", "Internet Invoice") | multiple | SEO + recognizability, not function |
| 10 | **P3** | Verify Stripe covers expected Indian payment methods (UPI/RuPay/netbanking) | site-wide | UX/conversion in India, not a feature gap |
| 11 | **P3** | Confirm crumpled/themes are offered on the *same* generators as original (thermal types) | restaurant + thermal bills | Avoid over- or under-offering vs original |

---

## 7. Where We Are Ahead of the Original

- **+2 generators**: Uber Bill, Ola Bill (original appears to fold ride bills into a single Cab Bill).
- **Rent Receipt: 3 templates** vs the original's 2.
- **Print isolated to the receipt** — a clean, explicitly-built feature; original does not advertise it.
- Full **17-theme / crumpled** richness preserved on fuel-bill, matching the original's deepest page.

---

## 8. Concrete Recommendations

1. **Run a field-level diff script per generator.** This report confirms structural parity; the remaining risk is enumerated dropdown values and niche fields (CESS, Density, Tax/VAT, Wallet, dual signatures). A quick form-field audit against each fetched page closes ~80% of open "confirm" items above.
2. **Fix the GST invoice tax model first** (CESS + Place of Supply, per-line) — it's the only item with legal-correctness impact.
3. **Re-crawl the correct mobile-bill slug** and any homepage-absent generators before claiming 100% parity. Also do a deeper crawl to confirm the original has no generators beyond the 23 on its homepage.
4. **Align display labels/slugs** to the original's exact (even misspelled) names, or add aliases/redirects, to protect SEO and 1:1 recognizability.
5. **Verify pricing *framing***, not just numbers — duration + "unlimited bills" wording.
6. **Confirm the payment rail** matches Indian user expectations; if the original uses Razorpay/UPI, ensure our Stripe setup exposes equivalent methods.
7. **Lock template counts** per generator to the verified originals (Restaurant 4, GST 3, Hotel 1, Fuel 6, Rent 2→we have 3) so "parity" is measurable.

---

*Limitations: 6 of 7 target pages fetched cleanly; `/mobile-bill` 404'd and is explicitly unverified. Many "Our build" cells are marked "confirm" because this comparison is against the original's live forms plus our build's stated spec, not a live crawl of our own forms — a same-method fetch of our deployed pages would let every "confirm" become a hard verdict.*
