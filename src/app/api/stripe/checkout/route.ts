import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getStripe, stripeEnabled, PLANS, COUPONS, PlanId } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const appUrl = process.env.APP_URL || "http://localhost:4040";

  if (!stripeEnabled()) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Add STRIPE_SECRET_KEY to enable checkout." },
      { status: 503 }
    );
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to upgrade." }, { status: 401 });

  try {
    const { planId, coupon } = (await req.json()) as { planId: PlanId; coupon?: string };
    const plan = PLANS[planId];
    if (!plan) return NextResponse.json({ error: "Unknown plan." }, { status: 400 });

    const stripe = getStripe();
    const envPriceId = process.env[plan.priceEnv as keyof NodeJS.ProcessEnv] as string | undefined;

    // Apply a demo coupon as a percentage discount on inline pricing.
    const discountPct = coupon ? COUPONS[coupon.trim().toUpperCase()] ?? 0 : 0;
    const amount = Math.round(plan.amount * (1 - discountPct / 100));

    const lineItem = envPriceId
      ? { price: envPriceId, quantity: 1 }
      : {
          price_data: {
            currency: "inr",
            unit_amount: amount,
            product_data: { name: `Bill Generator — ${plan.name} (${plan.duration})` },
            ...(plan.mode === "subscription"
              ? { recurring: { interval: plan.id === "yearly" ? "year" : "month" as const } }
              : {}),
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      mode: plan.mode,
      line_items: [lineItem as any],
      customer_email: user.email,
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancel`,
      metadata: { userId: user.id, planId: plan.id, coupon: coupon || "" },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Could not start checkout." }, { status: 500 });
  }
}
