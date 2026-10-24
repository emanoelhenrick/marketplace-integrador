export type UserRole = "client" | "artisan" | "admin";

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  createdAt?: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
