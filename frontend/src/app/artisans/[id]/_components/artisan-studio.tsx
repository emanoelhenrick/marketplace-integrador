"use client";

import { useMemo, useState } from "react";

import { StudioPendingOrders } from "@/app/artisans/[id]/_components/studio-pending-orders";
import { StudioProductsTable } from "@/app/artisans/[id]/_components/studio-products-table";
import { StudioStats } from "@/app/artisans/[id]/_components/studio-stats";
import { StudioSupport } from "@/app/artisans/[id]/_components/studio-support";
import { useMyProducts } from "@/hooks/use-my-products";
import { computeRepasse, itemsOfArtisan } from "@/lib/metrics";
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
export function ArtisanStudio({ artisan, products: publicProducts, initialOrders, isOwner }: ArtisanStudioProps) {
  const [orders, setOrders] = useState(initialOrders);
  const artisanId = artisan.id;

  const mine = useMyProducts(isOwner);
  const products = isOwner ? mine.products : publicProducts;

  const productById = useMemo(() => new Map(products.map((p) => [String(p.id), p])), [products]);

  const { repasse, shippedCount, pendingPack } = useMemo(() => {
    const shippedCount = orders.filter((o) => o.status === "shipped").length;
    const pendingPack = orders.filter((o) => o.status === "paid" && itemsOfArtisan(o, artisanId).some((i) => !i.packed));
    return { repasse: computeRepasse(orders, artisanId), shippedCount, pendingPack };
  }, [orders, artisanId]);

  const avgStars = products.length ? products.reduce((sum, p) => sum + p.stars, 0) / products.length : 0;

  const handleOrderUpdated = (updated: Order) =>
    setOrders((prev) => prev.map((o) => (String(o.id) === String(updated.id) ? updated : o)));

  return (
    <div className="space-y-10">
      <StudioStats repasse={repasse} productCount={products.length} shippedCount={shippedCount} avgStars={avgStars} quote={artisan.quote} />
      <StudioPendingOrders
        artisanId={artisanId}
        orders={pendingPack}
        productById={productById}
        canConfirm={isOwner}
        onOrderUpdated={handleOrderUpdated}
      />
      <StudioProductsTable
        products={products}
        canEdit={isOwner}
        busyId={mine.busyId}
        onToggleActive={mine.toggleActive}
        onUpdateStock={mine.updateStock}
      />
      {isOwner && <StudioSupport />}
    </div>
  );
}
