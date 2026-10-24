"use client";

import { useMemo, useState } from "react";

import { StudioPendingOrders } from "@/components/artisan/studio-pending-orders";
import { StudioProductsTable, ARTISAN_SHARE } from "@/components/artisan/studio-products-table";
import { StudioStats } from "@/components/artisan/studio-stats";
import { StudioSupport } from "@/components/artisan/studio-support";
import type { Artisan } from "@/types/artisan";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

interface ArtisanStudioProps {
  artisan: Artisan;
  products: Product[];
  initialOrders: Order[];
  isOwner: boolean;
}

/** Área de gestão do ateliê: só montada para o dono ou para a administração. */
export function ArtisanStudio({ artisan, products, initialOrders, isOwner }: ArtisanStudioProps) {
  const [orders, setOrders] = useState(initialOrders);
  const artisanId = artisan.id;

  const productById = useMemo(() => new Map(products.map((p) => [String(p.id), p])), [products]);

  const mineOf = (order: Order) => order.items.filter((i) => String(i.artisanId) === String(artisanId));

  const { repasse, shippedCount, pendingPack } = useMemo(() => {
    const paidStatuses = ["paid", "shipped", "delivered"];
    const repasse = orders
      .filter((o) => paidStatuses.includes(o.status))
      .reduce(
        (acc, o) =>
          acc + mineOf(o).reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) * ARTISAN_SHARE,
        0,
      );
    const shippedCount = orders.filter((o) => o.status === "shipped").length;
    const pendingPack = orders.filter(
      (o) => o.status === "paid" && mineOf(o).some((i) => !i.packed),
    );
    return { repasse, shippedCount, pendingPack };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, artisanId]);

  const avgStars = products.length
    ? products.reduce((sum, p) => sum + p.stars, 0) / products.length
    : 0;

  const handleOrderUpdated = (updated: Order) =>
    setOrders((prev) => prev.map((o) => (String(o.id) === String(updated.id) ? updated : o)));

  return (
    <div className="space-y-10">
      <StudioStats
        repasse={repasse}
        productCount={products.length}
        shippedCount={shippedCount}
        avgStars={avgStars}
        quote={artisan.quote}
      />
      <StudioPendingOrders
        artisanId={artisanId}
        orders={pendingPack}
        productById={productById}
        canConfirm={isOwner}
        onOrderUpdated={handleOrderUpdated}
      />
      <StudioProductsTable products={products} canEdit={isOwner} />
      {isOwner && <StudioSupport />}
    </div>
  );
}
