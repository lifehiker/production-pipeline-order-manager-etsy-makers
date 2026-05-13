import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  const token = new URL(request.url).searchParams.get("token");

  if (!session?.user?.id || !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const db = getDb();
  const invite = await db.shopInvite.findUnique({ where: { token } });
  if (!invite || invite.status !== "PENDING") {
    return NextResponse.redirect(new URL("/app/settings?invite=invalid", request.url));
  }

  if (
    invite.email.toLowerCase() !== (session.user.email || "").toLowerCase()
  ) {
    return NextResponse.redirect(new URL("/app/settings?invite=invalid", request.url));
  }

  await db.shopMember.upsert({
    where: {
      shopId_userId: {
        shopId: invite.shopId,
        userId: session.user.id,
      },
    },
    update: { role: invite.role },
    create: {
      shopId: invite.shopId,
      userId: session.user.id,
      role: invite.role,
    },
  });

  await db.shopInvite.update({
    where: { id: invite.id },
    data: { status: "ACCEPTED", acceptedAt: new Date() },
  });

  return NextResponse.redirect(new URL("/app/dashboard", request.url));
}
