"use client";

import { useMemo, useState, useTransition } from "react";

import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderStatus } from "@prisma/client";
import { formatDate, formatMinutes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type OrderRecord = {
  id: string;
  customerName: string;
  customerEmail: string | null;
  itemDescription: string;
  quantity: number;
  dueDate: string | null;
  productionMinutes: number;
  status: OrderStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export function OrdersTable({ initialOrders }: { initialOrders: OrderRecord[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(
    initialOrders[0] || null,
  );
  const [pending, startTransition] = useTransition();

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesStatus =
          statusFilter === "ALL" ? true : order.status === statusFilter;
        const haystack = `${order.customerName} ${order.itemDescription}`.toLowerCase();
        const matchesSearch = haystack.includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
      }),
    [orders, search, statusFilter],
  );

  function updateOrder(orderId: string, payload: Partial<OrderRecord>) {
    startTransition(async () => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return;
      }

      const nextOrder = await response.json();
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? nextOrder.order : order)),
      );
      setSelectedOrder((current) =>
        current?.id === orderId ? nextOrder.order : current,
      );
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Orders</h1>
            <p className="text-sm text-[var(--muted-ink)]">
              Track every incoming custom request in one place.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Search customer or item"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--line)]">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-[var(--canvas)] text-left text-[var(--muted-ink)]">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Production</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer border-t border-[var(--line)] hover:bg-[var(--canvas)]"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{order.itemDescription}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">{formatDate(order.dueDate)}</td>
                  <td className="px-4 py-3">{formatMinutes(order.productionMinutes)}</td>
                  <td className="px-4 py-3">
                    <Select
                      className="min-w-40"
                      value={order.status}
                      onChange={(event) =>
                        updateOrder(order.id, {
                          status: event.target.value as OrderStatus,
                        })
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="sticky top-6 h-fit">
        <h2 className="text-xl font-semibold">Order details</h2>
        {selectedOrder ? (
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-[var(--muted-ink)]">Customer</p>
              <p className="font-medium">{selectedOrder.customerName}</p>
              <p className="text-sm text-[var(--muted-ink)]">
                {selectedOrder.customerEmail || "No email"}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-ink)]">Order</p>
              <p className="font-medium">{selectedOrder.itemDescription}</p>
              <p className="text-sm text-[var(--muted-ink)]">
                Qty {selectedOrder.quantity} • {formatMinutes(selectedOrder.productionMinutes)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-ink)]">Notes</p>
              <Textarea
                value={selectedOrder.notes}
                onChange={(event) =>
                  setSelectedOrder({ ...selectedOrder, notes: event.target.value })
                }
              />
            </div>
            <Button
              onClick={() =>
                updateOrder(selectedOrder.id, { notes: selectedOrder.notes })
              }
              disabled={pending}
            >
              Save notes
            </Button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted-ink)]">
            Pick an order to inspect its details.
          </p>
        )}
      </Card>
    </div>
  );
}
