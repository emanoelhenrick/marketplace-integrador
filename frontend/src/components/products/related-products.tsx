/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Star } from "lucide-react";

import { useProductTracking } from "@/hooks/use-product-tracking";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/types/product";

function RelatedItem({ product, position, surface }: { product: Product; position: number; surface: string }) {
  const { ref, onClick } = useProductTracking<HTMLAnchorElement>(product.id, surface, position);
  return (
    <Link
      ref={ref}
      onClick={onClick}
      href={`/products/${product.id}`}
      className="group bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 space-y-1">
        <p className="text-xs sm:text-sm font-semibold line-clamp-1">{product.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-brand">{formatBRL(product.price)}</span>
          <span className="flex items-center gap-0.5 text-[10px] sm:text-xs text-muted-foreground">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            {product.stars}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function RelatedProducts({ products, category }: { products: Product[]; category: string }) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Outras peças de {category}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {products.map((related, index) => (
          <RelatedItem key={related.id} product={related} position={index} surface="related" />
        ))}
      </div>
    </section>
  );
}
