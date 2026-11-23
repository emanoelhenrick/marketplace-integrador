"use client";

import { artisansService } from "@/services/artisansService";
import { useAsync } from "@/hooks/use-async";
import type { Artisan } from "@/types/artisan";

/** Só perfis aprovados na curadoria aparecem publicamente. */
const approved = (list: Artisan[]) => list.filter((a) => (a.moderationStatus ?? "approved") === "approved");

export function useArtisans(limit?: number) {
  const { data, error, loading, reload } = useAsync(() => artisansService.list(), []);
  const artisans = approved(data ?? []);
  return {
    artisans: limit ? artisans.slice(0, limit) : artisans,
    isLoading: loading,
    error: error ? "Não foi possível carregar os mestres agora." : null,
    reload,
  };
}
