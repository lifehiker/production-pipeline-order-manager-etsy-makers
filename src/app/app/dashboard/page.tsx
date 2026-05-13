import Link from "next/link";
import { addDays } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatMinutes } from "@/lib/utils";
import { requirePrimaryShop } from "@/lib/session";
import { calculateHolidayPlan } from "@/lib/holidayPlanner";
import { getDb } from "@/lib/prisma";

export default async function DashboardPage() {
  const { shop, user } = await requirePrimaryShop();
  const db = getDb();

  const [recentOrders, totalOrders, plans] = await Promise.all([
    db.order.findMany({
      where: { shopId: shop.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.order.count({
      where: { shopId: shop.id },
    }),
    db.holidayPlan.findMany({
      where: { shopId: shop.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const inProductionMinutes = recentOrders
    .filter((order) => order.status === "IN_PRODUCTION")
    .reduce((sum, order) => sum + order.productionMinutes, 0);
  const dailyCapacityMinutes = Math.max(
    60,
    Math.floor((shop.productionHoursPerWeek / 5) * 60),
  );
  const q4Preview = calculateHolidayPlan({
    shippingCutoffDate: new Date("2026-12-18"),
    targetOrders: 48,
    itemsPerOrder: 2,
    minutesPerItem: shop.productTypes[0]?.productionMinutesPerUnit || 45,
    weeklyProductionMinutes: shop.productionHoursPerWeek * 60,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] bg-[linear-gradient(135deg,#1f1612_0%,#6a3f2f_55%,#cc744f_100%)] p-6 text-white lg:p-8">
        <Badge className="bg-white/15 text-white">14-day free trial</Badge>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight lg:text-5xl">
              {user.name?.split(" ")[0] || "Maker"}, your next shipping bottleneck is visible now.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 lg:text-base">
              Track inquiries, keep production balanced, and work backward from retail deadlines before Q4 turns into late-night spreadsheet cleanup.
            </p>
          </div>
          <Link href="/tools/q4-planner">
            <Button className="bg-white text-[var(--ink)] hover:bg-[#fff6ef]">
              Open free Q4 planner
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-[var(--muted-ink)]">Active orders</p>
          <p className="mt-3 text-4xl font-semibold">{totalOrders}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted-ink)]">In production today</p>
          <p className="mt-3 text-4xl font-semibold">{formatMinutes(inProductionMinutes)}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted-ink)]">Daily capacity</p>
          <p className="mt-3 text-4xl font-semibold">{formatMinutes(dailyCapacityMinutes)}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted-ink)]">Q4 start date</p>
          <p className="mt-3 text-2xl font-semibold">
            {formatDate(q4Preview.productionStartDate)}
          </p>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Capacity snapshot</h2>
              <p className="text-sm text-[var(--muted-ink)]">
                Compare what is in motion against the time you have available this week.
              </p>
            </div>
            <Badge>{Math.round((inProductionMinutes / dailyCapacityMinutes) * 100) || 0}% of one day</Badge>
          </div>
          <div className="mt-6">
            <Progress value={(inProductionMinutes / dailyCapacityMinutes) * 100} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] bg-[var(--canvas)] p-4">
              <p className="text-sm text-[var(--muted-ink)]">Material order reminder</p>
              <p className="mt-2 text-xl font-semibold">
                {formatDate(q4Preview.materialOrderDate)}
              </p>
            </div>
            <div className="rounded-[24px] bg-[var(--canvas)] p-4">
              <p className="text-sm text-[var(--muted-ink)]">Suggested weekly batch target</p>
              <p className="mt-2 text-xl font-semibold">
                {q4Preview.weeklyBatchTargets[0]?.ordersTarget || 0} orders/week
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Upcoming deadlines</h2>
              <p className="text-sm text-[var(--muted-ink)]">
                Plans saved by your team or generated from the planner.
              </p>
            </div>
            <Link href="/app/planner">
              <Button variant="secondary" size="sm">
                Planner
              </Button>
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {(plans.length ? plans : [
              {
                id: "preview",
                holidayType: "Q4",
                shippingCutoffDate: addDays(new Date(), 120),
                productionStartDate: q4Preview.productionStartDate,
              },
            ]).map((plan) => (
              <div key={plan.id} className="rounded-[22px] border border-[var(--line)] p-4">
                <p className="text-sm font-medium">{plan.holidayType.replace("_", " ")}</p>
                <p className="mt-2 text-sm text-[var(--muted-ink)]">
                  Start by {formatDate(plan.productionStartDate)}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-ink)]">
                  Ship by {formatDate(plan.shippingCutoffDate)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent orders</h2>
            <p className="text-sm text-[var(--muted-ink)]">The latest submissions and status changes.</p>
          </div>
          <Link href="/app/orders">
            <Button variant="secondary" size="sm">
              View all orders
            </Button>
          </Link>
        </div>
        <div className="mt-5 overflow-hidden rounded-[24px] border border-[var(--line)]">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-[var(--canvas)] text-left text-[var(--muted-ink)]">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-[var(--line)]">
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">{order.itemDescription}</td>
                    <td className="px-4 py-3">{formatDate(order.dueDate)}</td>
                    <td className="px-4 py-3">{order.status.replaceAll("_", " ")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-5 text-[var(--muted-ink)]" colSpan={4}>
                    No orders yet. Publish your intake form to start collecting requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
