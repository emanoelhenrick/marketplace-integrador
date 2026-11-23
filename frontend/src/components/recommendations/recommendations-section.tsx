"use client";

import { CardImageProduct } from "@/components/cards/card-image-product";
import { useRecommendations } from "@/hooks/use-recommendations";

interface RecommendationsSectionProps {
  surface: string;
  limit?: number;
  excludeIds?: (number | string)[];
}

/** "Para você" (histórico) ou "Mais procurados" (cold start). Nunca mostra item sem estoque. */
export function RecommendationsSection({ surface, limit = 4, excludeIds }: RecommendationsSectionProps) {
  const { items, strategy, isLoading } = useRecommendations({ limit, excludeIds });

  if (isLoading || items.length === 0) return null;

  const personalized = strategy === "personalized";

  return (
    <section aria-labelledby={`reco-${surface}`} className="space-y-5">
      <div>
        <p className="text-xs font-bold text-brand uppercase tracking-wider">{personalized ? "Para você" : "Para começar"}</p>
        <h2 id={`reco-${surface}`} className="text-xl sm:text-2xl font-bold">
          {personalized ? "Sugestões escolhidas pelo seu gosto" : "As peças mais procuradas do acervo"}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {items.map((product, index) => (
          <CardImageProduct key={product.id} product={product} trackingSurface={surface} position={index} />
        ))}
      </div>
    </section>
  );
}
