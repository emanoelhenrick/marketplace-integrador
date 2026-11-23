import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { Id } from "@/types/common";
import type { Product, ProductInput, ProductQuery } from "@/types/product";

export const productService = {
  async list(query: ProductQuery = {}): Promise<Product[]> {
    const params = Object.fromEntries(
      Object.entries(query).filter(([, value]) => typeof value === "string" && value.trim() !== ""),
    );
    const { data } = await api.get<Product[]>(ENDPOINTS.products.list, { params });
    return data;
  },

  async getByIds(ids: Id[]): Promise<Product[]> {
    const { data } = await api.get<Product[]>(ENDPOINTS.products.list, {
      params: { ids: ids.join(","), includeUnavailable: true },
    });
    return data;
  },

  async getById(id: Id): Promise<Product> {
    const { data } = await api.get<Product>(ENDPOINTS.products.byId(id));
    return data;
  },

  async listMine(): Promise<Product[]> {
    const { data } = await api.get<Product[]>(ENDPOINTS.products.mine);
    return data;
  },

  async listByArtisan(): Promise<Product[]> {
    const { data } = await api.get<Product[]>(ENDPOINTS.products.list);
    return data;
  },

  async create(input: ProductInput): Promise<Product> {
    const { data } = await api.post<Product>(ENDPOINTS.products.list, input);
    return data;
  },

  async update(id: Id, input: ProductInput): Promise<Product> {
    const { data } = await api.put<Product>(ENDPOINTS.products.byId(id), input);
    return data;
  },

  async setActive(id: Id, active: boolean): Promise<Product> {
    const { data } = await api.patch<Product>(ENDPOINTS.products.status(id), { active });
    return data;
  },

  async setStock(id: Id, stock: number): Promise<Product> {
    const { data } = await api.patch<Product>(ENDPOINTS.products.stock(id), { stock });
    return data;
  },
};
