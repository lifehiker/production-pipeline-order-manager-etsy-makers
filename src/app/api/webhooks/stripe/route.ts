import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = await getStripe();
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  const db = getDb();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.customer_details?.email) {
      await db.user.updateMany({
        where: { email: session.customer_details.email },
        data: {
          stripeCustomerId: String(session.customer || ""),
          stripeSubscriptionId: String(session.subscription || ""),
          subscriptionStatus: "ACTIVE",
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    await db.user.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { subscriptionStatus: "CANCELED" },
    });
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    await db.user.updateMany({
      where: { stripeCustomerId: String(invoice.customer || "") },
      data: { subscriptionStatus: "PAST_DUE" },
    });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;
    await db.user.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { subscriptionStatus: subscription.status === "trialing" ? "TRIALING" : "ACTIVE" },
    });
  }

  return NextResponse.json({ received: true });
}
