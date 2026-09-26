"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService"; 
import { CardImageProduct } from "@/components/cards/card-image-product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Product } from "@/types/product";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function loadInitialProducts() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await productService.getAll();

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Erro ao carregar acervo:", err);
          setError("Não foi possível carregar as obras do acervo.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayedProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchesName = product.name?.toLowerCase().includes(query);
      const matchesDesc = product.description?.toLowerCase().includes(query);
      const matchesCat = product.category?.toLowerCase().includes(query);

      return matchesName || matchesDesc || matchesCat;
    }

    return true;
  });

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  return (
    <main className="px-20">
      <h1 className="text-4xl font-bold text-carvao">
        Acervo Geral de Obras e Criações Populares
      </h1>

      <div className="flex gap-2 my-10">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="search-product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquise por mestre, técnica vernacular, material ou território..."
            className="pl-9 py-4"
          />
        </div>
        <Button className="px-15 py-4 cursor-pointer">Buscar</Button>
      </div>

      <section className="flex gap-5">
        <aside className="bg-(--barro-claro) w-[20%] p-5 rounded-md h-fit">
          <div className="flex items-center mb-4">
            <SlidersHorizontal className="text-(--urucum) w-4" />
            <h3 className="text-xl font-bold text-(--carvao) ml-2">Filtros</h3>
            {(searchQuery || selectedCategory) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="ml-auto text-(--urucum) text-sm cursor-pointer hover:underline"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-carvao">Categorias</p>
            {[
              "Cerâmica & Barro",
              "Rendas & Bordados",
              "Xilogravura & Cordel",
            ].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? "" : category,
                  )
                }
                className={`text-left text-sm py-1.5 px-3 rounded transition-colors cursor-pointer ${
                  selectedCategory === category
                    ? "bg-(--barro) text-white font-medium"
                    : "hover:bg-black/5 text-carvao"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <div className="w-[80%]">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 text-red-600 rounded-md text-center">
              {error}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              Nenhum produto encontrado para este filtro.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
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
