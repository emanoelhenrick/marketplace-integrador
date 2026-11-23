"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";

import { RoleGuard } from "@/components/auth/role-guard";
import { CartSummary } from "@/app/cart/_components/cart-summary";
import { PageMessage } from "@/components/common/page-state";
import { AddressForm } from "@/components/checkout/address-form";
import { CheckoutItemsCard } from "@/components/checkout/checkout-items-card";
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector";
import { StockAlert } from "@/components/checkout/stock-alert";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";
import { ACCESS, allowRoles } from "@/lib/permissions";

function CheckoutContent() {
  const checkout = useCheckout();
  const { user, items, totals, isSubmitting } = checkout;

  if (!user) return null;

  if (items.length === 0 && !isSubmitting) {
    return (
      <PageMessage
        icon={ShoppingBag}
        title="Seu carrinho está vazio"
        description="Adicione peças ao carrinho antes de finalizar a compra."
      >
        <Button render={<Link href="/products" />} className="py-4 px-8">
          Ver produtos
        </Button>
      </PageMessage>
    );
  }

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4">
      <div className="flex items-center gap-3 sm:gap-4 mb-6">
        <Button
          render={<Link href="/cart" aria-label="Voltar para o carrinho" />}
          variant="outline"
          size="icon"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Entrega e pagamento
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <StockAlert
            issues={checkout.issues}
            onResolve={checkout.resolveIssues}
          />
          <AddressForm
            address={checkout.address}
            errors={checkout.errors}
            disabled={isSubmitting}
            onChange={checkout.setField}
          />
          <PaymentMethodSelector
            value={checkout.paymentMethod}
            onChange={checkout.setPaymentMethod}
            disabled={isSubmitting}
          />
          <CheckoutItemsCard items={items} totalItems={totals.totalItems} />
        </div>

        <div className="lg:col-span-1 w-full">
          <CartSummary totalQuantity={totals.totalItems} total={totals.total}>
            {checkout.error && (
              <p role="alert" className="text-xs text-destructive text-center">
                {checkout.error}
              </p>
            )}
            <Button
              className="w-full cursor-pointer flex items-center justify-center gap-2"
              size="lg"
              onClick={checkout.submit}
              disabled={isSubmitting || checkout.isBlocked}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Confirmando...
                </>
              ) : checkout.isBlocked ? (
                "Ajuste o carrinho para continuar"
              ) : (
                "Confirmar pedido"
              )}
            </Button>
          </CartSummary>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <RoleGuard
      allow={allowRoles(ACCESS.client)}
      loginTitle="Entre para finalizar sua compra"
      loginDescription="Faça login para confirmar o pedido. Seu carrinho será mantido."
      forbiddenTitle="Compras são exclusivas para clientes"
      forbiddenDescription="Contas de artesão e administração não realizam pedidos."
    >
      <CheckoutContent />
    </RoleGuard>
  );
}
