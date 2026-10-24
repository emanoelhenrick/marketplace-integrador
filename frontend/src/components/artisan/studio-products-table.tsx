/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { formatBRL } from "@/lib/format";
import { toast } from "@/lib/toast";
import type { Product } from "@/types/product";

/** Repasse líquido ao artesão sobre o preço de galeria. */
export const ARTISAN_SHARE = 0.85;

export function StudioProductsTable({ products, canEdit }: { products: Product[]; canEdit: boolean }) {
  return (
    <section className="space-y-4">
      <div>
        <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
          • Gestão do ateliê
        </span>
        <h2 className="text-xl sm:text-2xl font-heading font-bold">Obras expostas no catálogo</h2>
        <p className="text-xs text-muted-foreground">
          Veja quanto cada comprador paga e o valor líquido exato que cai na sua conta, sem surpresas.
        </p>
      </div>

      <div className="bg-card border rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm min-w-140">
          <thead className="bg-muted/60 border-b text-[11px] uppercase font-semibold text-muted-foreground tracking-wider">
            <tr>
              <th className="p-4">Obra &amp; técnica</th>
              <th className="p-4">Preço na galeria</th>
              <th className="p-4">Ganho líquido (85%)</th>
              <th className="p-4">Exibição</th>
              {canEdit && <th className="p-4 text-right">Ação</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 5 : 4} className="p-6 text-center text-muted-foreground">
                  Nenhuma obra cadastrada para este artesão.
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4">
                    <Link href={`/produtos/${item.id}`} className="flex items-center gap-3 group">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 object-cover rounded border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold group-hover:underline line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="p-4 font-semibold">{formatBRL(item.price)}</td>
                  <td className="p-4 font-bold text-forest">{formatBRL(item.price * ARTISAN_SHARE)}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-forest/15 text-forest border border-forest/40">
                      • Visível
                    </span>
                  </td>
                  {canEdit && (
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => toast.info("Edição de peças ainda não disponível")}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-label={`Editar ${item.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
