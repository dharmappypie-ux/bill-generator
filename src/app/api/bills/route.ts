import { NextRequest, NextResponse } from "next/server";
import { listBills, createBill } from "@/lib/repo";
import { getSession } from "@/lib/auth";

// List the signed-in user's saved bills.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bills = await listBills(session.uid);
  return NextResponse.json({ bills });
}

// Create a new saved bill.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in to save bills." }, { status: 401 });

  try {
    const body = await req.json();
    const { type, title, template, theme, currency, data } = body;
    if (!type || !data) {
      return NextResponse.json({ error: "Missing bill type or data." }, { status: 400 });
    }
    const bill = await createBill({
      userId: session.uid,
      type: String(type),
      title: String(title || type),
      template: String(template || "template-1"),
      theme: String(theme || "default"),
      currency: String(currency || "INR"),
      data: JSON.stringify(data),
    });
    return NextResponse.json({ bill: { id: bill.id } });
  } catch {
    return NextResponse.json({ error: "Could not save bill." }, { status: 500 });
  }
}
