import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken, setUnauthorizedHandler } from "@/services/api";
import type { User } from "@/types/user";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        const safeUser = { ...user } as User & { password?: string };
        delete safeUser.password;
        setAuthToken(token);
        set({ user: safeUser, token, isAuthenticated: true });
      },

      logout: () => {
        setAuthToken(null);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "manoa-auth",
      // Sem isto o token se perdia ao recarregar a página e toda chamada autenticada dava 401.
      onRehydrateStorage: () => (state) => {
        setAuthToken(state?.token ?? null);
      },
    },
  ),
);

// Sessão expirada/token inválido: derruba o estado local para os guards redirecionarem ao login.
setUnauthorizedHandler(() => useAuthStore.getState().logout());
