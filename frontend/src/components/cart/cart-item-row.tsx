/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatBRL } from "@/lib/format";
import { toast } from "@/lib/toast";
import { useCartStore } from "@/store/cardStore";
import type { CartItem } from "@/types/product";

export function CartItemRow({ item }: { item: CartItem }) {
  const { product, quantity } = item;
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const addItem = useCartStore((s) => s.addItem);

  const handleRemove = () => {
    removeItem(product.id);
    toast.info(`"${product.name}" removido do carrinho`, {
      action: { label: "Desfazer", onClick: () => addItem(product, quantity) },
    });
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href={`/produtos/${product.id}`}
          className="relative h-20 w-20 overflow-hidden rounded-md border shrink-0 bg-muted"
        >
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </Link>

        <div className="flex-1 space-y-1 text-center sm:text-left w-full sm:w-auto min-w-0">
          <h2 className="font-semibold text-base line-clamp-1">{product.name}</h2>
          <p className="text-sm font-bold text-brand">{formatBRL(product.price)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Diminuir quantidade"
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="text-sm font-medium w-6 text-center" aria-live="polite">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Aumentar quantidade"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <span className="font-semibold text-sm text-right">
            {formatBRL(product.price * quantity)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label={`Remover ${product.name}`}
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
