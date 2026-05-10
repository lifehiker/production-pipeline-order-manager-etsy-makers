import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";

const schema = z.object({
  status: z
    .enum(["INQUIRY", "CONFIRMED", "IN_PRODUCTION", "COMPLETE", "SHIPPED"])
    .optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const db = getDb();
  const order = await db.order.update({
    where: { id: orderId },
    data: {
      status: parsed.data.status,
      notes: parsed.data.notes,
    },
  });

  return NextResponse.json({
    ok: true,
    order: {
      ...order,
      dueDate: order.dueDate?.toISOString() || null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    },
  });
}
