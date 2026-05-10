import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getDb } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const db = getDb();
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  const stripe = await getStripe();

  if (!stripe || !user?.stripeCustomerId) {
    return NextResponse.redirect(new URL("/app/settings?billing=demo", request.url));
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${getBaseUrl()}/app/settings`,
  });

  return NextResponse.redirect(portal.url, 303);
}
