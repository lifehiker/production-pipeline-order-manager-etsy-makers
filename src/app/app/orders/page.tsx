import { OrdersTable } from "@/components/orders/orders-table";
import { requirePrimaryShop } from "@/lib/session";
import { getDb } from "@/lib/prisma";

export default async function OrdersPage() {
  const { shop } = await requirePrimaryShop();
  const db = getDb();
  const orders = await db.order.findMany({
    where: { shopId: shop.id },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  return (
    <OrdersTable
      initialOrders={orders.map((order) => ({
        ...order,
        dueDate: order.dueDate?.toISOString() || null,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      }))}
    />
  );
}
