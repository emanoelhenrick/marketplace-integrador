import { isPurchasable } from "@/lib/catalog";
import type { Product } from "@/types/product";
import type { RecommendationResponse } from "@/types/recommendation";

/**
 * Última barreira no cliente: mesmo que o servidor recomende algo, só aparece
 * o que está ativo, aprovado e com estoque. Remove duplicados e o que já está no carrinho.
 */
export function sanitizeRecommendations(
  response: RecommendationResponse,
  options: { limit: number; excludeIds?: (number | string)[] } = { limit: 8 },
): RecommendationResponse {
  const exclude = new Set((options.excludeIds ?? []).map(String));
  const seen = new Set<string>();
  const items = response.items.filter((p) => {
    const key = String(p.id);
    if (seen.has(key) || exclude.has(key) || !isPurchasable(p)) return false;
    seen.add(key);
    return true;
  });
  return { strategy: response.strategy, items: items.slice(0, options.limit) };
}

/** Cold start local (usado quando o endpoint falha ou vem vazio): melhor avaliadas com estoque. */
export function coldStartFallback(catalog: Product[], limit = 8): RecommendationResponse {
  const items = catalog
    .filter(isPurchasable)
    .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0) || (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0))
    .slice(0, limit);
  return { strategy: "cold_start", items };
}
