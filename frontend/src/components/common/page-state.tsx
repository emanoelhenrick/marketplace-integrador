import type { ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "cn";

export function PageLoading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-24 text-sm text-muted-foreground"
    >
      <Loader2 className="w-8 h-8 text-brand animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

interface PageMessageProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/** Estado de página inteira: não logado, sem permissão, não encontrado, erro. */
export function PageMessage({
  icon: Icon,
  title,
  description,
  children,
  className,
}: PageMessageProps) {
  return (
    <main
      className={cn(
        "px-4 sm:px-8 lg:px-20 py-16 sm:py-24 text-center space-y-4",
        className,
      )}
    >
      {Icon && <Icon className="w-12 h-12 text-brand-strong mx-auto" aria-hidden />}
      <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {description}
        </p>
      )}
      {children && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {children}
        </div>
      )}
    </main>
  );
}

export function EmptyBlock({
  icon: Icon,
  message,
  children,
}: {
  icon?: LucideIcon;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="text-center py-10 space-y-3">
      {Icon && <Icon className="w-9 h-9 text-muted-foreground/50 mx-auto" aria-hidden />}
      <p className="text-sm text-muted-foreground">{message}</p>
      {children}
    </div>
  );
}
