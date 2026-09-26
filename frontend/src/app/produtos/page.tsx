<<<<<<< HEAD
"use client";

import { useState } from "react";
import { useEffect } from "react";
import { productService } from "@/services/productService";
import { CardImageProduct } from "@/components/cards/card-image-product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Product } from "@/types/product";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const categories = [
    "Cerâmica & Barro",
    "Rendas & Bordados",
    "Xilogravura & Cordel",
  ];

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

  const numPecas = products.length;
  const numPolos = new Set(products.map((p) => p.location).filter(Boolean))
    .size;

  const filtersContent = (
    <>
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
        {categories.map((category) => (
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
    </>
  );

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-6 lg:py-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-carvao">
        Acervo Geral de Obras e Criações Populares
      </h1>

      <p className="text-stone-600 mt-2 font-bold text-sm sm:text-base">
        {isLoading
          ? "A carregar informações do acervo..."
          : `${numPecas} ${numPecas === 1 ? "peça catalogada" : "peças catalogadas"} com geolocalização e autoria confirmada${
              numPolos > 0
                ? ` em ${numPolos} ${numPolos === 1 ? "polo" : "polos"} de Pernambuco.`
                : " em Pernambuco."
            }`}
      </p>

      <div className="flex flex-col sm:flex-row gap-2 my-6 lg:my-10">
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
        <div className="flex gap-2">
          <Button className="flex-1 sm:flex-none sm:px-15 py-4 cursor-pointer">
            Buscar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 py-4 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {selectedCategory && (
              <span className="w-2 h-2 rounded-full bg-(--urucum)" />
            )}
          </Button>
        </div>
      </div>

      <section className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:block bg-(--barro-claro) w-[20%] p-5 rounded-md h-fit">
          {filtersContent}
        </aside>

        {/* Sidebar - mobile/tablet drawer */}
        {isFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsFiltersOpen(false)}
            />
            <div className="relative ml-auto w-[85%] max-w-sm h-full bg-white p-5 overflow-y-auto shadow-xl">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  aria-label="Fechar filtros"
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-1 rounded-full hover:bg-black/10 cursor-pointer"
                >
                  <X className="w-5 h-5 text-carvao" />
                </button>
              </div>
              {filtersContent}
              <Button
                onClick={() => setIsFiltersOpen(false)}
                className="w-full mt-6 py-4 cursor-pointer"
              >
                Ver resultados
              </Button>
            </div>
          </div>
        )}

        <div className="w-full lg:w-[80%]">
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
=======
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
>>>>>>> b183190bf7cb7c6c3dd7408c3d08cf427373cc17
