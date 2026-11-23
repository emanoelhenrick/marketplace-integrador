"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

interface StockEditorProps {
  productName: string;
  stock: number;
  busy: boolean;
  /** Retorna a mensagem de erro (ex.: estoque negativo) ou null se salvou. */
  onSave: (raw: string) => Promise<string | null>;
}

/** Edição manual de estoque. Valores negativos/decimais são recusados antes de ir ao servidor. */
export function StockEditor({ productName, stock, busy, onSave }: StockEditorProps) {
  const [draft, setDraft] = useState(String(stock));
  const [error, setError] = useState<string | null>(null);
  const dirty = draft.trim() !== String(stock);

  const save = async () => {
    const message = await onSave(draft);
    setError(message);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          inputMode="numeric"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && dirty && void save()}
          aria-label={`Estoque de ${productName}`}
          aria-invalid={!!error}
          disabled={busy}
          className="h-8 w-16 rounded-md border border-input bg-transparent px-2 text-sm text-center outline-none focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:border-destructive"
        />
        <button
          type="button"
          onClick={save}
          disabled={!dirty || busy}
          aria-label={`Salvar estoque de ${productName}`}
          className="p-1.5 rounded-md border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-[11px] text-destructive max-w-40">
          {error}
        </p>
      )}
    </div>
  );
}
