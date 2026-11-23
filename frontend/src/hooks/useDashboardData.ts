"use client";

import { useMemo } from "react";
import { useAsync } from "@/hooks/use-async";
import { useSession } from "@/hooks/use-session";
import { buildArtisanData, buildClientData, byNewest } from "@/lib/metrics";
import { adminService } from "@/services/adminService";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import type { Product } from "@/types/product";

/**
 * Painéis por perfil. Cada perfil só pede os próprios dados (o servidor também
 * filtra pelo token); o administrador usa as métricas agregadas do servidor.
 */
export function useDashboardData() {
  const { ready, user, role, isAuthenticated, isArtisan, isAdmin } = useSession();
  const userId = user?.id;

  const client = useAsync(() => orderService.listMine(), [userId], ready && role === "client");

  const artisan = useAsync(
    async () => {
      const [orders, products] = await Promise.all([orderService.listForArtisan(), productService.listMine()]);
      return { orders, products };
    },
    [userId],
    ready && role === "artisan",
  );

  const admin = useAsync(
    async () => {
      const [metrics, orders] = await Promise.all([adminService.getMetrics(), orderService.listAll()]);
      return { metrics, recentOrders: [...orders].sort(byNewest).slice(0, 8) };
    },
    [userId],
    ready && role === "admin",
  );

  const clientData = useMemo(() => (client.data ? buildClientData(client.data) : null), [client.data]);

  const artisanData = useMemo(() => {
    if (!artisan.data || userId === undefined) return null;
    const productById = new Map<string, Product>(artisan.data.products.map((p) => [String(p.id), p]));
    return buildArtisanData(artisan.data.orders, artisan.data.products, userId, productById);
  }, [artisan.data, userId]);

  const active = role === "client" ? client : role === "artisan" ? artisan : admin;

  return {
    ready,
    user,
    role,
    isAuthenticated,
    isArtisan,
    isAdmin,
    isLoading: active.loading,
    error: active.error ? "Não foi possível carregar os dados do painel." : null,
    clientData,
    artisanData,
    adminData: admin.data,
  };
}
