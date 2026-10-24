"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { CartSummary } from "@/components/cart/cart-summary";
import { PageLoading, PageMessage } from "@/components/common/page-state";
import { useCartStore } from "@/store/cardStore";
import { useSession } from "@/hooks/use-session";
import { getHomeRoute } from "@/lib/permissions";
import { toast } from "@/lib/toast";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const addItem = useCartStore((s) => s.addItem);
  const total = useCartStore((s) => s.totalPrice());
  const { ready, role, canPurchase, isAuthenticated } = useSession();

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  if (!ready) return <PageLoading />;

  if (!canPurchase) {
    return (
      <PageMessage
        icon={ShieldAlert}
        title="Carrinho disponível apenas para clientes"
        description="Contas de artesão e administração não realizam compras. Entre com uma conta de cliente para comprar peças."
      >
        <Button render={<Link href={getHomeRoute(role)} />} variant="outline" className="py-4 px-8">
          Voltar
        </Button>
      </PageMessage>
    );
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Entre na sua conta para finalizar a compra", {
        description: "Seu carrinho será mantido.",
      });
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  const handleClear = () => {
    const snapshot = items;
    clearCart();
    toast.info("Carrinho esvaziado", {
      action: {
        label: "Desfazer",
        onClick: () => snapshot.forEach((i) => addItem(i.product, i.quantity)),
      },
    });
  };

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4">
      <div className="flex items-center gap-3 sm:gap-4 mb-6">
        <Button
          render={<Link href="/produtos" aria-label="Voltar para produtos" />}
          variant="outline"
          size="icon"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Seu Carrinho</h1>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-10 sm:py-12">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-4">
            <ShoppingBag className="text-muted-foreground/40 w-10 h-10 sm:w-12 sm:h-12" />
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold">Seu carrinho está vazio</h2>
              <p className="text-sm text-muted-foreground">
                Adicione alguns produtos para começar suas compras.
              </p>
            </div>
            <Button render={<Link href="/produtos" />} className="py-5 px-8 sm:px-15 w-full sm:w-auto">
              Ver Produtos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1 w-full">
            <CartSummary totalQuantity={totalQuantity} total={total}>
              <Button className="w-full cursor-pointer" size="lg" onClick={handleCheckout}>
                {isAuthenticated ? "Finalizar Compra" : "Entrar para finalizar"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                onClick={handleClear}
              >
                Limpar Carrinho
              </Button>
            </CartSummary>
          </div>
        </div>
      )}
    </main>
  );
}
