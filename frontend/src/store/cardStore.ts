import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addToCart, cartTotals, reconcileCart, setQuantity, type AddResult } from "@/lib/cart";
import type { Id } from "@/types/common";
import type { CartItem, Product } from "@/types/product";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => AddResult;
  removeItem: (productId: Id) => void;
  updateQuantity: (productId: Id, quantity: number) => void;
  /** Atualiza snapshots (preço/estoque) e remove/apara o que ficou indisponível. */
  syncWithCatalog: (fresh: Product[]) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const result = addToCart(get().items, product, quantity);
        if (result.items !== get().items) set({ items: result.items });
        return result;
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => String(i.product.id) !== String(productId)) })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({ items: setQuantity(state.items, productId, quantity) })),

      syncWithCatalog: (fresh) => set((state) => ({ items: reconcileCart(state.items, fresh) })),

      clearCart: () => set({ items: [] }),

      totalItems: () => cartTotals(get().items).totalItems,
      totalPrice: () => cartTotals(get().items).total,
    }),
    {
      name: "manoa-cart",
      version: 2, // v2: produtos passam a carregar `stock`/`active`; carrinhos antigos são descartados
      migrate: () => ({ items: [] }),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);
