import { OrderStatus } from "@/types/order";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border border-amber-300",
  paid: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  shipped: "bg-sky-100 text-sky-800 border border-sky-300",
  delivered:
    "bg-(--mangue)/15 text-(--mangue) border border-(--mangue)/40",
  cancelled: "bg-red-100 text-red-800 border border-red-300",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
];
