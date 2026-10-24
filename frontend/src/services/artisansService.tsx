import { Artisan } from "@/types/artisan";
import { api } from "./api";

export const artesiansService = {
  async getAll(): Promise<Artisan[]> {
    const response = await api.get<Artisan[]>("/users", { params: { role: "artisan" } });
    return response.data.map(stripPrivate);
  },

  async getById(id: number | string): Promise<Artisan> {
    const response = await api.get<Artisan>(`/users/${id}`);
    if (response.data.role !== "artisan") throw new Error("Usuário não é artesão");
    return stripPrivate(response.data);
  },
};

/** Garante que dados privados do cadastro nunca cheguem às telas públicas. */
function stripPrivate(artisan: Artisan): Artisan {
  const safe = { ...artisan };
  delete safe.password;
  return safe;
}
