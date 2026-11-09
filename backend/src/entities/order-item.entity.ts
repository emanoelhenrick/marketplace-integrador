export class OrderItemEntity {
  id: string;
  orderId: string;
  productId: number;
  artisanId: string | null;
  quantity: number;
  unitPrice: number;
  packed: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<OrderItemEntity> = {}) {
    this.id = data.id ?? "";
    this.orderId = data.orderId ?? "";
    this.productId = data.productId ?? 0;
    this.artisanId = data.artisanId ?? null;
    this.quantity = data.quantity ?? 1;
    this.unitPrice = data.unitPrice ?? 0;
    this.packed = data.packed ?? false;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}
