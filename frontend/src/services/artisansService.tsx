// src/services/artesiansService.ts
import { Artisan } from "@/types/artisan";
import { api } from "./api";

export const artesiansService = {
  async getAll(): Promise<Artisan[]> {
    const response = await api.get<Artisan[]>("/users?role=artisan");
    return response.data;
  },

  async getById(id: number): Promise<Artisan> {
    const response = await api.get<Artisan>(`/users/${id}`);
    return response.data;
  },
};