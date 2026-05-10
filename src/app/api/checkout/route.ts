import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { PLAN_DEFINITIONS } from "@/lib/constants";
import { getDb } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/utils";

export async function POST(request: Request) {
  const formData = await request.formData();
  const planId = String(formData.get("planId") || "");
  const session = await auth();
  const selectedPlan = PLAN_DEFINITIONS.find((plan) => plan.id === planId);

  if (!selectedPlan) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  const stripe = await getStripe();
  if (!stripe) {
    return NextResponse.redirect(new URL("/pricing?billing=demo", request.url));
  }

  const priceId = process.env[selectedPlan.lookupKey];
  if (!priceId) {
    return NextResponse.redirect(new URL("/pricing?billing=missing-price", request.url));
  }

  const db = getDb();
  let customerEmail = session?.user?.email || undefined;

  if (session?.user?.id) {
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    customerEmail = user?.email || customerEmail;
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 14 },
    success_url: `${getBaseUrl()}/app/settings?billing=success`,
    cancel_url: `${getBaseUrl()}/pricing?billing=cancelled`,
    customer_email: customerEmail,
  });

  return NextResponse.redirect(checkout.url || `${getBaseUrl()}/pricing`, 303);
}
