import Link from "next/link";
import { ClipboardList, Wallet, Package, TrendingUp, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { formatBRL } from "@/lib/format";
import { KpiCard } from "./KpiCard";
import { OrderListItem, orderDateMeta } from "@/components/orders/order-list-item";
import { EmptyBlock } from "@/components/common/page-state";

interface ClientDashboardProps {
  data: {
    myOrders: Order[];
    totalSpent: number;
    totalItems: number;
    pendingCount: number;
  };
}

export function ClientDashboard({ data }: ClientDashboardProps) {
  const { myOrders, totalSpent, totalItems, pendingCount } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard icon={<ClipboardList className="w-5 h-5" />} label="Pedidos" value={String(myOrders.length)} />
        <KpiCard icon={<Wallet className="w-5 h-5" />} label="Total gasto" value={formatBRL(totalSpent)} />
        <KpiCard icon={<Package className="w-5 h-5" />} label="Peças compradas" value={String(totalItems)} />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Em andamento"
          value={String(pendingCount)}
          hint="Pendentes ou pagos"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de pedidos</CardTitle>
          <CardDescription>Todos os pedidos feitos com sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          {myOrders.length === 0 ? (
            <EmptyBlock icon={ShoppingBag} message="Você ainda não fez nenhum pedido.">
              <Button render={<Link href="/produtos" />} className="py-4 px-6">
                Ver produtos
              </Button>
            </EmptyBlock>
          ) : (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <OrderListItem
                  key={order.id}
                  order={order}
                  title={`Pedido #${order.id}`}
                  meta={orderDateMeta(
                    order,
                    `${order.items.reduce((s, i) => s + i.quantity, 0)} item(ns)`,
                  )}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
