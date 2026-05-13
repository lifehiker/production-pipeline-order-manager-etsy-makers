"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useState } from "react";
import type { OrderStatus } from "@prisma/client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatMinutes } from "@/lib/utils";

const columns: Array<{ title: string; status: OrderStatus }> = [
  { title: "Inquiry", status: "INQUIRY" },
  { title: "Confirmed", status: "CONFIRMED" },
  { title: "In Production", status: "IN_PRODUCTION" },
  { title: "Complete", status: "COMPLETE" },
  { title: "Shipped", status: "SHIPPED" },
];

type QueueOrder = {
  id: string;
  customerName: string;
  itemDescription: string;
  quantity: number;
  dueDate: string | null;
  productionMinutes: number;
  status: OrderStatus;
};

export function QueueBoard({
  initialOrders,
  dailyCapacityMinutes,
}: {
  initialOrders: QueueOrder[];
  dailyCapacityMinutes: number;
}) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [orders, setOrders] = useState(initialOrders);

  const inProductionMinutes = orders
    .filter((order) => order.status === "IN_PRODUCTION")
    .reduce((sum, order) => sum + order.productionMinutes, 0);

  async function updateStatus(orderId: string, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );

    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const orderId = String(event.active.id);
    const nextStatus = event.over?.id as OrderStatus | undefined;
    if (!nextStatus) {
      return;
    }

    void updateStatus(orderId, nextStatus);
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Production queue</h1>
            <p className="text-sm text-[var(--muted-ink)]">
              Move work from inquiry to production and keep daily load in view.
            </p>
          </div>
          <div className="w-full max-w-md">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-[var(--muted-ink)]">Today’s committed production</span>
              <span>{formatMinutes(inProductionMinutes)} / {formatMinutes(dailyCapacityMinutes)}</span>
            </div>
            <Progress value={(inProductionMinutes / dailyCapacityMinutes) * 100} />
          </div>
        </div>
      </Card>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 xl:grid-cols-5">
          {columns.map((column) => (
            <div
              key={column.status}
              className="rounded-[28px] border border-[var(--line)] bg-white/80 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">{column.title}</h2>
                <span className="rounded-full bg-[var(--canvas)] px-3 py-1 text-xs font-medium">
                  {orders.filter((order) => order.status === column.status).length}
                </span>
              </div>
              <div id={column.status} className="space-y-3">
                {orders
                  .filter((order) => order.status === column.status)
                  .map((order) => (
                    <button
                      key={order.id}
                      className="block w-full rounded-[24px] border border-[var(--line)] bg-white p-4 text-left transition hover:border-[var(--brand)]"
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", order.id);
                      }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        const orderId = event.dataTransfer.getData("text/plain");
                        void updateStatus(orderId, column.status);
                      }}
                      type="button"
                    >
                      <p className="font-medium">{order.customerName}</p>
                      <p className="mt-1 text-sm text-[var(--muted-ink)]">
                        {order.itemDescription}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted-ink)]">
                        <span>{formatMinutes(order.productionMinutes)}</span>
                        <span>{formatDate(order.dueDate)}</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
