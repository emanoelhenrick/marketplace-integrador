"use client";

import { useAsync } from "@/hooks/use-async";
import { useSession } from "@/hooks/use-session";
import { isPublished, stockOf } from "@/lib/catalog";
import { canManageArtisan } from "@/lib/permissions";
import { artisansService } from "@/services/artisansService";
import { orderService } from "@/services/orderService";
import type { Id } from "@/types/common";

/** Perfil público do artesão + (só para o dono) a área de gestão com pedidos. */
export function useArtisanPage(id: Id) {
  const { ready, user, isArtisan, isAdmin } = useSession();
  const canManage = canManageArtisan(user, id);
  const isOwner = isArtisan && String(user?.id) === String(id);

  const artisanState = useAsync(() => artisansService.getById(id), [id], ready);
  const productsState = useAsync(
    async () => {
      const list = await artisansService.getMyProducts(id);
      return list.filter((p) => isPublished(p) && stockOf(p) > 0);
    },
    [id, isOwner],
    ready && !isOwner, 
  );
  const ordersState = useAsync(
    () => (isAdmin ? orderService.listAll() : orderService.listForArtisan()),
    [id, isAdmin],
    ready && canManage,
  );

  const orders = (ordersState.data ?? []).filter((o) =>
    o.items.some((i) => String(i.artisanId) === String(id)),
  );

  return {
    isLoading: !ready || artisanState.loading || (!isOwner && productsState.loading) || (canManage && ordersState.loading),
    artisan: artisanState.data,
    products: productsState.data ?? [],
    orders,
    canManage,
    isOwner,
  };
}
