"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cardStore";
import { toast } from "@/lib/toast";
import type { Product } from "@/types/product";

/** Adiciona ao carrinho e confirma com um toast que leva ao carrinho (sem recarregar a página). */
export function useAddToCart() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  return (product: Product, quantity = 1) => {
    addItem(product, quantity);
    toast.success(
      quantity > 1 ? `${quantity}× ${product.name} adicionados` : `${product.name} adicionado`,
      {
        description: "Peça no seu carrinho.",
        action: { label: "Ver carrinho", onClick: () => router.push("/carrinho") },
      },
    );
  };
}
