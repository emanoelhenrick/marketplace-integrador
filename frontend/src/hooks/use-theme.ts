"use client";

import { useCallback, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "manoa-theme";

function getInitialIsDark() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(getInitialIsDark);

  // Garante que o estado do React reflita a classe já aplicada pelo
  // ThemeScript no <head> (executado antes da hidratação). Sincronizar
  // aqui, em vez de no cálculo do estado inicial, evita divergência
  // entre a marcação renderizada no servidor e a do cliente.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  }, []);

  return { isDark, toggleTheme };
}
