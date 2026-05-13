import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";
import { getPrimaryShopForUserId } from "@/lib/session";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const shop = await getPrimaryShopForUserId(session.user.id);

  if (!shop) {
    return NextResponse.redirect(new URL("/app/onboarding", request.url));
  }

  const db = getDb();
  const count = shop.intakeForms.length + 1;
  const form = await db.intakeForm.create({
    data: {
      shopId: shop.id,
      name: `Custom Form ${count}`,
      slug: `${slugify(shop.name)}-custom-form-${count}`,
      fields: [],
    },
  });

  return NextResponse.redirect(
    new URL(`/app/forms/${form.id}/edit`, request.url),
  );
}
