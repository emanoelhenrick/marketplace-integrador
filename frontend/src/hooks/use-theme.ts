"use client";

import { useCallback, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "manoa-theme";

function getInitialIsDark() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(getInitialIsDark);

  useEffect(() => {
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
