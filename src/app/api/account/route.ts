import { NextResponse } from "next/server";
import { getUserById, getSubscription, listPayments } from "@/lib/repo";
import { getSession } from "@/lib/auth";

// Load the current user's account overview: profile, active subscription, recent payments.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await getUserById(session.uid);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [sub, payments] = await Promise.all([
      getSubscription(user.id),
      listPayments(user.id, 50),
    ]);

    const subscription =
      sub && sub.status === "active"
        ? {
            plan: sub.plan,
            status: sub.status,
            currentPeriodEnd: sub.currentPeriodEnd,
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
      payments,
    });
  } catch {
    return NextResponse.json({ error: "Could not load account." }, { status: 500 });
  }
}
