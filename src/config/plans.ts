// Client-safe plan catalog (no server-only imports) — shared by the marketing
// pricing section, the /pricing page, and the Stripe checkout route.

export const PLANS = {
  quarterly: {
    id: "quarterly",
    name: "Quarterly",
    priceLabel: "₹299",
    amount: 29900, // paise
    duration: "3 months",
    months: 3,
    priceEnv: "STRIPE_PRICE_QUARTERLY",
    mode: "subscription" as const,
    features: [
      "Unlimited bills for 3 months",
      "All 22+ generators & templates",
      "Logo & brand customization",
      "PDF download + email delivery",
    ],
  },
  yearly: {
    id: "yearly",
    name: "Yearly",
    priceLabel: "₹999",
    amount: 99900,
    duration: "1 year",
    months: 12,
    priceEnv: "STRIPE_PRICE_YEARLY",
    mode: "subscription" as const,
    popular: true,
    features: [
      "Everything in Quarterly",
      "Unlimited bills for 12 months",
      "Priority email support",
      "Saved bills across all devices",
    ],
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime",
    priceLabel: "₹1999",
    amount: 199900,
    duration: "Lifetime",
    months: 0,
    priceEnv: "STRIPE_PRICE_LIFETIME",
    mode: "payment" as const,
    features: [
      "Everything in Yearly",
      "One-time payment, forever access",
      "All future templates included",
      "24/7 chat, email & phone support",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;

export const PLAN_LIST = [PLANS.quarterly, PLANS.yearly, PLANS.lifetime];

// Demo coupon table (real coupons would live in Stripe).
export const COUPONS: Record<string, number> = {
  WELCOME10: 10,
  SAVE20: 20,
  BILL50: 50,
};
