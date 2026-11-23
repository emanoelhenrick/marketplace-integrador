"use client";

import { useCallback, useEffect, useRef } from "react";
import { trackClick, trackImpression } from "@/lib/event-tracker";

/**
 * Registra exibição (quando 50% do card fica visível) e clique, sem enviar dados pessoais.
 * Sem `surface`, não rastreia nada.
 */
export function useProductTracking<T extends HTMLElement>(
  productId: number | string,
  surface?: string,
  position?: number,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !surface) return;

    if (typeof IntersectionObserver === "undefined") {
      trackImpression(productId, surface, position);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackImpression(productId, surface, position);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [productId, surface, position]);

  const onClick = useCallback(() => {
    if (surface) trackClick(productId, surface, position);
  }, [productId, surface, position]);

  return { ref, onClick };
}
