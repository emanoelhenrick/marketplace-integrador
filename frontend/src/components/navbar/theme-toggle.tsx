"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useHydrated } from "@/hooks/use-hydrated";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const hydrated = useHydrated();
  // Antes de hidratar o ícone é neutro, evitando divergência servidor/cliente.
  const dark = hydrated && isDark;

  return (
    <button
      type="button"
      aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={dark ? "Modo claro" : "Modo escuro"}
      onClick={toggleTheme}
      className="p-2 rounded-full text-foreground hover:bg-muted transition-colors cursor-pointer"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
