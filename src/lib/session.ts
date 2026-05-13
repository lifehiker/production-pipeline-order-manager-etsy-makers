import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const db = getDb();
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      ownedShops: {
        include: {
          productTypes: true,
          intakeForms: true,
        },
      },
      memberships: {
        include: {
          shop: {
            include: {
              productTypes: true,
              intakeForms: true,
              members: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requirePrimaryShop() {
  const user = await requireUser();
  const shop = await getPrimaryShopForUserId(user.id);

  if (!shop) {
    redirect("/app/onboarding");
  }

  return { user, shop };
}

export async function getPrimaryShopForUserId(userId: string) {
  const db = getDb();
  return db.shop.findFirst({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      owner: true,
      productTypes: true,
      intakeForms: true,
      members: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function userCanAccessShop(userId: string, shopId: string) {
  const db = getDb();
  const count = await db.shop.count({
    where: {
      id: shopId,
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
  });

  return count > 0;
}
