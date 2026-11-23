import { MAX_QTY_PER_LINE } from "@/lib/constants";
import { stockOf, isPurchasable } from "@/lib/catalog";
import { lineTotalCents, fromCents } from "@/lib/money";
import type { CartItem, Product } from "@/types/product";
import type { Id } from "@/types/common";

export type CartBlockReason = "invalid_quantity" | "unavailable" | "out_of_stock" | "limit_reached";

export interface AddResult {
  items: CartItem[];
  added: number;
  reason?: CartBlockReason;
}

const same = (a: Id, b: Id) => String(a) === String(b);

/** Maior quantidade que se pode ter na linha: saldo do estoque, limitado a MAX_QTY_PER_LINE. */
export const maxQuantityFor = (product: Product): number => Math.min(stockOf(product), MAX_QTY_PER_LINE);

export const isValidQuantity = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 1;

/**
 * Adiciona ao carrinho respeitando estoque. Quantidade inválida (0, negativa,
 * fracionada, NaN) é recusada; excesso é aparado no limite e sinalizado.
 */
export function addToCart(items: CartItem[], product: Product, quantity: number): AddResult {
  if (!isValidQuantity(quantity)) return { items, added: 0, reason: "invalid_quantity" };
  if (!isPurchasable(product)) {
    return { items, added: 0, reason: stockOf(product) <= 0 ? "out_of_stock" : "unavailable" };
  }

  const max = maxQuantityFor(product);
  const existing = items.find((i) => same(i.product.id, product.id));
  const current = existing?.quantity ?? 0;
  const next = Math.min(current + quantity, max);
  const added = next - current;

  if (added <= 0) return { items, added: 0, reason: "limit_reached" };

  const updated = existing
    ? items.map((i) => (same(i.product.id, product.id) ? { product, quantity: next } : i))
    : [...items, { product, quantity: next }];

  return { items: updated, added, reason: added < quantity ? "limit_reached" : undefined };
}

/** Define a quantidade da linha. <= 0 remove; acima do estoque é aparado. */
export function setQuantity(items: CartItem[], productId: Id, quantity: number): CartItem[] {
  if (!Number.isFinite(quantity) || quantity < 1) return items.filter((i) => !same(i.product.id, productId));
  const wanted = Math.floor(quantity);
  return items.map((i) =>
    same(i.product.id, productId) ? { ...i, quantity: Math.min(wanted, maxQuantityFor(i.product)) } : i,
  );
}

export function cartTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce((sum, i) => sum + lineTotalCents(i.product.price, i.quantity), 0);
  return { totalItems, totalCents, total: fromCents(totalCents) };
}

export interface StockIssue {
  productId: Id;
  name: string;
  requested: number;
  available: number;
  /** "unavailable" = inativo/removido; "out_of_stock" = saldo zerado; "insufficient" = saldo menor que o pedido. */
  kind: "unavailable" | "out_of_stock" | "insufficient";
}

/** Compara o carrinho com os dados frescos do servidor e lista o que não pode ser comprado. */
export function findStockIssues(items: CartItem[], fresh: Product[]): StockIssue[] {
  const byId = new Map(fresh.map((p) => [String(p.id), p]));
  const issues: StockIssue[] = [];

  for (const { product, quantity } of items) {
    const current = byId.get(String(product.id));
    if (!current || !isPurchasable({ ...current })) {
      const available = current ? stockOf(current) : 0;
      issues.push({
        productId: product.id,
        name: product.name,
        requested: quantity,
        available,
        kind: current && available <= 0 && current.active !== false ? "out_of_stock" : "unavailable",
      });
      continue;
    }
    const available = stockOf(current);
    if (quantity > available) {
      issues.push({ productId: product.id, name: product.name, requested: quantity, available, kind: "insufficient" });
    }
  }
  return issues;
}

/** Atualiza snapshots do carrinho com os dados frescos, aparando quantidades e removendo o indisponível. */
export function reconcileCart(items: CartItem[], fresh: Product[]): CartItem[] {
  const byId = new Map(fresh.map((p) => [String(p.id), p]));
  const result: CartItem[] = [];
  for (const { product, quantity } of items) {
    const current = byId.get(String(product.id));
    if (!current || !isPurchasable(current)) continue;
    const q = Math.min(quantity, maxQuantityFor(current));
    if (q >= 1) result.push({ product: current, quantity: q });
  }
  return result;
}
