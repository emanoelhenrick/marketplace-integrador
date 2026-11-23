import { ARTISAN_SHARE } from "@/lib/constants";
import { lineTotalCents, fromCents } from "@/lib/money";
import { PAID_STATUSES } from "@/lib/order-status";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

export interface SalesRow {
  name: string;
  qty: number;
  revenue: number;
}

export const byNewest = (a: Order, b: Order) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

const sameId = (a: unknown, b: unknown) => String(a) === String(b);

export function aggregateSales(items: Order["items"], productById: Map<string, Product>, limit = 5): SalesRow[] {
  const sales = new Map<string, { name: string; qty: number; cents: number }>();
  items.forEach((item) => {
    const key = String(item.productId);
    const current = sales.get(key) ?? { name: productById.get(key)?.name ?? `Produto #${key}`, qty: 0, cents: 0 };
    current.qty += item.quantity;
    current.cents += lineTotalCents(item.unitPrice, item.quantity);
    sales.set(key, current);
  });
  return Array.from(sales.values())
    .map(({ name, qty, cents }) => ({ name, qty, revenue: fromCents(cents) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function buildClientData(orders: Order[]) {
  const myOrders = [...orders].sort(byNewest);
  const active = myOrders.filter((o) => o.status !== "cancelled");
  return {
    myOrders,
    totalSpent: fromCents(active.reduce((sum, o) => sum + Math.round(o.totalAmount * 100), 0)),
    totalItems: active.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0),
    pendingCount: myOrders.filter((o) => o.status === "pending" || o.status === "paid").length,
  };
}

/** Itens de um artesão dentro de um pedido (nunca os de outro). */
export const itemsOfArtisan = (order: Order, artisanId: number | string) =>
  order.items.filter((item) => sameId(item.artisanId, artisanId));

export const subtotalOf = (items: Order["items"]) =>
  fromCents(items.reduce((sum, i) => sum + lineTotalCents(i.unitPrice, i.quantity), 0));

export function buildArtisanData(orders: Order[], myProducts: Product[], artisanId: number | string, productById: Map<string, Product>) {
  const entries = orders
    .filter((order) => order.status !== "cancelled")
    .map((order) => {
      const myItems = itemsOfArtisan(order, artisanId);
      return { order, myItems, subtotal: subtotalOf(myItems) };
    })
    .filter((entry) => entry.myItems.length > 0)
    .sort((a, b) => byNewest(a.order, b.order));

  return {
    myProducts,
    entries,
    totalRevenue: fromCents(entries.reduce((sum, e) => sum + Math.round(e.subtotal * 100), 0)),
    totalUnitsSold: entries.reduce((sum, e) => sum + e.myItems.reduce((s, i) => s + i.quantity, 0), 0),
    avgStars: myProducts.length ? myProducts.reduce((sum, p) => sum + p.stars, 0) / myProducts.length : 0,
    topProducts: aggregateSales(entries.flatMap((e) => e.myItems), productById),
  };
}

/** Repasse = 85% das vendas já pagas, só com as peças do artesão. */
export function computeRepasse(orders: Order[], artisanId: number | string): number {
  const cents = orders
    .filter((o) => PAID_STATUSES.includes(o.status))
    .reduce((acc, o) => acc + itemsOfArtisan(o, artisanId).reduce((s, i) => s + lineTotalCents(i.unitPrice, i.quantity), 0), 0);
  return fromCents(Math.round(cents * ARTISAN_SHARE));
}
