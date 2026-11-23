"use client";

import { useState } from "react";
import { mapAuthError } from "@/lib/auth-error";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import type { User, UserRole } from "@/types/user";

export interface RegisterAddress {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
  role: Extract<UserRole, "client" | "artisan">;
  address: RegisterAddress;
}

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

export function useRegister() {
  const storeLogin = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (data: RegisterPayload): Promise<User | null> => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authService.register(data);

      if ("token" in response && response.token) {
        const payload = decodeJwtPayload(response.token);
        const user: User = {
          ...payload,
          id: String(payload.id ?? ""),
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: payload.role ?? data.role,
          active: true,
        } as User;

        storeLogin(user, response.token);
        return user;
      }

      return {
        id: String((response as Partial<User>).id ?? ""),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        active: true,
      } as User;
    } catch (err) {
      setError(mapAuthError(err).message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, error, isLoading };
}