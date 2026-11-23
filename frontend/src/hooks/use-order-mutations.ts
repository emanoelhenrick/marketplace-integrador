"use client";

import { useState } from "react";
import { parseApiError } from "@/lib/api-error";
import { ORDER_STATUS_LABEL } from "@/lib/order-status";
import { toast } from "@/lib/toast";
import { orderService } from "@/services/orderService";
import type { Order, OrderStatus } from "@/types/order";

/** Ações sobre um pedido (cancelar, avançar status, embalar) com estado de "ocupado" e toasts. */
export function useOrderMutations(order: Order, onUpdated: (order: Order) => void) {
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<Order>, title: string, description?: string): Promise<Order | null> => {
    setBusy(true);
    try {
      const updated = await action();
      onUpdated(updated);
      toast.success(title, { description });
      return updated;
    } catch (err) {
      const info = parseApiError(err);
      toast.error("Não foi possível atualizar o pedido", {
        description: info.status === 403 ? "Você não tem permissão para esta ação." : info.message,
      });
      return null;
    } finally {
      setBusy(false);
    }
  };

  return {
    busy,
    cancel: () => run(() => orderService.cancel(order.id), `Pedido #${order.id} cancelado`),
    changeStatus: (status: OrderStatus) =>
      run(
        () => orderService.updateStatus(order.id, status),
        `Pedido #${order.id} atualizado`,
        `Novo status: ${ORDER_STATUS_LABEL[status]}`,
      ),
    pack: () =>
      run(() => orderService.markPacked(order.id), "Peças marcadas como embaladas", `Pedido #${order.id}`),
  };
}
