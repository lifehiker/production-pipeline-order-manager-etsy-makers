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
          shop: true,
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
  const shop = user.ownedShops[0] ?? user.memberships[0]?.shop;

  if (!shop) {
    redirect("/app/onboarding");
  }

  return { user, shop };
}
