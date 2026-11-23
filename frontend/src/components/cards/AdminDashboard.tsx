import { Wallet, Package, Hammer, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Order, OrderStatus } from "@/types/order";
import type { AdminMetrics } from "@/types/admin";
import { formatBRL } from "@/lib/format";
import { ORDER_STATUS_LABEL } from "@/lib/order-status";
import { KpiCard } from "./KpiCard";
import { BarList } from "./BarList";
import { OrderListItem, orderDateMeta } from "@/components/orders/order-list-item";
import { EmptyBlock } from "@/components/common/page-state";

interface AdminDashboardProps {
  data: { metrics: AdminMetrics; recentOrders: Order[] };
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const { metrics, recentOrders } = data;
  const statusCounts = metrics.ordersByStatus;
  const topProducts = metrics.topProducts;

  const statusData = (Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((status) => ({
    label: ORDER_STATUS_LABEL[status],
    value: statusCounts[status] ?? 0,
    displayValue: String(statusCounts[status] ?? 0),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          icon={<Wallet className="w-5 h-5" />}
          label="Receita total"
          value={formatBRL(metrics.revenue)}
          hint="Excluindo pedidos cancelados"
        />
        <KpiCard icon={<Package className="w-5 h-5" />} label="Pedidos" value={String(metrics.ordersTotal)} hint={`${metrics.activeProducts} produtos ativos`} />
        <KpiCard icon={<Hammer className="w-5 h-5" />} label="Artesãos ativos" value={String(metrics.activeArtisans)} />
        <KpiCard icon={<Users className="w-5 h-5" />} label="Usuários ativos" value={String(metrics.activeUsers)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por status</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList data={statusData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos mais vendidos</CardTitle>
            <CardDescription>Por receita gerada</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList
              data={topProducts.map((p) => ({
                label: p.name,
                value: p.revenue,
                displayValue: formatBRL(p.revenue),
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos recentes</CardTitle>
          <CardDescription>Abra um pedido para atualizar o status.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <EmptyBlock message="Nenhum pedido registrado ainda." />
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <OrderListItem
                  key={order.id}
                  order={order}
                  title={`${order.customerName} · Pedido #${order.id}`}
                  meta={orderDateMeta(order)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
