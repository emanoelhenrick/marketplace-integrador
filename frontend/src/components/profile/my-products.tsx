/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { PackagePlus, Star } from "lucide-react";

import { PageLoading } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/types/product";

interface MyProductsProps {
  products: Product[];
  isLoading: boolean;
}

export function MyProducts({ products, isLoading }: MyProductsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Meus produtos</h2>
        <Button
          render={<Link href="/produtos/novo" />}
          variant="outline"
          size="sm"
          className="cursor-pointer flex items-center gap-1.5"
        >
          <PackagePlus className="w-4 h-4" /> Novo produto
        </Button>
      </div>

      {isLoading ? (
        <PageLoading label="Carregando seus produtos..." />
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center space-y-3">
            <p className="text-sm text-muted-foreground">Você ainda não cadastrou nenhum produto.</p>
            <Button render={<Link href="/produtos/novo" />} className="py-4 px-6 cursor-pointer">
              Cadastrar meu primeiro produto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.map((product) => (
            <Link key={product.id} href={`/produtos/${product.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-brand">{formatBRL(product.price)}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {product.stars}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
