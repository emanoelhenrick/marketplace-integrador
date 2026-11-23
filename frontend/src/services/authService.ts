import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { AuthResponse, LoginCredentials, User } from "@/types/user";

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: string;
  avatarUrl?: string;
  phone?: string;
  craft?: string;
  craftYears?: number;
  quote?: string;
  location?: string;
  polo?: string;
  region?: string;
  totalWorks?: number;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(ENDPOINTS.auth.login, credentials);
    return data;
  },

  async register(payload: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(ENDPOINTS.auth.register, payload);
    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<{ user: User }>(ENDPOINTS.auth.me);
    return data.user;
  },
};
