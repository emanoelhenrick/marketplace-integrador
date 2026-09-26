import { api } from "./api";
import { Product } from "@/types/product";

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>("/products");
    return response.data;
  },

  async getByCategory(category: string): Promise<Product[]> {
    const response = await api.get<Product[]>("/products", {
      params: { category },
    });
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getByArtisan(artisanId: number): Promise<Product[]> {
    const response = await api.get<Product[]>("/products", {
      params: { artisanId },
    });
    return response.data;
  },

  async create(
    product: Omit<Product, "id" | "artisan">,
  ): Promise<Product> {
    const response = await api.post<Product>("/products", product);
    return response.data;
  },
};
