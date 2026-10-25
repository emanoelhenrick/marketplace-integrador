"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { CardImageProduct } from "@/components/cards/card-image-product";
import {
  FilterDrawer,
  FilterPanel,
} from "@/components/products/product-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { productService } from "@/services/productService";
import type { Product } from "@/types/product";

const CATEGORIES = [
  "Cerâmica & Barro",
  "Rendas & Bordados",
  "Xilogravura & Cordel",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await productService.getAll();
        if (isMounted) setProducts(data);
      } catch (err) {
        console.error("Erro ao carregar acervo:", err);
        if (isMounted)
          setError("Não foi possível carregar as obras do acervo.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory)
        return false;
      if (!query) return true;
      return [
        product.name,
        product.description,
        product.category,
        product.location,
      ].some((field) => field?.toLowerCase().includes(query));
    });
  }, [products, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  const numPolos = new Set(products.map((p) => p.location).filter(Boolean))
    .size;
  const hasActiveFilters = !!(searchQuery || selectedCategory);

  const filterProps = {
    categories: CATEGORIES,
    selected: selectedCategory,
    onSelect: setSelectedCategory,
    onClear: clearFilters,
    hasActiveFilters,
  };

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 lg:py-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
        Acervo Geral de Obras e Criações Populares
      </h1>

      <p className="text-muted-foreground mt-2 font-bold text-sm sm:text-base">
        {isLoading
          ? "Carregando informações do acervo..."
          : `${products.length} ${products.length === 1 ? "peça catalogada" : "peças catalogadas"} com geolocalização e autoria confirmada${
              numPolos > 0
                ? ` em ${numPolos} ${numPolos === 1 ? "localidade" : "localidades"} de Pernambuco.`
                : " em Pernambuco."
            }`}
      </p>

      <div className="flex flex-col sm:flex-row gap-2 my-6 lg:my-10">
        <div className="relative flex items-center w-full">
          <Search
            className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden
          />
          <Input
            id="search-product"
            type="search"
            aria-label="Pesquisar no acervo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquise por peça, técnica, material ou território..."
            className="pl-9 py-4"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsFiltersOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 py-4 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {selectedCategory && (
            <span className="w-2 h-2 rounded-full bg-brand-strong" />
          )}
        </Button>
      </div>

      <section className="flex flex-col lg:flex-row gap-5">
        <aside className="hidden lg:block bg-brand-soft w-[20%] p-5 rounded-md h-fit lg:sticky lg:top-24">
          <FilterPanel {...filterProps} />
        </aside>

        <FilterDrawer
          open={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          {...filterProps}
        />

        <div className="w-full lg:w-[80%]">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner className="size-8 text-brand" />
            </div>
          ) : error ? (
            <div
              role="alert"
              className="p-6 bg-destructive/10 text-destructive rounded-md text-center"
            >
              {error}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground space-y-3">
              <p>Nenhuma peça encontrada para esta busca.</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="cursor-pointer"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayedProducts.map((product) => (
                <CardImageProduct key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
