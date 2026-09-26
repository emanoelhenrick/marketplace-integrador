import { create } from "zustand";
import { Product, CartItem } from "@/types/product";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product: Product) => {
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { product, quantity: 1 }],
      };
    });
  },

  removeItem: (productId: number) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  totalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  totalPrice: () => {
    return get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },
}));
