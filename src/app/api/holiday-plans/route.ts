import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";

const schema = z.object({
  holidayType: z.enum(["Q4", "VALENTINES", "MOTHERS_DAY"]),
  shippingCutoffDate: z.string(),
  targetOrders: z.number(),
  itemsPerOrder: z.number(),
  minutesPerItem: z.number(),
  weeklyBatchTargets: z.array(
    z.object({
      weekStart: z.string(),
      weekEnd: z.string(),
      ordersTarget: z.number(),
      itemsTarget: z.number(),
      minutesTarget: z.number(),
    }),
  ),
  productionStartDate: z.string().or(z.date()),
  materialOrderDate: z.string().or(z.date()),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const db = getDb();
  const shop = await db.shop.findFirst({ where: { ownerId: session.user.id } });
  if (!shop) {
    return NextResponse.json({ error: "Shop missing" }, { status: 404 });
  }

  const plan = await db.holidayPlan.upsert({
    where: {
      shopId_holidayType: {
        shopId: shop.id,
        holidayType: parsed.data.holidayType,
      },
    },
    update: {
      shippingCutoffDate: new Date(parsed.data.shippingCutoffDate),
      targetOrders: parsed.data.targetOrders,
      itemsPerOrder: parsed.data.itemsPerOrder,
      minutesPerItem: parsed.data.minutesPerItem,
      productionStartDate: new Date(parsed.data.productionStartDate),
      materialOrderDate: new Date(parsed.data.materialOrderDate),
      weeklyBatchTargets: parsed.data.weeklyBatchTargets,
    },
    create: {
      shopId: shop.id,
      holidayType: parsed.data.holidayType,
      shippingCutoffDate: new Date(parsed.data.shippingCutoffDate),
      targetOrders: parsed.data.targetOrders,
      itemsPerOrder: parsed.data.itemsPerOrder,
      minutesPerItem: parsed.data.minutesPerItem,
      productionStartDate: new Date(parsed.data.productionStartDate),
      materialOrderDate: new Date(parsed.data.materialOrderDate),
      weeklyBatchTargets: parsed.data.weeklyBatchTargets,
    },
  });

  return NextResponse.json({ ok: true, plan });
}
