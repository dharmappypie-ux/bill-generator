import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/repo";
import { hashPassword, startSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, mobile, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const existing = await getUserByEmail(String(email).toLowerCase());
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const user = await createUser({
      email: String(email).toLowerCase(),
      name: name || null,
      mobile: mobile || null,
      passwordHash: await hashPassword(String(password)),
      provider: "credentials",
    });

    await startSession({ uid: user.id, email: user.email, name: user.name });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
