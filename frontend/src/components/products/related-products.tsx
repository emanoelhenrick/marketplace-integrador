/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Star } from "lucide-react";

import { formatBRL } from "@/lib/format";
import type { Product } from "@/types/product";

export function RelatedProducts({ products, category }: { products: Product[]; category: string }) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Outras peças de {category}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {products.map((related) => (
          <Link
            key={related.id}
            href={`/produtos/${related.id}`}
            className="group bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src={related.image}
                alt={related.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 space-y-1">
              <p className="text-xs sm:text-sm font-semibold line-clamp-1">{related.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-brand">
                  {formatBRL(related.price)}
                </span>
                <span className="flex items-center gap-0.5 text-[10px] sm:text-xs text-muted-foreground">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {related.stars}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
