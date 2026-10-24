import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-input rounded-md w-fit">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="p-3 hover:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Diminuir quantidade"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center font-semibold text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="p-3 hover:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Aumentar quantidade"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
