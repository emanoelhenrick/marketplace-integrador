"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, PackageX, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/products/quantity-selector";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useSession } from "@/hooks/use-session";
import { maxQuantityFor } from "@/lib/cart";
import { isPurchasable } from "@/lib/catalog";
import type { Product } from "@/types/product";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { user, role, canPurchase } = useSession();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  if (!canPurchase) {
    const isOwner = role === "artisan" && String(user?.id) === String(product.artisanId);
    
    let noticeMessage = "Contas de artesão não realizam compras. Acesse com uma conta de cliente para prosseguir.";
    let actionRoute = "/login";
    let actionText = "Trocar de conta";

    if (isOwner) {
      noticeMessage = "Esta peça pertence ao seu ateliê. Você pode gerenciar o estoque e a disponibilidade no seu painel.";
      actionRoute = `/products/${product.id}/edit`;
      actionText = "Editar peça";
    } else if (role === "admin") {
      noticeMessage = "Visualização de administrador. As funções de compra são exclusivas para contas de clientes.";
      actionText = "Ir para curadoria";
    }

    return (
      <div className="flex flex-col gap-3 rounded-md border bg-muted/50 p-4 sm:flex-row sm:items-center text-sm">
        <Info className="h-5 w-5 shrink-0 text-brand" aria-hidden />
        <p className="flex-1 text-muted-foreground">
          {noticeMessage}
        </p>
        <Button
          render={<Link href={actionRoute} />}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          {actionText}
        </Button>
      </div>
    );
  }

  if (!isPurchasable(product)) {
    return (
      <div 
        role="status" 
        className="flex items-center gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
      >
        <PackageX className="h-5 w-5 shrink-0" aria-hidden />
        <p>Esta peça está temporariamente esgotada.</p>
      </div>
    );
  }

  // 3. Fluxo normal de compra
  const max = maxQuantityFor(product);
  const currentQuantity = Math.min(quantity, max);

  const handleAddToCart = () => {
    if (currentQuantity > 0) {
      const success = addToCart(product, currentQuantity);
      if (success) setQuantity(1);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <QuantitySelector 
        value={currentQuantity} 
        onChange={setQuantity} 
        max={max} 
      />
      
      <Button
        onClick={handleAddToCart}
        disabled={max < 1}
        className="flex flex-1 items-center justify-center gap-2 py-6 font-semibold transition-transform duration-100 hover:scale-[1.02] sm:py-3 cursor-pointer"
      >
        <ShoppingBag className="h-4 w-4" />
        Adicionar ao Carrinho
      </Button>
    </div>
  );
}