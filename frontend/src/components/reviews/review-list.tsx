import { StarDisplay } from "@/components/reviews/star-rating";
import { formatDate } from "@/lib/format";
import type { Review } from "@/types/review";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">Esta peça ainda não recebeu avaliações.</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="border rounded-md p-4 space-y-1.5 bg-card">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">
              {review.authorName}
              {review.mine && <span className="ml-2 text-xs text-brand font-medium">(você)</span>}
            </p>
            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
          </div>
          <StarDisplay value={review.rating} />
          {review.comment && <p className="text-sm text-foreground/90 whitespace-pre-line">{review.comment}</p>}
        </li>
      ))}
    </ul>
  );
}
