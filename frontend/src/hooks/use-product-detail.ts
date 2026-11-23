"use client";

import { isPublished, stockOf } from "@/lib/catalog";
import { artisansService } from "@/services/artisansService";
import { productService } from "@/services/productService";
import { useAsync } from "@/hooks/use-async";
import { useSession } from "@/hooks/use-session";
import type { Id } from "@/types/common";

/** Detalhe da peça: dados, história, perfil público do artesão e peças relacionadas. */
export function useProductDetail(id: Id) {
  const { ready, user, role } = useSession();

  const productState = useAsync(() => productService.getById(id), [id, user?.id]);
  const product = productState.data;

  const isOwner = !!product && role === "artisan" && String(user?.id) === String(product.artisanId);
  const isAdmin = role === "admin";

  const artisanState = useAsync(
    () => artisansService.getById(product!.artisanId),
    [product?.artisanId],
    !!product,
  );

  const relatedState = useAsync(
    async () => {
      const list = await productService.list({ category: product!.category });
      return list.filter((p) => String(p.id) !== String(product!.id) && isPublished(p) && stockOf(p) > 0).slice(0, 4);
    },
    [product?.id, product?.category],
    !!product,
  );

  // Peça desativada/reprovada só é visível para o dono e para a administração.
  const hiddenFromViewer = !!product && !isPublished(product) && !isOwner && !isAdmin;

  return {
    isLoading: productState.loading || !ready,
    product: hiddenFromViewer ? null : product,
    notFound: !productState.loading && (!product || hiddenFromViewer),
    isOwner,
    isUnpublished: !!product && !isPublished(product),
    isSoldOut: !!product && stockOf(product) <= 0,
    artisan: artisanState.data,
    related: relatedState.data ?? [],
  };
}
