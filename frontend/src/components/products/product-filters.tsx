"use client";

import { useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface FilterGroup {
  key: string;
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

interface FilterPanelProps {
  groups: FilterGroup[];
  onClear: () => void;
  hasActiveFilters: boolean;
}

/** Filtros combináveis em formato select (categoria, técnica, região). Selecionar "" limpa o critério. */
export function FilterPanel({ groups, onClear, hasActiveFilters }: FilterPanelProps) {
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

      <div className="flex flex-col gap-4">
        {groups.map((group) => {
          const selectId = `filter-${group.key}`;

          return (
            <div key={group.key} className="flex flex-col gap-1.5">
              <label htmlFor={selectId} className="text-sm font-semibold text-foreground">
                {group.label}
              </label>
              <select
                id={selectId}
                value={group.selected ?? ""}
                onChange={(e) => group.onSelect(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                <option value="">Todas</option>
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
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