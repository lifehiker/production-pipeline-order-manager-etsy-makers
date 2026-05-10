import { QueueBoard } from "@/components/queue/queue-board";
import { requirePrimaryShop } from "@/lib/session";
import { getDb } from "@/lib/prisma";

export default async function QueuePage() {
  const { shop } = await requirePrimaryShop();
  const db = getDb();
  const orders = await db.order.findMany({
    where: { shopId: shop.id },
    orderBy: { dueDate: "asc" },
  });

  return (
    <QueueBoard
      initialOrders={orders.map((order) => ({
        ...order,
        dueDate: order.dueDate?.toISOString() || null,
      }))}
      dailyCapacityMinutes={Math.max(60, Math.floor((shop.productionHoursPerWeek / 5) * 60))}
    />
  );
}
