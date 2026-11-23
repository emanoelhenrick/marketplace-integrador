import { cn } from "cn";
import { stockOf } from "@/lib/catalog";
import type { Product } from "@/types/product";

/** Estado de estoque em uma linha: esgotado, últimas unidades ou disponível. */
export function StockBadge({ product, className }: { product: Product; className?: string }) {
  const stock = stockOf(product);
  const label = stock <= 0 ? "Esgotado" : stock <= 3 ? `Últimas ${stock} unidade${stock > 1 ? "s" : ""}` : "Em estoque";
  const tone = stock <= 0 ? "bg-destructive/10 text-destructive border-destructive/40" : stock <= 3 ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300" : "bg-forest/15 text-forest border-forest/40";
  return <span className={cn("inline-block text-xs font-semibold border rounded-full px-3 py-1", tone, className)}>{label}</span>;
}
