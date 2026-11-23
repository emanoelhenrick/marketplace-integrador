import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StockIssue } from "@/lib/cart";

const MESSAGE: Record<StockIssue["kind"], (i: StockIssue) => string> = {
  out_of_stock: () => "esgotou.",
  unavailable: () => "não está mais disponível.",
  insufficient: (i) => `tem só ${i.available} em estoque (você pediu ${i.requested}).`,
};

interface StockAlertProps {
  issues: StockIssue[];
  onResolve: () => void;
}

/** Bloqueia a finalização enquanto houver item sem estoque suficiente. */
export function StockAlert({ issues, onResolve }: StockAlertProps) {
  if (issues.length === 0) return null;

  return (
    <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-4 space-y-3 text-sm">
      <p className="flex items-center gap-2 font-semibold text-destructive">
        <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden />
        Não é possível finalizar: o estoque mudou.
      </p>
      <ul className="list-disc pl-5 space-y-1 text-foreground/90">
        {issues.map((issue) => (
          <li key={String(issue.productId)}>
            <strong>{issue.name}</strong> {MESSAGE[issue.kind](issue)}
          </li>
        ))}
      </ul>
      <Button variant="outline" size="sm" onClick={onResolve} className="cursor-pointer">
        Ajustar carrinho ao estoque
      </Button>
    </div>
  );
}
