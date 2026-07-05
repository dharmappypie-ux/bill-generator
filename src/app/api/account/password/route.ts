import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser } from "@/lib/repo";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";

// Set or change the current user's password.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const currentPassword: string | undefined =
      typeof body.currentPassword === "string" ? body.currentPassword : undefined;
    const newPassword: unknown = body.newPassword;

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const user = await getUserById(session.uid);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Existing password holders must verify their current password.
    if (user.passwordHash) {
      if (!currentPassword || !(await verifyPassword(currentPassword, user.passwordHash))) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 }
        );
      }
    }
    // OAuth/OTP accounts (no passwordHash) may set one without currentPassword.

    await updateUser(session.uid, { passwordHash: await hashPassword(newPassword) });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update password." }, { status: 500 });
  }
}
