import { OrderStatus } from "@/types/order";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  pending:
    "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/40",
  paid: "bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40",
  shipped:
    "bg-sky-100 text-sky-900 border border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/40",
  delivered:
    "bg-forest/15 text-forest border border-forest/40",
  cancelled:
    "bg-red-100 text-red-900 border border-red-300 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/40",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
];

export function nextOrderStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
}
