export class ReviewEntity {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: number;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ReviewEntity> = {}) {
    this.id = data.id ?? "";
    this.rating = data.rating ?? 0;
    this.comment = data.comment ?? "";
    this.userId = data.userId ?? "";
    this.productId = data.productId ?? 0;
    this.orderId = data.orderId ?? "";
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}
