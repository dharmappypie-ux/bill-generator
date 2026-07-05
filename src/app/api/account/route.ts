import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Load the current user's account overview: profile, active subscription, recent payments.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      include: {
        subscription: true,
        payments: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subscription =
      user.subscription && user.subscription.status === "active"
        ? {
            plan: user.subscription.plan,
            status: user.subscription.status,
            currentPeriodEnd: user.subscription.currentPeriodEnd,
          }
        : null;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        image: user.image,
        provider: user.provider,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        hasPassword: Boolean(user.passwordHash),
      },
      subscription,
      payments: user.payments.map((p) => ({
        id: p.id,
        plan: p.plan,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        createdAt: p.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Could not load account." }, { status: 500 });
  }
}
