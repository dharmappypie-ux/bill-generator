import { NextRequest, NextResponse } from "next/server";
import { getBill, updateBill, deleteBill } from "@/lib/repo";
import { getSession } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const bill = await getBill(id, session.uid);
  if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ bill: { ...bill, data: JSON.parse(bill.data) } });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const owned = await getBill(id, session.uid);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  await updateBill(id, {
    title: body.title ?? owned.title,
    template: body.template ?? owned.template,
    theme: body.theme ?? owned.theme,
    currency: body.currency ?? owned.currency,
    data: body.data ? JSON.stringify(body.data) : owned.data,
  });
  return NextResponse.json({ bill: { id } });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const owned = await getBill(id, session.uid);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteBill(id);
  return NextResponse.json({ ok: true });
}
