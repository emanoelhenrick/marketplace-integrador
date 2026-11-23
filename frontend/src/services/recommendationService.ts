import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { RecommendationResponse } from "@/types/recommendation";

export const recommendationService = {
  /**
   * Visitante ou usuário sem histórico recebe `strategy: "cold_start"`
   * (mais populares); com histórico, `"personalized"`.
   */
  async get(limit = 8): Promise<RecommendationResponse> {
    const { data } = await api.get<RecommendationResponse>(ENDPOINTS.recommendations, { params: { limit } });
    return data;
  },
};
