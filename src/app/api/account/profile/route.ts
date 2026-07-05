import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Update the current user's editable profile fields (name, mobile).
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const data: { name?: string; mobile?: string } = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string") {
        return NextResponse.json({ error: "Invalid name." }, { status: 400 });
      }
      const name = body.name.trim();
      if (name.length > 80) {
        return NextResponse.json({ error: "Name must be 80 characters or fewer." }, { status: 400 });
      }
      data.name = name;
    }

    if (body.mobile !== undefined) {
      if (typeof body.mobile !== "string") {
        return NextResponse.json({ error: "Invalid mobile number." }, { status: 400 });
      }
      const mobile = body.mobile.trim();
      if (mobile.length > 20) {
        return NextResponse.json({ error: "Mobile must be 20 characters or fewer." }, { status: 400 });
      }
      data.mobile = mobile;
    }

    const user = await prisma.user.update({
      where: { id: session.uid },
      data,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        image: user.image,
        provider: user.provider,
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  }
}
