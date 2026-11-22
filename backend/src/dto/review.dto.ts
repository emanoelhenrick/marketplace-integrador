export interface CreateReviewDto {
  productId?: number | string;
  orderId?: string;
  rating?: number | string;
  comment?: string;
}
