import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { sendAppEmail } from "@/lib/email";
import { getDb } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const db = getDb();
  const shop = await db.shop.findFirst({ where: { ownerId: session.user.id } });

  if (!shop || !email) {
    return NextResponse.redirect(new URL("/app/settings", request.url));
  }

  const token = randomUUID();
  await db.shopInvite.create({
    data: {
      email,
      token,
      shopId: shop.id,
      invitedById: session.user.id,
    },
  });

  const inviteLink = `${getBaseUrl()}/api/invites/accept?token=${token}`;
  await sendAppEmail({
    to: email,
    subject: `Join ${shop.name} on MakerPipeline`,
    html: `<p>You were invited to collaborate on ${shop.name}.</p><p><a href="${inviteLink}">Accept the invite</a></p>`,
  });

  return NextResponse.redirect(new URL("/app/settings", request.url));
}
