import type { Id } from "./common";

export type UserRole = "client" | "artisan" | "admin";

export interface User {
  id: Id;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  createdAt?: string;
  /** Conta desativada não consegue entrar, mas o histórico (pedidos, avaliações) é mantido. */
  active?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
