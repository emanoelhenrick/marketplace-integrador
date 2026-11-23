"use client";

import { useRouter } from "next/navigation";
import { maxQuantityFor } from "@/lib/cart";
import { toast } from "@/lib/toast";
import { useCartStore } from "@/store/cardStore";
import type { Product } from "@/types/product";

/** Adiciona ao carrinho respeitando estoque e explica ao usuário quando algo é recusado. */
export function useAddToCart() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  return (product: Product, quantity = 1): boolean => {
    const result = addItem(product, quantity);

    if (result.reason === "invalid_quantity") {
      toast.error("Quantidade inválida", { description: "Escolha um número inteiro maior que zero." });
      return false;
    }
    if (result.reason === "out_of_stock") {
      toast.error(`${product.name} está esgotada`);
      return false;
    }
    if (result.reason === "unavailable") {
      toast.error(`${product.name} não está disponível`);
      return false;
    }
    if (result.reason === "limit_reached" && result.added === 0) {
      toast.error("Limite de estoque atingido", {
        description: `Você já tem o máximo disponível (${maxQuantityFor(product)}) no carrinho.`,
      });
      return false;
    }

    const goToCart = { label: "Ver carrinho", onClick: () => router.push("/cart") };
    if (result.reason === "limit_reached") {
      toast.info(`${result.added}× ${product.name} adicionado(s)`, {
        description: `Só há ${maxQuantityFor(product)} em estoque, ajustamos a quantidade.`,
        action: goToCart,
      });
    } else {
      toast.success(result.added > 1 ? `${result.added}× ${product.name} adicionados` : `${product.name} adicionado`, {
        description: "Peça no seu carrinho.",
        action: goToCart,
      });
    }
    return true;
  };
}
