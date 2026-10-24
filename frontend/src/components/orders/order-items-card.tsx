/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBRL } from "@/lib/format";
import type { OrderItem } from "@/types/order";
import type { Product } from "@/types/product";

interface OrderItemsCardProps {
  items: OrderItem[];
  productById: Map<string, Product>;
  totalLabel: string;
  total: number;
  description?: string;
}

export function OrderItemsCard({ items, productById, totalLabel, total, description }: OrderItemsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens do pedido</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, idx) => {
          const product = productById.get(String(item.productId));
          return (
            <div key={idx} className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-md overflow-hidden border shrink-0 bg-muted">
                {product ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold line-clamp-1">
                  {product ? (
                    <Link href={`/produtos/${item.productId}`} className="hover:underline">
                      {product.name}
                    </Link>
                  ) : (
                    `Produto #${item.productId}`
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qtd. {item.quantity} · {formatBRL(item.unitPrice)} / un.
                </p>
                {item.packed && (
                  <p className="text-xs text-forest font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Embalado
                  </p>
                )}
              </div>
              <span className="text-sm font-bold shrink-0">
                {formatBRL(item.unitPrice * item.quantity)}
              </span>
            </div>
          );
        })}

        <div className="flex justify-between items-center pt-4 border-t text-base font-bold">
          <span>{totalLabel}</span>
          <span className="text-brand">{formatBRL(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
