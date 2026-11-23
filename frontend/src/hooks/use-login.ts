"use client";

import { useState } from "react";
import { mapAuthError } from "@/lib/auth-error";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import type { LoginCredentials, User } from "@/types/user";

function decodeJwtPayload(token: string): Partial<User> {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function useLogin() {
  const storeLogin = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setError(null);
    setIsLoading(true);
    try {
      const { token } = await authService.login(credentials);
      const payload = decodeJwtPayload(token);

      const user: User = {
        ...payload,
        id: String(payload.id ?? ""),
        email: payload.email ?? credentials.email,
        role: payload.role ?? "client",
        active: payload.active ?? true,
      } as User;

      if (user.active === false) {
        setError("Esta conta está desativada. Entre em contato com a administração.");
        return null;
      }

      storeLogin(user, token);
      return user;
    } catch (err) {
      console.error(err);
      setError(mapAuthError(err).message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
}