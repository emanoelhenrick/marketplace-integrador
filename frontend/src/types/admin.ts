import type { Id, ModerationStatus } from "./common";
import type { OrderStatus } from "./order";
import type { User } from "./user";

export interface AdminMetrics {
  revenue: number;
  ordersTotal: number;
  ordersByStatus: Partial<Record<OrderStatus, number>>;
  activeUsers: number;
  activeArtisans: number;
  activeProducts: number;
  topProducts: { productId: Id; name: string; qty: number; revenue: number }[];
}

export type AdminUser = User & { active: boolean };

export interface ModerationDecision {
  status: Exclude<ModerationStatus, "pending">;
  reason?: string;
}
