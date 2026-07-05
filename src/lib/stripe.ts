import "server-only";
import Stripe from "stripe";

export { PLANS, COUPONS, PLAN_LIST } from "@/config/plans";
export type { PlanId } from "@/config/plans";

export const stripeEnabled = () => Boolean(process.env.STRIPE_SECRET_KEY);

let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}
