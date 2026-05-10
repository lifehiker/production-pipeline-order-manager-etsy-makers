import { isSameDay } from "date-fns";
import { NextResponse } from "next/server";

import { sendAppEmail } from "@/lib/email";
import { getDb } from "@/lib/prisma";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const plans = await db.holidayPlan.findMany({
    include: { shop: { include: { owner: true } } },
  });
  const today = new Date();
  let sent = 0;

  for (const plan of plans) {
    if (
      !plan.materialReminderSentAt &&
      isSameDay(plan.materialOrderDate, today) &&
      plan.shop.owner.email
    ) {
      await sendAppEmail({
        to: plan.shop.owner.email,
        subject: `${plan.holidayType} material order reminder`,
        html: `<p>Today is the material order date for your ${plan.holidayType} plan.</p>`,
      });
      await db.holidayPlan.update({
        where: { id: plan.id },
        data: { materialReminderSentAt: new Date() },
      });
      sent += 1;
    }

    if (
      !plan.productionReminderSentAt &&
      isSameDay(plan.productionStartDate, today) &&
      plan.shop.owner.email
    ) {
      await sendAppEmail({
        to: plan.shop.owner.email,
        subject: `${plan.holidayType} production start reminder`,
        html: `<p>Production should start today for your ${plan.holidayType} plan.</p>`,
      });
      await db.holidayPlan.update({
        where: { id: plan.id },
        data: { productionReminderSentAt: new Date() },
      });
      sent += 1;
    }
  }

  return NextResponse.json({ ok: true, sent });
}
