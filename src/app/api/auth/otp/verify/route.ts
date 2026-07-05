import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOtp, startSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
    }
    const normalized = String(email).toLowerCase();

    const record = await prisma.otpCode.findFirst({
      where: { email: normalized, consumed: false, purpose: "login" },
      orderBy: { createdAt: "desc" },
    });
    if (!record) {
      return NextResponse.json({ error: "No active code. Request a new one." }, { status: 400 });
    }
    if (record.expiresAt < new Date()) {
      return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }
    if (record.attempts >= 5) {
      await prisma.otpCode.update({ where: { id: record.id }, data: { consumed: true } });
      return NextResponse.json({ error: "Too many attempts. Request a new code." }, { status: 429 });
    }

    const ok = await verifyOtp(String(code), record.codeHash);
    if (!ok) {
      await prisma.otpCode.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
      return NextResponse.json({ error: "Incorrect code." }, { status: 401 });
    }

    await prisma.otpCode.update({ where: { id: record.id }, data: { consumed: true } });

    // Create the user on first OTP login (passwordless signup).
    const user = await prisma.user.upsert({
      where: { email: normalized },
      update: { emailVerified: true },
      create: { email: normalized, provider: "otp", emailVerified: true },
    });

    await startSession({ uid: user.id, email: user.email, name: user.name });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch {
    return NextResponse.json({ error: "Could not verify code." }, { status: 500 });
  }
}
