import { Product } from "@/types/product";
import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { Artisan, ArtisanProfileInput } from "@/types/artisan";
import type { Id } from "@/types/common";

export const artisansService = {
  /** Perfis públicos aprovados. Sem e-mail, telefone ou senha. */
  async list(): Promise<Artisan[]> {
    const { data } = await api.get<Artisan[]>(ENDPOINTS.artisans.list);
    return data;
  },

  async getById(id: Id): Promise<Artisan> {
    const { data } = await api.get<Artisan>(ENDPOINTS.artisans.byId(id));
    return data;
  },

  /** Atualiza a biografia e os dados culturais do artesão logado. */
  async updateMyProfile(input: ArtisanProfileInput): Promise<Artisan> {
    const { data } = await api.put<Artisan>(ENDPOINTS.artisans.myProfile, input);
    return data;
  },

  async getMyProducts(id: Id): Promise<Product[]> {
    const { data } = await api.get<Product[]>(ENDPOINTS.artisans.myProducts(id));
    return data;
  },
};
