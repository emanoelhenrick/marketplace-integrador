export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export class OrderEntity {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<OrderEntity> = {}) {
    this.id = data.id ?? "";
    this.userId = data.userId ?? "";
    this.customerName = data.customerName ?? "";
    this.customerEmail = data.customerEmail ?? "";
    this.status = data.status ?? "paid";
    this.totalAmount = data.totalAmount ?? 0;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}
