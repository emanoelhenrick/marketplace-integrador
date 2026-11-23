"use client";

import Link from "next/link";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { StarDisplay } from "@/components/reviews/star-rating";
import { useProductReviews } from "@/hooks/use-product-reviews";
import { REVIEW_BLOCK_MESSAGE } from "@/lib/reviews";
import type { Id } from "@/types/common";

export function ProductReviews({ productId }: { productId: Id }) {
  const { reviews, average, isLoading, loadError, eligibility, errors, submitError, isSubmitting, submit } =
    useProductReviews(productId);

  return (
    <section id="avaliacoes" aria-labelledby="avaliacoes-titulo" className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="avaliacoes-titulo" className="text-xl sm:text-2xl font-bold">
          Avaliações
        </h2>
        {reviews.length > 0 && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <StarDisplay value={average} />
            {average.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}
          </span>
        )}
      </div>

      {eligibility.canReview ? (
        <ReviewForm errors={errors} submitError={submitError} isSubmitting={isSubmitting} onSubmit={submit} />
      ) : (
        <p className="text-sm text-muted-foreground border rounded-md p-3 bg-muted/40">
          {REVIEW_BLOCK_MESSAGE[eligibility.reason]}{" "}
          {eligibility.reason === "guest" && (
            <Link href={`/login?redirect=${encodeURIComponent(`/products/${productId}`)}`} className="text-brand font-semibold hover:underline">
              Entrar
            </Link>
          )}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground" role="status">
          Carregando avaliações...
        </p>
      ) : loadError ? (
        <p role="alert" className="text-sm text-destructive">
          {loadError}
        </p>
      ) : (
        <ReviewList reviews={reviews} />
      )}
    </section>
  );
}
