import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const db = getDb();
  const shop = await db.shop.findFirst({ where: { ownerId: session.user.id } });

  if (!shop) {
    return NextResponse.redirect(new URL("/app/onboarding", request.url));
  }

  await db.shop.update({
    where: { id: shop.id },
    data: {
      name: String(formData.get("name") || shop.name),
      accentColor: String(formData.get("accentColor") || shop.accentColor),
      logoUrl: String(formData.get("logoUrl") || "") || null,
      productionHoursPerWeek: Number(
        formData.get("productionHoursPerWeek") || shop.productionHoursPerWeek,
      ),
    },
  });

  return NextResponse.redirect(new URL("/app/settings", request.url));
}
