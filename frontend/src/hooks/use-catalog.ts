"use client";

import { useMemo, useState } from "react";
import { countLocalities, hasActiveFilters, uniqueValues } from "@/lib/catalog";
import { CATEGORIES, REGIONS, TECHNIQUES } from "@/lib/constants";
import { productService } from "@/services/productService";
import { useAsync } from "@/hooks/use-async";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { Product, ProductQuery } from "@/types/product";

const merge = (base: readonly string[], found: string[], selected: string) =>
  Array.from(new Set([...base, ...found, ...(selected ? [selected] : [])]));

function extractProducts(data: unknown): Product[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Product[];

  if (typeof data === "object") {
    const obj = data as Record<string, any>;
    const list = obj.items || obj.data?.items || obj.data?.data || obj.data || obj.products || obj.results || obj.content;
    if (Array.isArray(list)) return list;
  }
  
  return [];
}

function applyFilters(products: Product[], query: ProductQuery) {
  const search = query.q?.toLowerCase() || "";

  return products.filter((p) => {
    const matchSearch = !search || [p.name, p.artisan, p.description]
      .some((field) => field?.toLowerCase().includes(search));

    const matchCategory = !query.category || p.category === query.category;
    const matchRegion = !query.region || p.location === query.region || (p as any).region === query.region;
    const matchTechnique = !query.technique || (p as any).technique === query.technique;

    return matchSearch && matchCategory && matchRegion && matchTechnique;
  });
}

export function useCatalog() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [technique, setTechnique] = useState("");
  const [region, setRegion] = useState("");

  const q = useDebouncedValue(text, 300);
  
  const query = useMemo<ProductQuery>(
    () => ({ q, category, technique, region }), 
    [q, category, technique, region]
  );

  const { data, error, loading, reload } = useAsync(
    () => productService.list(query), 
    [query]
  );

  // 🔴 A MÁGICA ACONTECE AQUI: Normalização à prova de falhas de estoque
  const activeProducts = useMemo(() => {
    return extractProducts(data)
      .filter((p) => p.active !== false) 
      .map((p) => {
        const safeStock = Math.max(Number(p.stock || p.quantity || 1), 1);

        return {
          ...p,
          active: true,
          available: true,
          quantity: safeStock, 
          stock: safeStock,
          status: p.status === 'out_of_stock' ? 'in_stock' : p.status
        };
      });
  }, [data]);

  const products = useMemo(
    () => applyFilters(activeProducts, query), 
    [activeProducts, query]
  );

  const facets = useMemo(() => ({
    categories: merge(CATEGORIES, uniqueValues(activeProducts, "category"), category),
    techniques: merge(TECHNIQUES, uniqueValues(activeProducts, "technique"), technique),
    regions: merge(REGIONS, uniqueValues(activeProducts, "region"), region),
  }), [activeProducts, category, technique, region]);

  const clearFilters = () => {
    setText("");
    setCategory("");
    setTechnique("");
    setRegion("");
  };

  return {
    products,
    isLoading: loading,
    error: error ? "Não foi possível carregar as obras do acervo." : null,
    reload,
    text,
    setText,
    filters: { category, technique, region },
    setCategory,
    setTechnique,
    setRegion,
    facets,
    clearFilters,
    hasActiveFilters: hasActiveFilters({ q: text, category, technique, region }),
    activeFilterCount: [category, technique, region].filter(Boolean).length,
    localities: countLocalities(products),
  };
}