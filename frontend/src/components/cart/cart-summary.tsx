import type { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBRL } from "@/lib/format";

interface CartSummaryProps {
  totalQuantity: number;
  total: number;
  /** Botões de ação (finalizar, limpar...). */
  children: ReactNode;
}

export function CartSummary({ totalQuantity, total, children }: CartSummaryProps) {
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total de itens</span>
          <span className="font-medium">{totalQuantity}</span>
        </div>
        <div className="flex justify-between items-center text-base sm:text-lg font-bold">
          <span>Total</span>
          <span className="text-brand">{formatBRL(total)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3">{children}</CardFooter>
    </Card>
  );
}
