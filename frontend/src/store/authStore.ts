import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user: User) => {
        // Nunca guardamos a senha no estado da aplicação, mesmo que ela
        // venha preenchida na resposta da fake API.
        const safeUser: User = { ...user };
        delete safeUser.password;
        set({ user: safeUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "manoa-auth",
    },
  ),
);
