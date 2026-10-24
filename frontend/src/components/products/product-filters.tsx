"use client";

import { useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function FilterPanel({
  categories,
  selected,
  onSelect,
  onClear,
  hasActiveFilters,
}: FilterPanelProps) {
  return (
    <>
      <div className="flex items-center mb-4">
        <SlidersHorizontal className="text-brand-strong w-4" aria-hidden />
        <h3 className="text-xl font-bold ml-2">Filtros</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto text-brand-strong text-sm cursor-pointer hover:underline"
          >
            Limpar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Categorias</p>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={selected === category}
            onClick={() => onSelect(selected === category ? "" : category)}
            className={cn(
              "text-left text-sm py-1.5 px-3 rounded transition-colors cursor-pointer",
              selected === category
                ? "bg-primary text-primary-foreground font-medium"
                : "hover:bg-muted",
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </>
  );
}

interface FilterDrawerProps extends FilterPanelProps {
  open: boolean;
  onClose: () => void;
}

export function FilterDrawer({ open, onClose, ...panel }: FilterDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Filtros">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative ml-auto w-[85%] max-w-sm h-full bg-card text-card-foreground p-5 overflow-y-auto shadow-xl">
        <div className="flex justify-end mb-2">
          <button
            type="button"
            aria-label="Fechar filtros"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <FilterPanel {...panel} />
        <Button onClick={onClose} className="w-full mt-6 py-4 cursor-pointer">
          Ver resultados
        </Button>
      </div>
    </div>
  );
}
