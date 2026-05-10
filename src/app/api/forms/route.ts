import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", "http://localhost:3000"));
  }

  const db = getDb();
  const shop = await db.shop.findFirst({
    where: { ownerId: session.user.id },
    include: { intakeForms: true },
  });

  if (!shop) {
    return NextResponse.redirect(new URL("/app/onboarding", "http://localhost:3000"));
  }

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
    new URL(`/app/forms/${form.id}/edit`, "http://localhost:3000"),
  );
}
