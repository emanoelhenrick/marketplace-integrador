"use client";

import { useState } from "react";
import { parseApiError } from "@/lib/api-error";
import { toast } from "@/lib/toast";
import { adminService } from "@/services/adminService";
import { useAsync } from "@/hooks/use-async";
import { useSession } from "@/hooks/use-session";
import type { AdminUser } from "@/types/admin";

/** Ativa/desativa contas. Desativar bloqueia o acesso e preserva todo o histórico (pedidos, avaliações). */
export function useAdminUsers() {
  const { user: me } = useSession();
  const { data, loading, error, mutate, reload } = useAsync(() => adminService.listUsers(), []);
  const [busyId, setBusyId] = useState<string | null>(null);

  const canToggle = (target: AdminUser) => String(target.id) !== String(me?.id);

  const toggleActive = async (target: AdminUser) => {
    if (!canToggle(target)) {
      toast.error("Você não pode desativar a própria conta");
      return;
    }
    setBusyId(String(target.id));
    try {
      const updated = await adminService.setUserActive(target.id, !target.active);
      mutate((list) => (list ?? []).map((u) => (String(u.id) === String(updated.id) ? { ...u, ...updated } : u)));
      toast.success(updated.active ? "Conta reativada" : "Conta desativada", {
        description: updated.active ? undefined : "O histórico do usuário foi preservado.",
      });
    } catch (err) {
      toast.error("Não foi possível alterar a conta", { description: parseApiError(err).message });
    } finally {
      setBusyId(null);
    }
  };

  return { users: data ?? [], isLoading: loading, error, reload, busyId, canToggle, toggleActive };
}
