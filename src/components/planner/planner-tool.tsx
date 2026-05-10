"use client";

import { useState, useTransition } from "react";

import { HOLIDAY_DEFAULTS } from "@/lib/constants";
import { calculateHolidayPlan } from "@/lib/holidayPlanner";
import { formatDate, formatMinutes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PlannerToolProps = {
  shopId?: string;
  saveEnabled?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
};

export function PlannerTool({
  shopId,
  saveEnabled = false,
  ctaHref,
  ctaLabel,
}: PlannerToolProps) {
  const [holidayType, setHolidayType] = useState<keyof typeof HOLIDAY_DEFAULTS>("Q4");
  const [shippingCutoffDate, setShippingCutoffDate] = useState(
    HOLIDAY_DEFAULTS.Q4.cutoff,
  );
  const [targetOrders, setTargetOrders] = useState("40");
  const [itemsPerOrder, setItemsPerOrder] = useState("2");
  const [minutesPerItem, setMinutesPerItem] = useState("45");
  const [weeklyHours, setWeeklyHours] = useState("20");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState("");

  const result = calculateHolidayPlan({
    shippingCutoffDate: new Date(shippingCutoffDate),
    targetOrders: Number(targetOrders),
    itemsPerOrder: Number(itemsPerOrder),
    minutesPerItem: Number(minutesPerItem),
    weeklyProductionMinutes: Number(weeklyHours) * 60,
  });

  function savePlan() {
    if (!shopId) return;

    startTransition(async () => {
      const response = await fetch("/api/holiday-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holidayType,
          shippingCutoffDate,
          targetOrders: Number(targetOrders),
          itemsPerOrder: Number(itemsPerOrder),
          minutesPerItem: Number(minutesPerItem),
          weeklyBatchTargets: result.weeklyBatchTargets,
          productionStartDate: result.productionStartDate,
          materialOrderDate: result.materialOrderDate,
        }),
      });

      if (response.ok) {
        setSaved("Plan saved.");
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Holiday backward planner</h1>
        <div className="grid gap-3">
          <label className="text-sm font-medium">Holiday</label>
          <select
            className="rounded-2xl border border-[var(--line)] px-4 py-3"
            value={holidayType}
            onChange={(event) => {
              const nextType = event.target.value as keyof typeof HOLIDAY_DEFAULTS;
              setHolidayType(nextType);
              setShippingCutoffDate(HOLIDAY_DEFAULTS[nextType].cutoff);
            }}
          >
            {Object.entries(HOLIDAY_DEFAULTS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
          <label className="text-sm font-medium">Shipping cutoff date</label>
          <Input
            type="date"
            value={shippingCutoffDate}
            onChange={(event) => setShippingCutoffDate(event.target.value)}
          />
          <label className="text-sm font-medium">Target order volume</label>
          <Input
            type="number"
            value={targetOrders}
            onChange={(event) => setTargetOrders(event.target.value)}
          />
          <label className="text-sm font-medium">Items per order</label>
          <Input
            type="number"
            value={itemsPerOrder}
            onChange={(event) => setItemsPerOrder(event.target.value)}
          />
          <label className="text-sm font-medium">Minutes per item</label>
          <Input
            type="number"
            value={minutesPerItem}
            onChange={(event) => setMinutesPerItem(event.target.value)}
          />
          <label className="text-sm font-medium">Weekly production hours</label>
          <Input
            type="number"
            value={weeklyHours}
            onChange={(event) => setWeeklyHours(event.target.value)}
          />
        </div>
      </Card>

      <Card className="space-y-5">
        <div>
          <p className="text-sm text-[var(--muted-ink)]">Countdown</p>
          <h2 className="mt-2 text-3xl font-semibold">
            {result.daysUntilStart > 0
              ? `${result.daysUntilStart} days until production must start`
              : "Production start date is already here"}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] bg-[var(--canvas)] p-4">
            <p className="text-sm text-[var(--muted-ink)]">Total work</p>
            <p className="mt-2 text-xl font-semibold">
              {formatMinutes(result.totalMinutesNeeded)}
            </p>
          </div>
          <div className="rounded-[24px] bg-[var(--canvas)] p-4">
            <p className="text-sm text-[var(--muted-ink)]">Production start</p>
            <p className="mt-2 text-xl font-semibold">
              {formatDate(result.productionStartDate)}
            </p>
          </div>
          <div className="rounded-[24px] bg-[var(--canvas)] p-4">
            <p className="text-sm text-[var(--muted-ink)]">Material order date</p>
            <p className="mt-2 text-xl font-semibold">
              {formatDate(result.materialOrderDate)}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Weekly batch targets</h3>
          <div className="mt-3 space-y-3">
            {result.weeklyBatchTargets.map((week) => (
              <div
                key={week.weekStart}
                className="flex flex-col justify-between gap-2 rounded-[22px] border border-[var(--line)] p-4 md:flex-row md:items-center"
              >
                <div>
                  <p className="font-medium">
                    {formatDate(week.weekStart)} to {formatDate(week.weekEnd)}
                  </p>
                  <p className="text-sm text-[var(--muted-ink)]">
                    {week.ordersTarget} orders • {week.itemsTarget} items
                  </p>
                </div>
                <p className="text-sm font-medium">{formatMinutes(week.minutesTarget)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {saveEnabled ? (
            <Button onClick={savePlan} disabled={pending}>
              {pending ? "Saving..." : "Save plan"}
            </Button>
          ) : null}
          {ctaHref && ctaLabel ? (
            <a href={ctaHref}>
              <Button variant="secondary">{ctaLabel}</Button>
            </a>
          ) : null}
          {saved ? <p className="self-center text-sm text-[var(--success)]">{saved}</p> : null}
        </div>
      </Card>
    </div>
  );
}
