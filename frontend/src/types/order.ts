import type { Id } from "./common";

export interface OrderItem {
  productId: Id;
  artisanId: Id;
  quantity: number;
  unitPrice: number;
  packed?: boolean;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export type PaymentMethod = "pix" | "credit_card" | "boleto";

export interface Order {
  id: Id;
  userId: Id;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  paymentMethod?: PaymentMethod;
}

/** O servidor recalcula preços e total; o cliente só envia o que quer comprar. */
export interface CreateOrderPayload {
  items: { productId: Id; quantity: number }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}
