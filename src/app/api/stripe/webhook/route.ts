import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe, stripeEnabled, PLANS, PlanId } from "@/lib/stripe";

// Stripe requires the raw body for signature verification.
export async function POST(req: NextRequest) {
  if (!stripeEnabled()) return NextResponse.json({ ok: true });

  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  let event: any;
  try {
    event = secret && sig ? stripe.webhooks.constructEvent(raw, sig, secret) : JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId as PlanId | undefined;
    if (userId && planId && PLANS[planId]) {
      const months = PLANS[planId].months;
      const currentPeriodEnd =
        months > 0 ? new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000) : null;

      // Record the payment for billing history.
      await prisma.payment.create({
        data: {
          userId,
          plan: planId,
          amount: Number(session.amount_total ?? PLANS[planId].amount),
          currency: String(session.currency ?? "inr"),
          status: "paid",
          stripeSessionId: session.id,
        },
      });

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan: planId,
          status: "active",
          stripeCustomerId: session.customer ?? undefined,
          stripeSessionId: session.id,
          stripeSubscriptionId: session.subscription ?? undefined,
          currentPeriodEnd,
        },
        create: {
          userId,
          plan: planId,
          status: "active",
          stripeCustomerId: session.customer ?? null,
          stripeSessionId: session.id,
          stripeSubscriptionId: session.subscription ?? null,
          currentPeriodEnd,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
