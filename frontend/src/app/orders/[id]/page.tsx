"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldAlert, ShoppingBag, XCircle } from "lucide-react";

import { RoleGuard } from "@/components/auth/role-guard";
import { PageLoading, PageMessage } from "@/components/common/page-state";
import {
  AdminOrderActions,
  ArtisanOrderActions,
  ClientOrderActions,
} from "@/components/orders/order-actions";
import { OrderItemsCard } from "@/components/orders/order-items-card";
import { StatusTracker } from "@/components/orders/status-tracker";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/hooks/use-session";
import { formatDateTime } from "@/lib/format";
import { ACCESS, allowRoles, visibleOrderItems } from "@/lib/permissions";
import { subtotalOf } from "@/lib/metrics";
import { PAID_STATUSES } from "@/lib/order-status";
import { useOrderDetail } from "@/hooks/use-orders";
import { ShippingAddressCard } from "@/components/orders/shipping-address-card";

function OrderDetail({ id }: { id: string }) {
  const { user, role } = useSession();
  const justCreated = useSearchParams().get("novo") === "1";
  const { access, order, setOrder, productById } = useOrderDetail(id);

  if (access === "loading") return <PageLoading />;

  const backButton = (
    <Button render={<Link href="/dashboard" />} variant="outline" className="py-4 px-8">
      Voltar para o painel
    </Button>
  );

  if (access === "not_found" || !order || !user) {
    if (access === "forbidden") {
      return (
        <PageMessage
          icon={ShieldAlert}
          title="Você não tem acesso a este pedido"
          description="Só o cliente que fez o pedido, os artesãos com peças nele e a administração podem vê-lo."
        >
          {backButton}
        </PageMessage>
      );
    }
    return (
      <PageMessage title="Pedido não encontrado." description="Confira o número do pedido e tente novamente.">
        {backButton}
      </PageMessage>
    );
  }

  const isCancelled = order.status === "cancelled";
  const items = visibleOrderItems(user, order);
  const isArtisan = role === "artisan";
  const total = isArtisan ? subtotalOf(items) : order.totalAmount;
  const celebrate = role === "client" && justCreated && !isCancelled;

  const title = isCancelled
    ? "Pedido cancelado"
    : celebrate
      ? "Pedido confirmado!"
      : `Pedido #${order.id}`;

  const subtitle = isCancelled
    ? `O pedido #${order.id} foi cancelado.`
    : celebrate
      ? `Obrigado, ${order.customerName}! Seu pedido #${order.id} foi registrado.`
      : role === "client"
        ? "Acompanhe o andamento do seu pedido."
        : `Cliente: ${order.customerName}`;

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4 max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm w-fit transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para o painel
      </Link>

      <Card>
        <CardContent className="p-6 sm:p-8 text-center space-y-3">
          {isCancelled ? (
            <XCircle className="w-14 h-14 text-destructive mx-auto" />
          ) : (
            <CheckCircle2 className="w-14 h-14 text-forest mx-auto" />
          )}
          <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <StatusBadge status={order.status} />
            <span>{formatDateTime(order.createdAt)}</span>
          </div>
        </CardContent>
      </Card>

      {!isCancelled && (
        <Card>
          <CardContent className="p-5 sm:p-6">
            <StatusTracker current={order.status} />
          </CardContent>
        </Card>
      )}

      <OrderItemsCard
        items={items}
        productById={productById}
        totalLabel={isArtisan ? "Subtotal das suas peças" : "Total"}
        total={total}
        description={role === "artisan" ? undefined : `Comprovante enviado para ${order.customerEmail}`}
        canReview={role === "client" && PAID_STATUSES.includes(order.status)}
      />

      <ShippingAddressCard address={order.shippingAddress} />

      {role === "client" && <ClientOrderActions order={order} onUpdated={setOrder} />}
      {role === "admin" && <AdminOrderActions order={order} onUpdated={setOrder} />}
      {role === "artisan" && (
        <ArtisanOrderActions order={order} artisanId={user.id} onUpdated={setOrder} />
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button render={<Link href="/dashboard" />} variant="outline" className="flex-1 py-4 cursor-pointer">
          {role === "client" ? "Ver meus pedidos" : "Voltar ao painel"}
        </Button>
        {role === "client" && (
          <Button
            render={<Link href="/products" />}
            className="flex-1 py-4 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Continuar comprando
          </Button>
        )}
      </div>
    </main>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <RoleGuard
      allow={allowRoles(ACCESS.anyUser)}
      loginTitle="Entre para ver este pedido"
      loginDescription="Faça login com a conta que fez (ou recebeu) o pedido."
    >
      <Suspense fallback={<PageLoading />}>
        <OrderDetail id={id} />
      </Suspense>
    </RoleGuard>
  );
}
