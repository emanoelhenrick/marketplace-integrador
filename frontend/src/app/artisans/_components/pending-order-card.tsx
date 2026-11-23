/* eslint-disable @next/next/no-img-element */
"use client";

import { CheckCircle2, Clock, Loader2, MapPin, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOrderMutations } from "@/hooks/use-order-mutations";
import { formatBRL, formatDateTime } from "@/lib/format";
import { itemsOfArtisan } from "@/lib/metrics";
import { toast } from "@/lib/toast";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

interface PendingOrderCardProps {
  order: Order;
  artisanId: number | string;
  productById: Map<string, Product>;
  canConfirm: boolean;
  onUpdated: (order: Order) => void;
}

/** Um pedido pago aguardando embalagem. Mostra só as peças do artesão e o endereço de envio. */
export function PendingOrderCard({ order, artisanId, productById, canConfirm, onUpdated }: PendingOrderCardProps) {
  const { busy, pack } = useOrderMutations(order, onUpdated);
  const mine = itemsOfArtisan(order, artisanId).filter((i) => !i.packed);
  const a = order.shippingAddress;

  return (
    <div className="bg-card border rounded-lg p-5 flex flex-col justify-between gap-4 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-brand-strong">Pedido #{order.id}</span>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatDateTime(order.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground flex items-start gap-1">
          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
          {a ? `${a.recipientName} · ${a.street}, ${a.number} · ${a.neighborhood}, ${a.city}/${a.state}` : `Destino: ${order.customerName}`}
        </p>

        <ul className="space-y-2">
          {mine.map((item, idx) => {
            const product = productById.get(String(item.productId));
            return (
              <li key={idx} className="flex gap-3 items-center">
                {product && <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-md border shrink-0 bg-muted" />}
                <div className="min-w-0 text-sm">
                  <p className="font-bold leading-snug line-clamp-2">{product?.name ?? `Produto #${item.productId}`}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity}× · {formatBRL(item.unitPrice)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-xs bg-gold/15 text-foreground px-2 py-1 rounded border border-gold/30">
          Preparo: embalar com a caixa reforçada e selo de autenticidade da Manoa.
        </p>
      </div>

      <div className="pt-3 border-t flex items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={() => toast.info("Impressão de etiqueta ainda não disponível")}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Imprimir etiqueta
        </button>
        {canConfirm && (
          <Button onClick={pack} disabled={busy} className="cursor-pointer flex items-center gap-1.5">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Confirmar embalado
          </Button>
        )}
      </div>
    </div>
  );
}
