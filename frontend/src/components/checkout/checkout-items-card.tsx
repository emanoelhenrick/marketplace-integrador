import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBRL } from "@/lib/format";
import { fromCents, lineTotalCents } from "@/lib/money";
import type { CartItem } from "@/types/product";

export function CheckoutItemsCard({ items, totalItems }: { items: CartItem[]; totalItems: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens ({totalItems})</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between gap-3 py-3 text-sm">
            <span className="min-w-0 truncate">
              {quantity}× {product.name}
            </span>
            <span className="font-semibold shrink-0">{formatBRL(fromCents(lineTotalCents(product.price, quantity)))}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
