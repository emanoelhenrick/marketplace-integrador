"use client";

import { useCallback, useMemo, useState } from "react";
import { parseApiError } from "@/lib/api-error";
import { toast } from "@/lib/toast";
import { averageRating, reviewEligibility } from "@/lib/reviews";
import { validateReview, type FieldErrors } from "@/lib/validation";
import { orderService } from "@/services/orderService";
import { reviewService } from "@/services/reviewService";
import { useAsync } from "@/hooks/use-async";
import { useSession } from "@/hooks/use-session";
import type { Id } from "@/types/common";
import type { Order } from "@/types/order";
import type { Review, ReviewInput } from "@/types/review";

/** Garante a extração segura de arrays mesmo que a API retorne objetos envelopados. */
function normalizeArray<T>(payload: unknown, nestedKey?: string): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (nestedKey && Array.isArray(record[nestedKey])) return record[nestedKey] as T[];
    if (Array.isArray(record.data)) return record.data as T[];
    if (Array.isArray(record.items)) return record.items as T[];
  }
  return [];
}

/** Gerencia avaliações do produto e valida elegibilidade (apenas compradores com pedido pago, 1x por peça). */
export function useProductReviews(productId: Id) {
  const { ready, isAuthenticated, isClient, user } = useSession();

  const reviewsState = useAsync(
    () => reviewService.listByProduct(productId),
    [productId, user?.id],
    ready,
  );

  const ordersState = useAsync(
    () => orderService.listMine(),
    [user?.id],
    ready && isClient,
  );

  const [errors, setErrors] = useState<FieldErrors<ReviewInput>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviews = useMemo(
    () => normalizeArray<Review>(reviewsState.data, "reviews"),
    [reviewsState.data],
  );

  const orders = useMemo(
    () => normalizeArray<Order>(ordersState.data, "orders"),
    [ordersState.data],
  );

  const eligibility = useMemo(
    () =>
      reviewEligibility({
        isAuthenticated,
        isClient,
        orders,
        reviews,
        productId,
      }),
    [isAuthenticated, isClient, orders, reviews, productId],
  );

  const average = useMemo(() => averageRating(reviews), [reviews]);

  const submit = useCallback(
    async (rating: number, comment: string): Promise<boolean> => {
      setSubmitError(null);

      const validation = validateReview({ rating, comment });
      if (!validation.ok) {
        setErrors(validation.errors);
        return false;
      }

      setErrors({});
      if (!eligibility.canReview || isSubmitting) return false;

      setIsSubmitting(true);
      try {
        const created = await reviewService.create(productId, validation.value);
        const optimisticReview: Review = { ...created, mine: true };

        reviewsState.mutate((current) => {
          const currentList = normalizeArray<Review>(current, "reviews");
          return [optimisticReview, ...currentList];
        });

        toast.success("Avaliação registrada", {
          description: "Obrigado por compartilhar sua experiência com a peça!",
        });
        return true;
      } catch (err) {
        const info = parseApiError(err, "Não foi possível registrar a avaliação.");
        setSubmitError(
          info.status === 403
            ? "Apenas clientes que concluíram a compra desta peça podem avaliá-la."
            : info.message,
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [eligibility.canReview, isSubmitting, productId, reviewsState],
  );

  return {
    reviews,
    average,
    isLoading: reviewsState.loading,
    loadError: reviewsState.error ? "Não foi possível carregar as avaliações." : null,
    eligibility,
    errors,
    submitError,
    isSubmitting,
    submit,
  };
}