"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

import { FormField } from "@/components/common/form-field";
import { StarInput } from "@/components/reviews/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MAX_COMMENT_LENGTH } from "@/lib/constants";
import type { FieldErrors } from "@/lib/validation";
import type { ReviewInput } from "@/types/review";

interface ReviewFormProps {
  errors: FieldErrors<ReviewInput>;
  submitError: string | null;
  isSubmitting: boolean;
  onSubmit: (rating: number, comment: string) => Promise<boolean>;
}

export function ReviewForm({ errors, submitError, isSubmitting, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onSubmit(rating, comment);
    if (ok) {
      setRating(0);
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-md p-4 sm:p-5 bg-brand-soft" noValidate>
      <p className="text-sm font-semibold">Conte como foi a sua experiência</p>

      <FormField id="review-rating" label="Sua nota" error={errors.rating}>
        <StarInput value={rating} onChange={setRating} disabled={isSubmitting} />
      </FormField>

      <FormField id="review-comment" label="Comentário (opcional)" error={errors.comment} hint={`${comment.length}/${MAX_COMMENT_LENGTH}`}>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={MAX_COMMENT_LENGTH + 50}
          aria-invalid={!!errors.comment}
          disabled={isSubmitting}
          placeholder="O que você achou da peça, do acabamento, da entrega..."
        />
      </FormField>

      {submitError && (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="cursor-pointer flex items-center gap-2">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Enviar avaliação
      </Button>
    </form>
  );
}
