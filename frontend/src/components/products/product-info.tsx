import { MapPin, Star } from "lucide-react";
import { StockBadge } from "@/components/products/stock-badge";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/types/product";

export function ProductInfo({ product }: { product: Product }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <span className="inline-block text-xs font-bold bg-forest/15 border border-forest/50 text-forest rounded-3xl px-4 py-1.5 uppercase tracking-wide">
            {product.category}
          </span>
          {product.technique && (
            <span className="inline-block text-xs font-bold border rounded-3xl px-4 py-1.5 uppercase tracking-wide text-muted-foreground">
              {product.technique}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug">{product.name}</h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <strong className="text-foreground">{product.stars}</strong>
            {typeof product.reviewsCount === "number" && <span>({product.reviewsCount})</span>}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-brand-strong" />
            {[product.location, product.region].filter(Boolean).join(" · ")}
          </span>
        </div>
      </div>

      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>

      <div className="pt-2 space-y-2">
        <p className="text-3xl sm:text-4xl font-bold">{formatBRL(product.price)}</p>
        <StockBadge product={product} />
      </div>
    </div>
  );
}
