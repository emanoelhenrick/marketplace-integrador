/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  CircleUserRound,
  ClipboardList,
  Hammer,
  Loader2,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { artesiansService } from "@/services/artisansService";
import { Order, OrderStatus } from "@/types/order";
import { Product } from "@/types/product";
import { Artisan } from "@/types/artisan";
import { formatBRL, formatDate } from "@/lib/format";
import {
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABEL,
} from "@/lib/order-status";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isArtisan = user?.role === "artisan";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        const [ordersData, productsData] = await Promise.all([
          orderService.getAll(),
          productService.getAll(),
        ]);

        if (!isMounted) return;
        setOrders(ordersData);
        setProducts(productsData);

        if (isAdmin) {
          const artisansData = await artesiansService.getAll();
          if (isMounted) setArtisans(artisansData);
        }
      } catch (err) {
        console.error("Erro ao carregar painel:", err);
        if (isMounted) {
          setError("Não foi possível carregar os dados do painel.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [user, isAdmin]);

  const productById = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => map.set(String(p.id), p));
    return map;
  }, [products]);

  // ---------- Cliente ----------
  const clientData = useMemo(() => {
    if (!user || isArtisan || isAdmin) return null;

    const myOrders = orders
      .filter((o) => String(o.userId) === String(user.id))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    const totalSpent = myOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalItems = myOrders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0,
    );
    const pendingCount = myOrders.filter(
      (o) => o.status === "pending" || o.status === "paid",
    ).length;

    return { myOrders, totalSpent, totalItems, pendingCount };
  }, [orders, user, isArtisan, isAdmin]);

  // ---------- Artesão ----------
  const artisanData = useMemo(() => {
    if (!user || !isArtisan) return null;

    const myProducts = products.filter(
      (p) => String(p.artisanId) === String(user.id),
    );

    const entries = orders
      .map((order) => {
        const myItems = order.items.filter(
          (item) => String(item.artisanId) === String(user.id),
        );
        const subtotal = myItems.reduce(
          (sum, i) => sum + i.unitPrice * i.quantity,
          0,
        );
        return { order, myItems, subtotal };
      })
      .filter((entry) => entry.myItems.length > 0)
      .sort(
        (a, b) =>
          new Date(b.order.createdAt).getTime() -
          new Date(a.order.createdAt).getTime(),
      );

    const totalRevenue = entries.reduce((sum, e) => sum + e.subtotal, 0);
    const totalUnitsSold = entries.reduce(
      (sum, e) => sum + e.myItems.reduce((s, i) => s + i.quantity, 0),
      0,
    );
    const avgStars = myProducts.length
      ? myProducts.reduce((sum, p) => sum + p.stars, 0) / myProducts.length
      : 0;

    const salesByProduct = new Map<string, { name: string; qty: number; revenue: number }>();
    entries.forEach((entry) => {
      entry.myItems.forEach((item) => {
        const key = String(item.productId);
        const product = productById.get(key);
        const current = salesByProduct.get(key) ?? {
          name: product?.name ?? `Produto #${key}`,
          qty: 0,
          revenue: 0,
        };
        current.qty += item.quantity;
        current.revenue += item.unitPrice * item.quantity;
        salesByProduct.set(key, current);
      });
    });

    const topProducts = Array.from(salesByProduct.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      myProducts,
      entries,
      totalRevenue,
      totalUnitsSold,
      avgStars,
      topProducts,
    };
  }, [orders, products, productById, user, isArtisan]);

  // ---------- Admin ----------
  const adminData = useMemo(() => {
    if (!isAdmin) return null;

    const sorted = [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const statusCounts = orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<OrderStatus, number>,
    );

    const uniqueCustomers = new Set(orders.map((o) => o.customerEmail)).size;

    const salesByProduct = new Map<string, { name: string; qty: number; revenue: number }>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = String(item.productId);
        const product = productById.get(key);
        const current = salesByProduct.get(key) ?? {
          name: product?.name ?? `Produto #${key}`,
          qty: 0,
          revenue: 0,
        };
        current.qty += item.quantity;
        current.revenue += item.unitPrice * item.quantity;
        salesByProduct.set(key, current);
      });
    });

    const topProducts = Array.from(salesByProduct.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      recentOrders: sorted.slice(0, 8),
      totalRevenue,
      statusCounts,
      uniqueCustomers,
      topProducts,
    };
  }, [orders, isAdmin, productById]);

  if (!isAuthenticated || !user) {
    return (
      <main className="px-4 sm:px-8 lg:px-20 py-16 sm:py-24 text-center space-y-4">
        <CircleUserRound className="w-12 h-12 text-(--urucum) mx-auto" />
        <h1 className="text-xl sm:text-2xl font-bold text-carvao">
          Você precisa entrar para ver seu painel
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Entre com sua conta para acompanhar pedidos, vendas e o
          desempenho do seu acervo na Manoa.
        </p>
        <Button
          render={<Link href="/login" />}
          className="mt-2 py-4 px-8 cursor-pointer"
        >
          Ir para o login
        </Button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 text-(--barro) animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <main className="px-4 sm:px-8 lg:px-20 py-16 text-center space-y-3">
        <p className="text-sm text-(--urucum) font-semibold">{error}</p>
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-6 sm:py-8 space-y-8">
      <div>
        <p className="text-xs font-bold text-(--barro) uppercase tracking-wider mb-1">
          Painel
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-carvao">
          {isAdmin
            ? "Visão geral da plataforma"
            : isArtisan
              ? `Vendas de ${user.name}`
              : "Seus pedidos"}
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          {isAdmin
            ? "Acompanhe pedidos, produtos e artesãos cadastrados na Manoa."
            : isArtisan
              ? "Acompanhe o desempenho das suas peças e os pedidos recebidos."
              : "Acompanhe o status e o histórico das suas compras."}
        </p>
      </div>

      {isAdmin && adminData && (
        <AdminDashboard data={adminData} totalProducts={products.length} totalArtisans={artisans.length} />
      )}

      {isArtisan && artisanData && <ArtisanDashboard data={artisanData} />}

      {!isAdmin && !isArtisan && clientData && (
        <ClientDashboard data={clientData} />
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------
// Componentes de apoio
// ---------------------------------------------------------------------------

function KpiCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-(--barro-claro) flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-stone-500 font-medium">{label}</p>
          <p className="text-lg sm:text-2xl font-bold text-carvao truncate">
            {value}
          </p>
          {hint && <p className="text-[11px] text-stone-500">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function BarList({
  data,
  emptyLabel = "Sem dados suficientes ainda.",
}: {
  data: { label: string; value: number; displayValue: string }[];
  emptyLabel?: string;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-stone-500">{emptyLabel}</p>;
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3.5">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between gap-3 text-xs sm:text-sm mb-1">
            <span className="font-medium text-carvao truncate">
              {d.label}
            </span>
            <span className="text-stone-500 shrink-0">{d.displayValue}</span>
          </div>
          <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-(--barro)"
              style={{ width: `${Math.max((d.value / max) * 100, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={ORDER_STATUS_BADGE[status]}>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Painel do Cliente
// ---------------------------------------------------------------------------

function ClientDashboard({
  data,
}: {
  data: {
    myOrders: Order[];
    totalSpent: number;
    totalItems: number;
    pendingCount: number;
  };
}) {
  const { myOrders, totalSpent, totalItems, pendingCount } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          icon={<ClipboardList className="w-5 h-5 text-(--barro)" />}
          label="Pedidos"
          value={String(myOrders.length)}
        />
        <KpiCard
          icon={<Wallet className="w-5 h-5 text-(--barro)" />}
          label="Total gasto"
          value={formatBRL(totalSpent)}
        />
        <KpiCard
          icon={<Package className="w-5 h-5 text-(--barro)" />}
          label="Peças compradas"
          value={String(totalItems)}
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5 text-(--barro)" />}
          label="Em andamento"
          value={String(pendingCount)}
          hint="Pendentes ou pagos"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de pedidos</CardTitle>
          <CardDescription>
            Todos os pedidos feitos com sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myOrders.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <ShoppingBag className="w-9 h-9 text-stone-300 mx-auto" />
              <p className="text-sm text-stone-600">
                Você ainda não fez nenhum pedido.
              </p>
              <Button render={<Link href="/produtos" />} className="py-4 px-6">
                Ver produtos
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/pedido/${order.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-between rounded-lg border border-stone-200 p-3.5 hover:bg-stone-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-carvao">
                      Pedido #{order.id}
                    </p>
                    <p className="text-xs text-stone-500">
                      {formatDate(order.createdAt)} ·{" "}
                      {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                      item(ns)
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-carvao">
                      {formatBRL(order.totalAmount)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Painel do Artesão
// ---------------------------------------------------------------------------

function ArtisanDashboard({
  data,
}: {
  data: {
    myProducts: Product[];
    entries: { order: Order; myItems: Order["items"]; subtotal: number }[];
    totalRevenue: number;
    totalUnitsSold: number;
    avgStars: number;
    topProducts: { name: string; qty: number; revenue: number }[];
  };
}) {
  const { myProducts, entries, totalRevenue, totalUnitsSold, avgStars, topProducts } =
    data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          icon={<Wallet className="w-5 h-5 text-(--barro)" />}
          label="Receita total"
          value={formatBRL(totalRevenue)}
        />
        <KpiCard
          icon={<ClipboardList className="w-5 h-5 text-(--barro)" />}
          label="Pedidos recebidos"
          value={String(entries.length)}
        />
        <KpiCard
          icon={<Package className="w-5 h-5 text-(--barro)" />}
          label="Peças vendidas"
          value={String(totalUnitsSold)}
        />
        <KpiCard
          icon={<Star className="w-5 h-5 text-(--barro)" />}
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
            <CardDescription>
              Pedidos de clientes que incluem suas peças
            </CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <Hammer className="w-9 h-9 text-stone-300 mx-auto" />
                <p className="text-sm text-stone-600">
                  Você ainda não recebeu pedidos.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.slice(0, 6).map(({ order, myItems, subtotal }) => (
                  <Link
                    key={order.id}
                    href={`/pedido/${order.id}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-between rounded-lg border border-stone-200 p-3.5 hover:bg-stone-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-carvao">
                        {order.customerName} · Pedido #{order.id}
                      </p>
                      <p className="text-xs text-stone-500">
                        {formatDate(order.createdAt)} ·{" "}
                        {myItems.reduce((s, i) => s + i.quantity, 0)} peça(s)
                        sua(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-carvao">
                        {formatBRL(subtotal)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Seu acervo</CardTitle>
            <CardDescription>{myProducts.length} peça(s) cadastrada(s)</CardDescription>
          </div>
          <Button
            render={<Link href="/produtos/novo" />}
            variant="outline"
            size="sm"
          >
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
                  className="group rounded-lg border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-carvao line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs font-bold text-(--barro)">
                      {formatBRL(product.price)}
                    </p>
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

// ---------------------------------------------------------------------------
// Painel Administrativo
// ---------------------------------------------------------------------------

function AdminDashboard({
  data,
  totalProducts,
  totalArtisans,
}: {
  data: {
    recentOrders: Order[];
    totalRevenue: number;
    statusCounts: Record<OrderStatus, number>;
    uniqueCustomers: number;
    topProducts: { name: string; qty: number; revenue: number }[];
  };
  totalProducts: number;
  totalArtisans: number;
}) {
  const { recentOrders, totalRevenue, statusCounts, uniqueCustomers, topProducts } =
    data;

  const statusData = (Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map(
    (status) => ({
      label: ORDER_STATUS_LABEL[status],
      value: statusCounts[status] ?? 0,
      displayValue: String(statusCounts[status] ?? 0),
    }),
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          icon={<Wallet className="w-5 h-5 text-(--barro)" />}
          label="Receita total"
          value={formatBRL(totalRevenue)}
          hint="Excluindo pedidos cancelados"
        />
        <KpiCard
          icon={<Package className="w-5 h-5 text-(--barro)" />}
          label="Produtos no acervo"
          value={String(totalProducts)}
        />
        <KpiCard
          icon={<Hammer className="w-5 h-5 text-(--barro)" />}
          label="Artesãos ativos"
          value={String(totalArtisans)}
        />
        <KpiCard
          icon={<Users className="w-5 h-5 text-(--barro)" />}
          label="Clientes únicos"
          value={String(uniqueCustomers)}
        />
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
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/pedido/${order.id}`}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-between rounded-lg border border-stone-200 p-3.5 hover:bg-stone-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-carvao">
                    {order.customerName} · Pedido #{order.id}
                  </p>
                  <p className="text-xs text-stone-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-carvao">
                    {formatBRL(order.totalAmount)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
