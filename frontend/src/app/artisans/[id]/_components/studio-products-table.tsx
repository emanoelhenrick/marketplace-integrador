/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Pencil, Power } from "lucide-react";

import { StockEditor } from "@/app/artisans/_components/stock-editor";
import { ARTISAN_SHARE } from "@/lib/constants";
import { stockOf } from "@/lib/catalog";
import { formatBRL } from "@/lib/format";
import { fromCents, toCents } from "@/lib/money";
import type { Product } from "@/types/product";

interface StudioProductsTableProps {
  products: Product[];
  canEdit: boolean;
  busyId?: string | null;
  onToggleActive?: (product: Product) => void;
  onUpdateStock?: (product: Product, raw: string) => Promise<string | null>;
}

function visibilityOf(p: Product): { label: string; tone: string } {
  if (p.active === false) return { label: "Desativada", tone: "bg-muted text-muted-foreground border-border" };
  if ((p.moderationStatus ?? "approved") === "pending") return { label: "Em curadoria", tone: "bg-amber-100 text-amber-900 border-amber-300" };
  if ((p.moderationStatus ?? "approved") === "rejected") return { label: "Reprovada", tone: "bg-destructive/10 text-destructive border-destructive/40" };
  if (stockOf(p) <= 0) return { label: "Sem estoque", tone: "bg-destructive/10 text-destructive border-destructive/40" };
  return { label: "Visível", tone: "bg-forest/15 text-forest border-forest/40" };
}

export function StudioProductsTable({ products, canEdit, busyId, onToggleActive, onUpdateStock }: StudioProductsTableProps) {
  const columns = canEdit ? 6 : 4;

  return (
    <section className="space-y-4">
      <div>
        <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">• Gestão do ateliê</span>
        <h2 className="text-xl sm:text-2xl font-heading font-bold">Obras expostas no catálogo</h2>
        <p className="text-xs text-muted-foreground">
          Veja quanto cada comprador paga e o valor líquido exato que cai na sua conta, sem surpresas.
        </p>
      </div>

      <div className="bg-card border rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm min-w-170">
          <thead className="bg-muted/60 border-b text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">
            <tr>
              <th className="p-4">Obra &amp; técnica</th>
              <th className="p-4">Preço na galeria</th>
              <th className="p-4">Ganho líquido ({Math.round(ARTISAN_SHARE * 100)}%)</th>
              {canEdit && <th className="p-4">Estoque</th>}
              <th className="p-4">Exibição</th>
              {canEdit && <th className="p-4 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={columns} className="p-6 text-center text-muted-foreground">
                  Nenhuma obra cadastrada para este artesão.
                </td>
              </tr>
            ) : (
              products.map((item) => {
                const visibility = visibilityOf(item);
                const busy = busyId === String(item.id);
                return (
                  <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-4">
                      <Link href={`/products/${item.id}`} className="flex items-center gap-3 group">
                        <img src={item.image} alt="" className="w-12 h-12 object-cover rounded border shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold group-hover:underline line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{[item.category, item.technique].filter(Boolean).join(" · ")}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4 font-semibold">{formatBRL(item.price)}</td>
                    <td className="p-4 font-bold text-forest">{formatBRL(fromCents(Math.round(toCents(item.price) * ARTISAN_SHARE)))}</td>
                    {canEdit && (
                      <td className="p-4">
                        {onUpdateStock && (
                          <StockEditor
                            key={`${item.id}-${item.stock}`}
                            productName={item.name}
                            stock={stockOf(item)}
                            busy={busy}
                            onSave={(raw) => onUpdateStock(item, raw)}
                          />
                        )}
                      </td>
                    )}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${visibility.tone}`}>
                        • {visibility.label}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/products/${item.id}/edit`}
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={`Editar ${item.name}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => onToggleActive?.(item)}
                            disabled={busy}
                            className="flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium hover:bg-muted disabled:opacity-50 cursor-pointer"
                            aria-label={item.active === false ? `Reativar ${item.name}` : `Desativar ${item.name}`}
                          >
                            <Power className="w-3.5 h-3.5" />
                            {item.active === false ? "Reativar" : "Desativar"}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
