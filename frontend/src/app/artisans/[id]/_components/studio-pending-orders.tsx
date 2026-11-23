"use client";

import { PendingOrderCard } from "@/app/artisans/_components/pending-order-card";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

interface StudioPendingOrdersProps {
  artisanId: number | string;
  orders: Order[];
  productById: Map<string, Product>;
  canConfirm: boolean;
  onOrderUpdated: (order: Order) => void;
}

export function StudioPendingOrders({ artisanId, orders, productById, canConfirm, onOrderUpdated }: StudioPendingOrdersProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
        <div>
          <span className="text-[10px] font-bold text-destructive tracking-widest uppercase">• Atenção imediata</span>
          <h2 className="text-xl sm:text-2xl font-heading font-bold">Pedidos aguardando preparo e embalagem</h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {orders.length} {orders.length === 1 ? "pedido precisa" : "pedidos precisam"} de atenção
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground text-sm">
          Nenhum pedido pago aguardando embalagem no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {orders.map((order) => (
            <PendingOrderCard
              key={order.id}
              order={order}
              artisanId={artisanId}
              productById={productById}
              canConfirm={canConfirm}
              onUpdated={onOrderUpdated}
            />
          ))}
        </div>
      )}
    </section>
  );
}
