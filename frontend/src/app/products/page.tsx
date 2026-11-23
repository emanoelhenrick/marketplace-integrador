"use client";

import { useState } from "react";

import { CatalogHeader } from "@/components/catalog/catalog-header";
import { CatalogSearchBar } from "@/components/catalog/catalog-search-bar";
import { ProductGrid } from "@/components/catalog/product-grid";
import { FilterDrawer, FilterPanel, type FilterGroup } from "@/components/products/product-filters";
import { useCatalog } from "@/hooks/use-catalog";

export default function ProductsPage() {
  const catalog = useCatalog();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const groups: FilterGroup[] = [
    { key: "category", label: "Categorias", options: catalog.facets.categories, selected: catalog.filters.category, onSelect: catalog.setCategory },
    { key: "technique", label: "Técnicas", options: catalog.facets.techniques, selected: catalog.filters.technique, onSelect: catalog.setTechnique },
    { key: "region", label: "Regiões", options: catalog.facets.regions, selected: catalog.filters.region, onSelect: catalog.setRegion },
  ];

  const panelProps = { groups, onClear: catalog.clearFilters, hasActiveFilters: catalog.hasActiveFilters };

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 lg:py-4">
      <CatalogHeader isLoading={catalog.isLoading} count={catalog.products.length} localities={catalog.localities} />

      <CatalogSearchBar
        value={catalog.text}
        onChange={catalog.setText}
        onOpenFilters={() => setIsFiltersOpen(true)}
        activeFilterCount={catalog.activeFilterCount}
      />

      <section className="flex flex-col lg:flex-row gap-5">
        <aside className="hidden lg:block bg-brand-soft w-[20%] p-5 rounded-md h-fit lg:sticky lg:top-24">
          <FilterPanel {...panelProps} />
        </aside>

        <FilterDrawer open={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} {...panelProps} />

        <div className="w-full lg:w-[80%]">
          <ProductGrid
            products={catalog.products}
            isLoading={catalog.isLoading}
            error={catalog.error}
            hasActiveFilters={catalog.hasActiveFilters}
            onClearFilters={catalog.clearFilters}
            onRetry={catalog.reload}
            surface="catalog"
          />
        </div>
      </section>
    </main>
  );
}
