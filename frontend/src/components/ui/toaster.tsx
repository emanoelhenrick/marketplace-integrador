"use client";

import { useEffect } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "cn";

import { useToastStore, type ToastItem } from "@/store/toastStore";

const VARIANT_STYLE = {
  success: { icon: CheckCircle2, color: "text-forest", bar: "bg-forest" },
  error: { icon: XCircle, color: "text-destructive", bar: "bg-destructive" },
  info: { icon: Info, color: "text-brand", bar: "bg-brand" },
} as const;

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((state) => state.dismiss);
  const { icon: Icon, color, bar } = VARIANT_STYLE[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [dismiss, toast.id, toast.duration]);

  return (
    <div
      role={toast.variant === "error" ? "alert" : "status"}
      className="pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border bg-popover p-4 pr-10 text-popover-foreground shadow-lg animate-[toast-in_200ms_ease-out]"
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", bar)} />
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", color)} aria-hidden />
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-semibold leading-snug">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              dismiss(toast.id);
            }}
            className="pt-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label="Fechar notificação"
        onClick={() => dismiss(toast.id)}
        className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-100 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:w-96"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
