import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { AdminMetrics, AdminUser, ModerationDecision } from "@/types/admin";
import type { Artisan } from "@/types/artisan";
import type { Id } from "@/types/common";
import type { Product } from "@/types/product";

export const adminService = {
  async getMetrics(): Promise<AdminMetrics> {
    const { data } = await api.get<AdminMetrics>(ENDPOINTS.admin.metrics);
    return data;
  },

  async listUsers(): Promise<AdminUser[]> {
    const { data } = await api.get<AdminUser[]>(ENDPOINTS.admin.users);
    return data;
  },

  /** Ativa/desativa a conta. Nunca apaga: pedidos e avaliações permanecem. */
  async setUserActive(id: Id, active: boolean): Promise<AdminUser> {
    const { data } = await api.patch<AdminUser>(ENDPOINTS.admin.userActive(id), { active });
    return data;
  },

  async listProducts(): Promise<Product[]> {
    const { data } = await api.get<Product[]>(ENDPOINTS.admin.products);
    return data;
  },

  async moderateProduct(id: Id, decision: ModerationDecision): Promise<Product> {
    const { data } = await api.patch<Product>(ENDPOINTS.admin.productModeration(id), decision);
    return data;
  },

  async listArtisans(): Promise<Artisan[]> {
    const { data } = await api.get<Artisan[]>(ENDPOINTS.admin.artisans);
    return data;
  },

  async moderateArtisan(id: Id, decision: ModerationDecision): Promise<Artisan> {
    const { data } = await api.patch<Artisan>(ENDPOINTS.admin.artisanModeration(id), decision);
    return data;
  },
};
