"use client";

import { useState } from "react";
import { parseApiError } from "@/lib/api-error";
import { toast } from "@/lib/toast";
import { adminService } from "@/services/adminService";
import { useAsync } from "@/hooks/use-async";
import type { ModerationDecision } from "@/types/admin";
import type { Artisan } from "@/types/artisan";
import type { Id } from "@/types/common";
import type { Product } from "@/types/product";

/** Curadoria: aprovar ou reprovar produtos e perfis de artesãos. Só reprovados/pendentes ficam fora da vitrine. */
export function useAdminCuration() {
  const products = useAsync(() => adminService.listProducts(), []);
  const artisans = useAsync(() => adminService.listArtisans(), []);
  const [busyId, setBusyId] = useState<string | null>(null);

  const decide = async <T extends { id: Id }>(
    kind: "product" | "artisan",
    id: Id,
    decision: ModerationDecision,
    apply: (updated: T) => void,
  ) => {
    setBusyId(`${kind}:${id}`);
    try {
      const updated = (kind === "product"
        ? await adminService.moderateProduct(id, decision)
        : await adminService.moderateArtisan(id, decision)) as unknown as T;
      apply(updated);
      toast.success(decision.status === "approved" ? "Aprovado" : "Reprovado");
    } catch (err) {
      toast.error("Não foi possível registrar a decisão", { description: parseApiError(err).message });
    } finally {
      setBusyId(null);
    }
  };

  const moderateProduct = (id: Id, decision: ModerationDecision) =>
    decide<Product>("product", id, decision, (updated) =>
      products.mutate((list) => (list ?? []).map((p) => (String(p.id) === String(id) ? { ...p, ...updated } : p))),
    );

  const moderateArtisan = (id: Id, decision: ModerationDecision) =>
    decide<Artisan>("artisan", id, decision, (updated) =>
      artisans.mutate((list) => (list ?? []).map((a) => (String(a.id) === String(id) ? { ...a, ...updated } : a))),
    );

  return {
    products: products.data ?? [],
    artisans: artisans.data ?? [],
    isLoading: products.loading || artisans.loading,
    error: products.error || artisans.error,
    busyId,
    moderateProduct,
    moderateArtisan,
  };
}
