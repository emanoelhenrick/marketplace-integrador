import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
  action?: ToastAction;
  duration: number;
}

interface ToastStore {
  toasts: ToastItem[];
  push: (
    toast: Omit<ToastItem, "id" | "duration"> & { duration?: number },
  ) => number;
  dismiss: (id: number) => void;
}

const MAX_VISIBLE = 5;
let nextId = 1;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = nextId++;
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id, duration: toast.duration ?? 4000 },
      ].slice(-MAX_VISIBLE),
    }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
