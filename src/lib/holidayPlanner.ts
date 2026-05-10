import { addDays, formatISO, startOfWeek, subWeeks } from "date-fns";

import type { WeeklyTarget } from "@/lib/types";

export function calculateHolidayPlan(input: {
  shippingCutoffDate: Date;
  targetOrders: number;
  itemsPerOrder: number;
  minutesPerItem: number;
  weeklyProductionMinutes: number;
}) {
  const totalMinutesNeeded =
    input.targetOrders * input.itemsPerOrder * input.minutesPerItem;
  const weeksNeeded = Math.max(
    1,
    Math.ceil(totalMinutesNeeded / Math.max(input.weeklyProductionMinutes, 1)),
  );
  const productionStartDate = subWeeks(input.shippingCutoffDate, weeksNeeded);
  const materialOrderDate = addDays(productionStartDate, -7);

  const weeklyBatchTargets: WeeklyTarget[] = Array.from(
    { length: weeksNeeded },
    (_, index) => {
      const weekStart = startOfWeek(addDays(productionStartDate, index * 7), {
        weekStartsOn: 1,
      });
      const weekEnd = addDays(weekStart, 6);
      const baseOrders = Math.floor(input.targetOrders / weeksNeeded);
      const remainder = input.targetOrders % weeksNeeded;
      const ordersTarget = baseOrders + (index < remainder ? 1 : 0);
      const itemsTarget = ordersTarget * input.itemsPerOrder;
      const minutesTarget = itemsTarget * input.minutesPerItem;

      return {
        weekStart: formatISO(weekStart, { representation: "date" }),
        weekEnd: formatISO(weekEnd, { representation: "date" }),
        ordersTarget,
        itemsTarget,
        minutesTarget,
      };
    },
  );

  const daysUntilStart = Math.ceil(
    (productionStartDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return {
    totalMinutesNeeded,
    weeksNeeded,
    productionStartDate,
    materialOrderDate,
    weeklyBatchTargets,
    daysUntilStart,
  };
}
