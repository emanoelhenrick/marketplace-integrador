import { PAID_STATUSES } from "@/lib/order-status";
import type { Id } from "@/types/common";
import type { Order } from "@/types/order";
import type { Review } from "@/types/review";

/** Compra efetiva = pedido pago (ou além) que contém o produto. Pendente/cancelado não conta. */
export function hasPurchased(orders: Order[], productId: Id): boolean {
  return orders.some(
    (o) => PAID_STATUSES.includes(o.status) && o.items.some((i) => String(i.productId) === String(productId)),
  );
}

export type ReviewEligibility =
  | { canReview: true }
  | { canReview: false; reason: "guest" | "not_client" | "not_purchased" | "already_reviewed" };

export function reviewEligibility(params: {
  isAuthenticated: boolean;
  isClient: boolean;
  orders: Order[];
  reviews: Review[];
  productId: Id;
}): ReviewEligibility {
  if (!params.isAuthenticated) return { canReview: false, reason: "guest" };
  if (!params.isClient) return { canReview: false, reason: "not_client" };
  if (!hasPurchased(params.orders, params.productId)) return { canReview: false, reason: "not_purchased" };
  if (params.reviews.some((r) => r.mine)) return { canReview: false, reason: "already_reviewed" };
  return { canReview: true };
}

export const REVIEW_BLOCK_MESSAGE = {
  guest: "Entre na sua conta para avaliar esta peça.",
  not_client: "Apenas clientes que compraram a peça podem avaliá-la.",
  not_purchased: "Você poderá avaliar esta peça depois de comprá-la.",
  already_reviewed: "Você já avaliou esta peça. Obrigado!",
} as const;

export function averageRating(reviews: Review[]): number {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
