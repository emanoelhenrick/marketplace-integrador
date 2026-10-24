import Link from "next/link";

import { StatusBadge } from "@/components/cards/StatusBadge";
import { formatBRL, formatDate } from "@/lib/format";
import type { Order } from "@/types/order";

interface OrderListItemProps {
  order: Order;
  title: string;
  meta: string;
  amount?: number;
}

/** Linha de pedido usada nos painéis de cliente, artesão e administrador. */
export function OrderListItem({
  order,
  title,
  meta,
  amount,
}: OrderListItemProps) {
  return (
    <Link
      href={`/pedido/${order.id}`}
      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-between rounded-lg border p-3.5 hover:bg-muted/60 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-bold">
          {formatBRL(amount ?? order.totalAmount)}
        </span>
        <StatusBadge status={order.status} />
      </div>
    </Link>
  );
}

export const orderDateMeta = (order: Order, extra?: string) =>
  `${formatDate(order.createdAt)}${extra ? ` · ${extra}` : ""}`;
