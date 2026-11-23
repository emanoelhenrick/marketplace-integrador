import type { UserRole } from "@/types/user";
import type { OrderStatus } from "@/types/order";

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
  delivered: "bg-forest/15 text-forest border border-forest/40",
  cancelled:
    "bg-red-100 text-red-900 border border-red-300 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/40",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = ["pending", "paid", "shipped", "delivered"];

export function nextOrderStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
}

/** Status em que o pagamento já foi confirmado (a compra é "efetiva"). */
export const PAID_STATUSES: OrderStatus[] = ["paid", "shipped", "delivered"];

/**
 * Transições que a interface oferece por perfil. O servidor é quem decide de
 * verdade; isto só evita mostrar botões que sempre falhariam.
 * - cliente: cancela enquanto pendente
 * - artesão: pending/paid -> shipped só via confirmação de embalagem (ver canArtisanPack)
 * - admin: avança o fluxo ou cancela antes da entrega
 */
export function allowedTransitions(role: UserRole | null, current: OrderStatus): OrderStatus[] {
  if (current === "cancelled" || current === "delivered") return [];
  if (role === "client") return current === "pending" ? ["cancelled"] : [];
  if (role === "admin") {
    const next = nextOrderStatus(current);
    return [...(next ? [next] : []), "cancelled"];
  }
  return [];
}

export const canArtisanPack = (status: OrderStatus): boolean => status === "paid";
