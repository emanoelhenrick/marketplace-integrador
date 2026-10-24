/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Loader2, MapPin, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBRL, formatDateTime } from "@/lib/format";
import { toast } from "@/lib/toast";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

interface StudioPendingOrdersProps {
  artisanId: number | string;
  orders: Order[];
  productById: Map<string, Product>;
  canConfirm: boolean;
  onOrderUpdated: (order: Order) => void;
}

export function StudioPendingOrders({
  artisanId,
  orders,
  productById,
  canConfirm,
  onOrderUpdated,
}: StudioPendingOrdersProps) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleConfirm = async (order: Order) => {
    setBusyId(String(order.id));
    try {
      const updated = await orderService.markItemsPacked(order, artisanId);
      onOrderUpdated(updated);
      toast.success("Peças marcadas como embaladas", {
        description:
          updated.status === "shipped"
            ? `Pedido #${order.id} pronto para envio.`
            : `Pedido #${order.id}: aguardando os demais artesãos.`,
      });
    } catch (err) {
      console.error("Erro ao confirmar embalagem:", err);
      toast.error("Não foi possível confirmar a embalagem", {
        description: "Tente novamente.",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
        <div>
          <span className="text-[10px] font-bold text-destructive tracking-widest uppercase">
            • Atenção imediata
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-bold">
            Pedidos aguardando preparo e embalagem
          </h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {orders.length}{" "}
          {orders.length === 1 ? "pedido precisa" : "pedidos precisam"} de
          atenção
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground text-sm">
          Nenhum pedido pago aguardando embalagem no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {orders.map((order) => {
            const mine = order.items.filter(
              (i) => String(i.artisanId) === String(artisanId) && !i.packed,
            );
            return (
              <div
                key={order.id}
                className="bg-card border rounded-lg p-5 flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-brand-strong">
                      Pedido #{order.id}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{" "}
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Destino: {order.customerName}
                  </p>

                  <ul className="space-y-2">
                    {mine.map((item, idx) => {
                      const product = productById.get(String(item.productId));
                      return (
                        <li key={idx} className="flex gap-3 items-center">
                          {product && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-md border shrink-0 bg-muted"
                            />
                          )}
                          <div className="min-w-0 text-sm">
                            <p className="font-bold leading-snug line-clamp-2">
                              {product?.name ?? `Produto #${item.productId}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity}× · {formatBRL(item.unitPrice)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="text-xs bg-gold/15 text-foreground px-2 py-1 rounded border border-gold/30">
                    Preparo: embalar com a caixa reforçada e selo de
                    autenticidade da Manoa.
                  </p>
                </div>

                <div className="pt-3 border-t flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Impressão de etiqueta ainda não disponível")
                    }
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Imprimir etiqueta
                  </button>
                  {canConfirm && (
                    <Button
                      onClick={() => handleConfirm(order)}
                      disabled={busyId === String(order.id)}
                      className="cursor-pointer flex items-center gap-1.5"
                    >
                      {busyId === String(order.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Confirmar embalado
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
