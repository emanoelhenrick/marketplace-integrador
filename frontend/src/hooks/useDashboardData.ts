"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { artesiansService } from "@/services/artisansService";
import { Order, OrderStatus } from "@/types/order";
import { Product } from "@/types/product";
import { Artisan } from "@/types/artisan";

interface SalesRow {
  name: string;
  qty: number;
  revenue: number;
}

function aggregateSales(
  items: Order["items"],
  productById: Map<string, Product>,
): SalesRow[] {
  const sales = new Map<string, SalesRow>();
  items.forEach((item) => {
    const key = String(item.productId);
    const current = sales.get(key) ?? {
      name: productById.get(key)?.name ?? `Produto #${key}`,
      qty: 0,
      revenue: 0,
    };
    current.qty += item.quantity;
    current.revenue += item.unitPrice * item.quantity;
    sales.set(key, current);
  });
  return Array.from(sales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

const byNewest = (a: Order, b: Order) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export function useDashboardData() {
  const { ready, user, role, isAuthenticated, isArtisan, isAdmin } = useSession();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  useEffect(() => {
    if (!ready || userId === undefined || !role) return;
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        if (role === "client") {
          const data = await orderService.getByUserId(userId!);
          if (isMounted) setOrders(data);
        } else if (role === "artisan") {
          const [ordersData, productsData] = await Promise.all([
            orderService.getByArtisan(userId!),
            productService.getAll(),
          ]);
          if (!isMounted) return;
          setOrders(ordersData);
          setProducts(productsData);
        } else {
          const [ordersData, productsData, artisansData] = await Promise.all([
            orderService.getAll(),
            productService.getAll(),
            artesiansService.getAll(),
          ]);
          if (!isMounted) return;
          setOrders(ordersData);
          setProducts(productsData);
          setArtisans(artisansData);
        }
      } catch (err) {
        console.error("Erro ao carregar painel:", err);
        if (isMounted) setError("Não foi possível carregar os dados do painel.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [ready, userId, role]);

  const productById = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => map.set(String(p.id), p));
    return map;
  }, [products]);

  const clientData = useMemo(() => {
    if (role !== "client") return null;

    const myOrders = [...orders].sort(byNewest);
    return {
      myOrders,
      totalSpent: myOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.totalAmount, 0),
      totalItems: myOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0),
      pendingCount: myOrders.filter((o) => o.status === "pending" || o.status === "paid").length,
    };
  }, [orders, role]);

  const artisanData = useMemo(() => {
    if (!isArtisan || userId === undefined) return null;

    const myProducts = products.filter((p) => String(p.artisanId) === String(userId));

    const entries = orders
      .filter((order) => order.status !== "cancelled")
      .map((order) => {
        const myItems = order.items.filter((item) => String(item.artisanId) === String(userId));
        const subtotal = myItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        return { order, myItems, subtotal };
      })
      .filter((entry) => entry.myItems.length > 0)
      .sort((a, b) => byNewest(a.order, b.order));

    return {
      myProducts,
      entries,
      totalRevenue: entries.reduce((sum, e) => sum + e.subtotal, 0),
      totalUnitsSold: entries.reduce(
        (sum, e) => sum + e.myItems.reduce((s, i) => s + i.quantity, 0),
        0,
      ),
      avgStars: myProducts.length
        ? myProducts.reduce((sum, p) => sum + p.stars, 0) / myProducts.length
        : 0,
      topProducts: aggregateSales(
        entries.flatMap((e) => e.myItems),
        productById,
      ),
    };
  }, [orders, products, productById, userId, isArtisan]);

  const adminData = useMemo(() => {
    if (!isAdmin) return null;

    const active = orders.filter((o) => o.status !== "cancelled");
    const statusCounts = orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<OrderStatus, number>,
    );

    return {
      recentOrders: [...orders].sort(byNewest).slice(0, 8),
      totalRevenue: active.reduce((sum, o) => sum + o.totalAmount, 0),
      statusCounts,
      uniqueCustomers: new Set(orders.map((o) => o.customerEmail)).size,
      topProducts: aggregateSales(
        active.flatMap((o) => o.items),
        productById,
      ),
    };
  }, [orders, isAdmin, productById]);

  return {
    ready,
    user,
    role,
    isAuthenticated,
    isArtisan,
    isAdmin,
    isLoading,
    error,
    products,
    artisans,
    clientData,
    artisanData,
    adminData,
  };
}
