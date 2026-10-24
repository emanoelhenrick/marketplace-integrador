export interface OrderItem {
  productId: number;
  artisanId: number;
  quantity: number;
  unitPrice: number;
  packed?: boolean;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number | string;
  userId: number | string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}
