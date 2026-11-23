import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { User, UserRole } from "@/types/user";

export const ROLE_LABEL: Record<UserRole, string> = {
  client: "Cliente",
  artisan: "Artesão(ã)",
  admin: "Administração",
};

export type Role = UserRole | null; // null = visitante

const same = (a: unknown, b: unknown) => String(a) === String(b);

/** Perfis permitidos por área. Usado pelos RoleGuard e pelo menu. */
export const ACCESS = {
  anyUser: ["client", "artisan", "admin"],
  client: ["client"],
  artisan: ["artisan"],
  admin: ["admin"],
} as const satisfies Record<string, readonly UserRole[]>;

export const allowRoles = (list: readonly UserRole[]): UserRole[] => [...list];

/** Visitantes e clientes compram; artesãos e administradores não. */
export const canPurchase = (role: Role) => role === null || role === "client";

export const canManageProducts = (role: Role) => role === "artisan";

/** Só o dono edita/desativa a peça (o admin modera em outra tela). */
export const canEditProduct = (user: User | null, product: Pick<Product, "artisanId">) =>
  !!user && user.role === "artisan" && same(user.id, product.artisanId);

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
  role === "client" || role === null ? "/products" : "/dashboard";

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
    { href: "/products", label: "Produtos" },
    { href: "/artisans", label: "Mestres e Histórias" },
    { href: "/poles", label: "Polos Criativos" },
  ];

  if (role === "client") return [...common, { href: "/dashboard", label: "Meus pedidos" }];
  if (role === "artisan")
    return [
      ...common,
      { href: "/dashboard", label: "Minhas vendas" },
      { href: "/products/new", label: "Adicionar produto" },
    ];
  if (role === "admin")
    return [
      ...common,
      { href: "/dashboard", label: "Painel" },
      { href: "/admin/users", label: "Usuários" },
    ];
  return common;
}

export function safeRedirect(path: string | null | undefined, fallback = "/") {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
