import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CatalogSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}

export function CatalogSearchBar({ value, onChange, onOpenFilters, activeFilterCount }: CatalogSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 my-6 lg:my-10">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
        <Input
          id="search-product"
          type="search"
          aria-label="Pesquisar no acervo"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquise por peça, técnica, material ou território..."
          className="pl-9 py-4"
        />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onOpenFilters}
        className="lg:hidden flex items-center justify-center gap-2 py-4 cursor-pointer"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
        {activeFilterCount > 0 && <span className="w-2 h-2 rounded-full bg-brand-strong" aria-label={`${activeFilterCount} filtros ativos`} />}
      </Button>
    </div>
  );
}
