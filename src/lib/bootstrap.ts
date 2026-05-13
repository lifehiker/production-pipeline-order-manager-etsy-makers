import { SubscriptionStatus } from "@prisma/client";

import { PRODUCT_TYPE_DEFAULTS } from "@/lib/constants";
import { getDb } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function ensureDemoUserScaffold(userId: string) {
  const db = getDb();
  const existingShop = await db.shop.findFirst({
    where: { ownerId: userId },
  });

  if (existingShop) {
    return existingShop;
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return null;
  }

  await db.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: SubscriptionStatus.TRIALING,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  const baseSlug = slugify(user.name || "maker shop");
  const productTypeOptions = PRODUCT_TYPE_DEFAULTS.slice(0, 5).map((type) => type.name);
  const shop = await db.shop.create({
    data: {
      ownerId: userId,
      name: user.name ? `${user.name}'s Shop` : "Maker Demo Shop",
      slug: `${baseSlug || "maker-shop"}-${userId.slice(-5)}`,
      accentColor: "#D05A36",
      productionHoursPerWeek: 20,
      productTypes: {
        create: PRODUCT_TYPE_DEFAULTS.slice(0, 5).map((type) => ({
          name: type.name,
          slug: type.slug,
          productionMinutesPerUnit: type.productionMinutesPerUnit,
        })),
      },
      intakeForms: {
        create: {
          name: "Custom Orders",
          slug: `${baseSlug || "maker-shop"}-custom-orders-${userId.slice(-4)}`,
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
              label: "What would you like made?",
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
              id: "needed-by",
              type: "date",
              label: "Need by",
              required: false,
            },
          ],
        },
      },
    },
  });

  return shop;
}
