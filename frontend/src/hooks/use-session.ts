"use client";

import { useAuthStore } from "@/store/authStore";
import { useHydrated } from "@/hooks/use-hydrated";
import { canPurchase, type Role } from "@/lib/permissions";

export function useSession() {
  const ready = useHydrated();
  const storedUser = useAuthStore((state) => state.user);
  const storedAuth = useAuthStore((state) => state.isAuthenticated);

  const user = ready && storedAuth ? storedUser : null;
  const role: Role = user?.role ?? null;

  return {
    ready,
    user,
    role,
    isAuthenticated: !!user,
    isClient: role === "client",
    isArtisan: role === "artisan",
    isAdmin: role === "admin",
    canPurchase: canPurchase(role),
  };
}
