import type { Order } from "@/types/order";
import type { User, UserRole } from "@/types/user";


export const ROLE_LABEL: Record<UserRole, string> = {
  client: "Cliente",
  artisan: "Artesão(ã)",
  admin: "Administração",
};

export type Role = UserRole | null; // null = visitante

const same = (a: unknown, b: unknown) => String(a) === String(b);

/** Visitantes e clientes compram; artesãos e administradores não. */
export const canPurchase = (role: Role) => role === null || role === "client";

export const canManageProducts = (role: Role) => role === "artisan";

export const canUpdateOrderStatus = (role: Role) => role === "admin";

/** Dono do ateliê ou administrador enxerga a gestão (vendas, repasse, pedidos). */
export function canManageArtisan(user: User | null, artisanId: number | string) {
  if (!user) return false;
  return user.role === "admin" || (user.role === "artisan" && same(user.id, artisanId));
}

export function canViewOrder(user: User | null, order: Order) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role === "client") return same(order.userId, user.id);
  return order.items.some((item) => same(item.artisanId, user.id));
}

/** Para artesãos, o pedido é filtrado para mostrar só as peças deles. */
export function visibleOrderItems(user: User | null, order: Order) {
  if (user?.role === "artisan") {
    return order.items.filter((item) => same(item.artisanId, user.id));
  }
  return order.items;
}

export const getHomeRoute = (role: Role) =>
  role === "client" || role === null ? "/produtos" : "/dashboard";

export const getDashboardLabel = (role: Role) =>
  role === "admin"
    ? "Painel administrativo"
    : role === "artisan"
      ? "Minhas vendas"
      : "Meus pedidos";

export interface NavItem {
  href: string;
  label: string;
}

export function getNavLinks(role: Role): NavItem[] {
  const common: NavItem[] = [
    { href: "/produtos", label: "Produtos" },
    { href: "/artesaos", label: "Mestres e Histórias" },
    { href: "/polos", label: "Polos Criativos" },
  ];

  if (role === "client") return [...common, { href: "/dashboard", label: "Meus pedidos" }];
  if (role === "artisan")
    return [
      ...common,
      { href: "/dashboard", label: "Minhas vendas" },
      { href: "/produtos/novo", label: "Adicionar produto" },
    ];
  if (role === "admin") return [...common, { href: "/dashboard", label: "Painel" }];
  return common;
}

export function safeRedirect(path: string | null | undefined, fallback = "/") {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
