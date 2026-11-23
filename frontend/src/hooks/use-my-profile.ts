"use client";

import { artisansService } from "@/services/artisansService";
import { useAsync } from "@/hooks/use-async";
import { useSession } from "@/hooks/use-session";
import type { Artisan } from "@/types/artisan";

/** Perfil público do artesão logado (para exibir e editar a própria biografia). */
export function useMyProfile() {
  const { user, isArtisan } = useSession();
  const state = useAsync(() => artisansService.getById(user!.id), [user?.id], isArtisan && !!user);
  return {
    artisan: state.data,
    setArtisan: (next: Artisan) => state.mutate(() => next),
  };
}
