"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";

import { RoleGuard } from "@/components/auth/role-guard";
import { PageMessage } from "@/components/common/page-state";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatBRL } from "@/lib/format";
import { toast } from "@/lib/toast";
import { useSession } from "@/hooks/use-session";
import { useCartStore } from "@/store/cardStore";
import { orderService } from "@/services/orderService";

function CheckoutContent() {
  const router = useRouter();
  const { user } = useSession();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) => s.totalPrice());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  if (items.length === 0 && !isSubmitting) {
    return (
      <PageMessage
        icon={ShoppingBag}
        title="Seu carrinho está vazio"
        description="Adicione peças ao carrinho antes de finalizar a compra."
      >
        <Button render={<Link href="/produtos" />} className="py-4 px-8">
          Ver produtos
        </Button>
      </PageMessage>
    );
  }

  const handleConfirm = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const order = await orderService.create({
        userId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        status: "pending",
        totalAmount: total,
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          artisanId: product.artisanId,
          quantity,
          unitPrice: product.price,
        })),
      });
      clearCart();
      toast.success(`Pedido #${order.id} realizado!`, {
        description: "Acompanhe o status em Meus pedidos.",
      });
      router.replace(`/pedido/${order.id}?novo=1`);
    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
      setError("Não foi possível registrar o pedido. Tente novamente.");
      toast.error("Falha ao finalizar o pedido", {
        description: "Seu carrinho foi mantido. Tente novamente.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4">
      <div className="flex items-center gap-3 sm:gap-4 mb-6">
        <Button
          render={<Link href="/carrinho" aria-label="Voltar para o carrinho" />}
          variant="outline"
          size="icon"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Revisar e confirmar</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados do pedido</CardTitle>
              <CardDescription>Confirmaremos os detalhes por e-mail.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-semibold">{user.name}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itens ({items.reduce((s, i) => s + i.quantity, 0)})</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between gap-3 py-3 text-sm">
                  <span className="min-w-0 truncate">
                    {quantity}× {product.name}
                  </span>
                  <span className="font-semibold shrink-0">
                    {formatBRL(product.price * quantity)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 w-full">
          <CartSummary
            totalQuantity={items.reduce((s, i) => s + i.quantity, 0)}
            total={total}
          >
            {error && (
              <p role="alert" className="text-xs text-destructive text-center">
                {error}
              </p>
            )}
            <Button
              className="w-full cursor-pointer flex items-center justify-center gap-2"
              size="lg"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Confirmando...
                </>
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
      allow={["client"]}
      loginTitle="Entre para finalizar sua compra"
      loginDescription="Faça login para confirmar o pedido. Seu carrinho será mantido."
      forbiddenTitle="Compras são exclusivas para clientes"
      forbiddenDescription="Contas de artesão e administração não realizam pedidos."
    >
      <CheckoutContent />
    </RoleGuard>
  );
}
