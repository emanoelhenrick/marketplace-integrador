"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/products/quantity-selector";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import type { Product } from "@/types/product";

/**
 * Área de compra do produto, conforme o perfil:
 * - visitante/cliente: quantidade + adicionar ao carrinho
 * - artesão dono da peça: atalhos de gestão
 * - outros artesãos e administrador: aviso (não compram)
 */
export function ProductPurchasePanel({ product }: { product: Product }) {
  const { user, role, canPurchase } = useSession();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  if (!canPurchase) {
    const isOwner = role === "artisan" && String(user?.id) === String(product.artisanId);
    return (
      <div className="rounded-md border bg-muted/50 p-4 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
        <Info className="w-5 h-5 text-brand shrink-0" aria-hidden />
        <p className="flex-1 text-muted-foreground">
          {isOwner
            ? "Esta peça é do seu ateliê. Acompanhe as vendas no seu painel."
            : role === "admin"
              ? "Você está visualizando como administrador. Compras são exclusivas para clientes."
              : "Contas de artesão não realizam compras. Entre com uma conta de cliente para comprar."}
        </p>
        <Button
          render={<Link href={isOwner || role === "admin" ? "/dashboard" : "/login"} />}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          {isOwner || role === "admin" ? "Ir para o painel" : "Trocar de conta"}
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <QuantitySelector value={quantity} onChange={setQuantity} />
      <Button
        onClick={handleAddToCart}
        className="flex-1 py-6 sm:py-3 font-semibold cursor-pointer hover:scale-[1.02] transition-transform duration-100 flex items-center justify-center gap-2"
      >
        <ShoppingBag className="w-4 h-4" />
        Adicionar ao Carrinho
      </Button>
    </div>
  );
}
