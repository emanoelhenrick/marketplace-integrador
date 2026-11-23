"use client";

import { useMemo } from "react";
import { coldStartFallback, sanitizeRecommendations } from "@/lib/recommendations";
import { productService } from "@/services/productService";
import { recommendationService } from "@/services/recommendationService";
import { useAsync } from "@/hooks/use-async";
import { useSession } from "@/hooks/use-session";
import type { RecommendationResponse } from "@/types/recommendation";

interface Options {
  limit?: number;
  /** Produtos a não repetir (ex.: o que o usuário está vendo agora). */
  excludeIds?: (number | string)[];
}

/**
 * Sugestões: personalizadas quando o servidor tem histórico; cold start (mais
 * bem avaliadas/populares) para visitante ou usuário novo. Itens sem estoque
 * são sempre removidos, inclusive se o servidor os enviar.
 */
export function useRecommendations({ limit = 8, excludeIds = [] }: Options = {}) {
  const { ready, user } = useSession();
  const userKey = user ? String(user.id) : "guest";
  const excludeKey = excludeIds.map(String).join(",");

  const { data, loading } = useAsync<RecommendationResponse>(
    async () => {
      try {
        const response = await recommendationService.get(limit + excludeIds.length + 4);
        if (response.items.length > 0) return response;
      } catch {
        // cai no cold start local
      }
      const catalog = await productService.list();
      return coldStartFallback(catalog, limit + excludeIds.length + 4);
    },
    [userKey, limit],
    ready,
  );

  const result = useMemo(
    () => (data ? sanitizeRecommendations(data, { limit, excludeIds }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, limit, excludeKey],
  );

  return {
    items: result?.items ?? [],
    strategy: result?.strategy ?? "cold_start",
    isLoading: loading || !ready,
  };
}
