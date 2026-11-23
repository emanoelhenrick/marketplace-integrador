import { normalizeText } from "@/lib/text";
import type { Product, ProductQuery } from "@/types/product";

export const isPublished = (p: Product): boolean =>
  p.active !== false && (p.moderationStatus ?? "approved") === "approved";

export const stockOf = (p: Pick<Product, "quantity">): number =>
  Number.isFinite(p.quantity) ? Math.max(0, p.quantity) : 0;

export const isPurchasable = (p: Product): boolean =>
  isPublished(p) && stockOf(p) > 0;

export const isVisibleInCatalog = isPurchasable;

function searchableText(p: Product): string {
  return normalizeText(
    [
      p.name,
      p.description,
      p.story,
      p.category,
      p.technique,
      p.region,
      p.location,
      p.artisan?.name,
    ].join(" "),
  );
}

export function filterCatalog(
  products: Product[],
  query: ProductQuery,
): Product[] {
  const terms = normalizeText(query.q).split(/\s+/).filter(Boolean);

  return products.filter((p) => {
    if (!isVisibleInCatalog(p)) return false;
    if (query.category && p.category !== query.category) return false;
    if (query.technique && p.technique !== query.technique) return false;
    if (query.region && p.region !== query.region) return false;
    if (terms.length === 0) return true;
    const haystack = searchableText(p);
    return terms.every((term) => haystack.includes(term));
  });
}

export const hasActiveFilters = (q: ProductQuery): boolean =>
  !!(q.q?.trim() || q.category || q.technique || q.region);

export function uniqueValues(
  products: Product[],
  key: "category" | "technique" | "region",
): string[] {
  return Array.from(
    new Set(products.map((p) => p[key]).filter((v): v is string => !!v)),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function countLocalities(products: Product[]): number {
  return new Set(products.map((p) => p.location).filter(Boolean)).size;
}
