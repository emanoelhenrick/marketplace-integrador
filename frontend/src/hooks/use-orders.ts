"use client";

import { useMemo } from "react";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { useAsync } from "@/hooks/use-async";
import { useSession } from "@/hooks/use-session";
import { canViewOrder } from "@/lib/permissions";
import type { Id } from "@/types/common";
import type { Order } from "@/types/order";

export type OrderAccess = "loading" | "ok" | "not_found" | "forbidden";

/**
 * Pedido individual. O servidor responde 403/404 para pedido de outro usuário e
 * aqui ainda repetimos a checagem de posse, para nunca renderizar dados alheios.
 */
export function useOrderDetail(id: Id) {
  const { user } = useSession();
  const orderState = useAsync(() => orderService.getById(id), [id, user?.id]);
  const order = orderState.data;

  const itemIds = useMemo(() => Array.from(new Set((order?.items ?? []).map((i) => i.productId))), [order]);
  const productsState = useAsync(() => productService.getByIds(itemIds), [itemIds.join(",")], !!order && itemIds.length > 0);

  const productById = useMemo(
    () => new Map((productsState.data ?? []).map((p) => [String(p.id), p])),
    [productsState.data],
  );

  let access: OrderAccess = "loading";
  if (!orderState.loading) {
    if (orderState.error?.status === 403) access = "forbidden";
    else if (orderState.error || !order) access = "not_found";
    else access = canViewOrder(user, order) ? "ok" : "forbidden";
  }

  return {
    access,
    order: access === "ok" ? order : null,
    setOrder: (next: Order) => orderState.mutate(() => next),
    productById,
  };
}
