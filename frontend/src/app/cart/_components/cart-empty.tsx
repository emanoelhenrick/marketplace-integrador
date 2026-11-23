import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CartEmpty() {
  return (
    <Card className="text-center py-10 sm:py-12">
      <CardContent className="flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="text-muted-foreground/40 w-10 h-10 sm:w-12 sm:h-12" />
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-semibold">Seu carrinho está vazio</h2>
          <p className="text-sm text-muted-foreground">Adicione alguns produtos para começar suas compras.</p>
        </div>
        <Button render={<Link href="/products" />} className="py-5 px-8 sm:px-15 w-full sm:w-auto">
          Ver Produtos
        </Button>
      </CardContent>
    </Card>
  );
}
