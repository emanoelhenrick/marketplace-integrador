/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Wallet, ClipboardList, Package, Star, Hammer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { formatBRL } from "@/lib/format";
import { KpiCard } from "./KpiCard";
import { BarList } from "./BarList";
import { OrderListItem, orderDateMeta } from "@/components/orders/order-list-item";
import { EmptyBlock } from "@/components/common/page-state";

interface ArtisanDashboardProps {
  data: {
    myProducts: Product[];
    entries: { order: Order; myItems: Order["items"]; subtotal: number }[];
    totalRevenue: number;
    totalUnitsSold: number;
    avgStars: number;
    topProducts: { name: string; qty: number; revenue: number }[];
  };
}

export function ArtisanDashboard({ data }: ArtisanDashboardProps) {
  const { myProducts, entries, totalRevenue, totalUnitsSold, avgStars, topProducts } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard icon={<Wallet className="w-5 h-5" />} label="Receita total" value={formatBRL(totalRevenue)} />
        <KpiCard icon={<ClipboardList className="w-5 h-5" />} label="Pedidos recebidos" value={String(entries.length)} />
        <KpiCard icon={<Package className="w-5 h-5" />} label="Peças vendidas" value={String(totalUnitsSold)} />
        <KpiCard
          icon={<Star className="w-5 h-5" />}
          label="Avaliação média"
          value={myProducts.length ? avgStars.toFixed(1) : "—"}
          hint={`${myProducts.length} produto(s) no acervo`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-start">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Peças mais vendidas</CardTitle>
            <CardDescription>Por receita gerada</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList
              data={topProducts.map((p) => ({
                label: p.name,
                value: p.revenue,
                displayValue: formatBRL(p.revenue),
              }))}
              emptyLabel="Nenhuma venda registrada ainda."
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pedidos recentes</CardTitle>
            <CardDescription>Pedidos de clientes que incluem suas peças</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <EmptyBlock icon={Hammer} message="Você ainda não recebeu pedidos." />
            ) : (
              <div className="space-y-3">
                {entries.slice(0, 6).map(({ order, myItems, subtotal }) => (
                  <OrderListItem
                    key={order.id}
                    order={order}
                    title={`${order.customerName} · Pedido #${order.id}`}
                    meta={orderDateMeta(
                      order,
                      `${myItems.reduce((s, i) => s + i.quantity, 0)} peça(s) sua(s)`,
                    )}
                    amount={subtotal}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Seu acervo</CardTitle>
            <CardDescription>{myProducts.length} peça(s) cadastrada(s)</CardDescription>
          </div>
          <Button render={<Link href="/produtos/novo" />} variant="outline" size="sm">
            Novo produto
          </Button>
        </CardHeader>
        {myProducts.length > 0 && (
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {myProducts.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/produtos/${product.id}`}
                  className="group rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold line-clamp-1">{product.name}</p>
                    <p className="text-xs font-bold text-brand">{formatBRL(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
