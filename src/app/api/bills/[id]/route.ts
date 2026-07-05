import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const bill = await prisma.bill.findFirst({ where: { id, userId: session.uid } });
  if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ bill: { ...bill, data: JSON.parse(bill.data) } });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const owned = await prisma.bill.findFirst({ where: { id, userId: session.uid } });
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const bill = await prisma.bill.update({
    where: { id },
    data: {
      title: body.title ?? owned.title,
      template: body.template ?? owned.template,
      theme: body.theme ?? owned.theme,
      currency: body.currency ?? owned.currency,
      data: body.data ? JSON.stringify(body.data) : owned.data,
    },
  });
  return NextResponse.json({ bill: { id: bill.id } });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const owned = await prisma.bill.findFirst({ where: { id, userId: session.uid } });
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.bill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
