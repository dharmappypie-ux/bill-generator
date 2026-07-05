import { NextRequest, NextResponse } from "next/server";
import { invalidateOtps, createOtp } from "@/lib/repo";
import { generateOtp, hashOtp } from "@/lib/auth";
import { sendMail, otpEmailHtml } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });
    const normalized = String(email).toLowerCase();

    const code = generateOtp();
    const codeHash = await hashOtp(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    // Invalidate prior unconsumed codes for this email, then store the new one.
    await invalidateOtps(normalized, "login");
    await createOtp(normalized, codeHash, "login", expiresAt);

    const { delivered } = await sendMail({
      to: normalized,
      subject: "Your Bill Generator sign-in code",
      html: otpEmailHtml(code),
      text: `Your verification code is ${code}. It expires in 10 minutes.`,
    });

    // In dev (no SMTP), surface the code so the flow is testable without a mailbox.
    const devHint = !delivered && process.env.NODE_ENV !== "production" ? { devCode: code } : {};
    return NextResponse.json({ ok: true, delivered, ...devHint });
  } catch {
    return NextResponse.json({ error: "Could not send code." }, { status: 500 });
  }
}
