import { NextRequest, NextResponse } from "next/server";
import { COUPONS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const key = String(code || "").trim().toUpperCase();
  const percent = COUPONS[key];
  if (!percent) {
    return NextResponse.json({ valid: false, error: "Invalid or expired coupon." }, { status: 200 });
  }
  return NextResponse.json({ valid: true, code: key, percent });
}
