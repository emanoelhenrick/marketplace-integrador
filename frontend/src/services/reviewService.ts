import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { Id } from "@/types/common";
import type { Review, ReviewInput } from "@/types/review";

export const reviewService = {
  async listByProduct(productId: Id): Promise<Review[]> {
    const { data } = await api.get<Review[]>(ENDPOINTS.products.reviews(productId));
    return data;
  },

  /** O servidor recusa (403) se o usuário não comprou o produto. */
  async create(productId: Id, input: ReviewInput): Promise<Review> {
    const { data } = await api.post<Review>(ENDPOINTS.products.reviews(productId), input);
    return data;
  },
};
