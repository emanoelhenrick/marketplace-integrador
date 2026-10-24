/* eslint-disable @next/next/no-img-element */
"use client";

import { ShoppingCartPlus, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useSession } from "@/hooks/use-session";
import { formatBRL } from "@/lib/format";

export interface CardProductProps {
  product: Product;
}

export function CardImageProduct({ product }: CardProductProps) {
  const addToCart = useAddToCart();
  const { canPurchase } = useSession();

  const artisanName =
    typeof product.artisan === "object" && product.artisan !== null
      ? product.artisan.name
      : "Acervo Manoa";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link href={`/produtos/${product.id}`} className="block h-full">
      <Card className="mx-auto w-full max-w-sm h-full pt-0 bg-brand-soft cursor-pointer hover:scale-[1.01] transition-transform">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
            <span className="bg-card text-brand text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              {product.category}
            </span>
            <span className="bg-card text-brand text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              {product.location}
            </span>
          </div>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <CardHeader>
          <div className="flex justify-between gap-2 min-h-7">
            <p className="text-forest truncate">{artisanName}</p>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="fill-gold text-gold size-4" />
              <p className="text-gold font-bold">{product.stars}</p>
            </div>
          </div>
          <CardTitle className="font-bold text-xl sm:text-2xl line-clamp-2 min-h-14">
            {product.name}
          </CardTitle>

          <CardDescription className="line-clamp-3 min-h-15">{product.description}</CardDescription>

          <hr className="my-2" />
          <div className="flex justify-between items-center gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Preço</p>
              <p className="text-xl sm:text-2xl font-bold">{formatBRL(product.price)}</p>
            </div>
            {canPurchase && (
              <Button
                className="py-2 px-4 sm:px-6 cursor-pointer"
                size="sm"
                onClick={handleAdd}
                aria-label={`Adicionar ${product.name} ao carrinho`}
              >
                <ShoppingCartPlus /> Comprar
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
