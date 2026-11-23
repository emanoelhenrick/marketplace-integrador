"use client";

import { useState } from "react";
import { parseApiError } from "@/lib/api-error";
import { toast } from "@/lib/toast";
import { parseStock } from "@/lib/validation";
import { productService } from "@/services/productService";
import { useAsync } from "@/hooks/use-async";
import type { Id } from "@/types/common";
import type { Product } from "@/types/product";

/**
 * Gestão dos produtos do artesão logado: lista (inclui inativos), ativar/desativar
 * e atualização manual de estoque (nunca negativo). O servidor só aceita
 * alterações em produtos do próprio artesão.
 */
export function useMyProducts(enabled = true) {
  const { data, loading, error, mutate, reload } = useAsync(() => productService.listMine(), [], enabled);
  const [busyId, setBusyId] = useState<string | null>(null);

  const replace = (updated: Product) =>
    mutate((list) => (list ?? []).map((p) => (String(p.id) === String(updated.id) ? { ...p, ...updated } : p)));

  const withBusy = async (id: Id, action: () => Promise<boolean>) => {
    setBusyId(String(id));
    try {
      return await action();
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = (product: Product) =>
    withBusy(product.id, async () => {
      try {
        const updated = await productService.setActive(product.id, !product.active);
        replace(updated);
        toast.success(updated.active ? "Peça reativada" : "Peça desativada", {
          description: updated.active
            ? "Volta à vitrine se houver estoque."
            : "Saiu da vitrine; pedidos anteriores continuam no histórico.",
        });
        return true;
      } catch (err) {
        toast.error("Não foi possível alterar a peça", { description: parseApiError(err).message });
        return false;
      }
    });

  /** Retorna uma mensagem de erro (para o campo) ou null em caso de sucesso. */
  const updateStock = async (product: Product, raw: string): Promise<string | null> => {
    const parsed = parseStock(raw);
    if (!parsed.ok) return parsed.error;

    let message: string | null = null;
    await withBusy(product.id, async () => {
      try {
        replace(await productService.setStock(product.id, parsed.value));
        toast.success("Estoque atualizado", { description: `${product.name}: ${parsed.value} unidade(s).` });
        return true;
      } catch (err) {
        message = parseApiError(err, "Não foi possível atualizar o estoque.").message;
        return false;
      }
    });
    return message;
  };

  return { products: data ?? [], isLoading: loading, error, reload, busyId, toggleActive, updateStock };
}
