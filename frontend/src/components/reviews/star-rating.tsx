"use client";

import { Star } from "lucide-react";
import { cn } from "cn";

/** Estrelas somente leitura (fracionadas arredondam para a mais próxima). */
export function StarDisplay({ value, className }: { value: number; className?: string }) {
  const rounded = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`Nota ${value.toFixed(1)} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn("w-4 h-4", n <= rounded ? "text-amber-500 fill-amber-500" : "text-muted-foreground/40")} />
      ))}
    </span>
  );
}

/** Seletor de nota de 1 a 5 (radiogroup acessível). */
export function StarInput({ value, onChange, disabled }: { value: number; onChange: (n: number) => void; disabled?: boolean }) {
  return (
    <div role="radiogroup" aria-label="Nota de 1 a 5" className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
          disabled={disabled}
          onClick={() => onChange(n)}
          className="p-0.5 cursor-pointer disabled:cursor-not-allowed"
        >
          <Star className={cn("w-7 h-7 transition-colors", n <= value ? "text-amber-500 fill-amber-500" : "text-muted-foreground/40")} />
        </button>
      ))}
    </div>
  );
}
