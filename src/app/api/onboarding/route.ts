import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const schema = z.object({
  shopName: z.string().min(2),
  accentColor: z.string().min(4),
  weeklyHours: z.number().min(1).max(168),
  logoUrl: z.string().optional(),
  notes: z.string().optional(),
  productTypes: z.array(
    z.object({
      name: z.string(),
      slug: z.string(),
      productionMinutesPerUnit: z.number().min(1),
    }),
  ),
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
  const baseSlug = slugify(parsed.data.shopName);
  const existingShops = await db.shop.count({
    where: { slug: { startsWith: baseSlug } },
  });
  const productTypeOptions = parsed.data.productTypes.map((type) => type.name);

  const shop = await db.shop.create({
    data: {
      ownerId: session.user.id,
      name: parsed.data.shopName,
      slug: existingShops ? `${baseSlug}-${existingShops + 1}` : baseSlug,
      accentColor: parsed.data.accentColor,
      productionHoursPerWeek: parsed.data.weeklyHours,
      logoUrl: parsed.data.logoUrl || null,
      productTypes: {
        create: parsed.data.productTypes,
      },
      intakeForms: {
        create: {
          name: "Custom Orders",
          slug: `${baseSlug}-custom-orders`,
          fields: [
            {
              id: "customer-name",
              type: "text",
              label: "Customer name",
              required: true,
            },
            {
              id: "customer-email",
              type: "text",
              label: "Customer email",
              required: true,
            },
            {
              id: "item-description",
              type: "textarea",
              label: "Order details",
              required: true,
            },
            {
              id: "product-type",
              type: "select",
              label: "Product type",
              required: true,
              options: productTypeOptions,
            },
            {
              id: "quantity",
              type: "number",
              label: "Quantity",
              required: true,
            },
            {
              id: "due-date",
              type: "date",
              label: "Needed by",
              required: false,
            },
          ],
        },
      },
    },
  });

  await db.user.update({
    where: { id: session.user.id },
    data: { onboardedAt: new Date() },
  });

  return NextResponse.json({ ok: true, shopId: shop.id });
}
