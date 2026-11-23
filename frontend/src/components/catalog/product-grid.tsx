import { CardImageProduct } from "@/components/cards/card-image-product";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onRetry: () => void;
  surface: string;
}

export function ProductGrid({ products, isLoading, error, hasActiveFilters, onClearFilters, onRetry, surface }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20" role="status" aria-label="Carregando peças">
        <Spinner className="size-8 text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="p-6 bg-destructive/10 text-destructive rounded-md text-center space-y-3">
        <p>{error}</p>
        <Button variant="outline" onClick={onRetry} className="cursor-pointer">
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-10 text-center text-muted-foreground space-y-3">
        <p>{hasActiveFilters ? "Nenhuma peça encontrada para esta busca." : "Nenhuma peça disponível no momento."}</p>
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} className="cursor-pointer">
            Limpar filtros
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {products.map((product, index) => (
        <CardImageProduct key={product.id} product={product} trackingSurface={surface} position={index} />
      ))}
    </div>
  );
}
