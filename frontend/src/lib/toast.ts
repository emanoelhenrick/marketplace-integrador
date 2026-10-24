import { useToastStore, type ToastAction } from "@/store/toastStore";

interface ToastOptions {
  description?: string;
  action?: ToastAction;
  duration?: number;
}

const push = (
  variant: "success" | "error" | "info",
  title: string,
  options: ToastOptions = {},
) => useToastStore.getState().push({ variant, title, ...options });

export const toast = {
  success: (title: string, options?: ToastOptions) =>
    push("success", title, options),
  error: (title: string, options?: ToastOptions) =>
    push("error", title, { duration: 6000, ...options }),
  info: (title: string, options?: ToastOptions) => push("info", title, options),
  dismiss: (id: number) => useToastStore.getState().dismiss(id),
};
