import type { Product } from "./product";

export type RecommendationStrategy = "personalized" | "cold_start";

export interface RecommendationResponse {
  strategy: RecommendationStrategy;
  items: Product[];
}

export type TrackedEventType = "impression" | "click";

/**
 * Evento de interação. Campos fechados de propósito: nada de id, nome, e-mail
 * ou token do usuário. `sessionId` é um UUID aleatório por aba, sem vínculo
 * com a conta.
 */
export interface TrackedEvent {
  type: TrackedEventType;
  productId: string;
  surface: string;
  position?: number;
  sessionId: string;
  timestamp: string;
}
