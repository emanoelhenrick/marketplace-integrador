/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Award, CircleUserRound, MapPin, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Artisan } from "@/types/artisan";

interface ArtisanProfileHeaderProps {
  artisan: Artisan;
  canManage?: boolean;
  canAddProduct?: boolean;
}

export function ArtisanProfileHeader({
  artisan,
  canManage,
  canAddProduct,
}: ArtisanProfileHeaderProps) {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start gap-6 pb-6 border-b">
      <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left w-full md:w-auto">
        {artisan.avatarUrl ? (
          <img
            src={artisan.avatarUrl}
            alt={artisan.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-card shadow-sm shrink-0"
          />
        ) : (
          <CircleUserRound className="w-24 h-24 text-brand-strong shrink-0" />
        )}

        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-strong" aria-hidden />
            {artisan.location || "Não Informado"}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {artisan.name}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <Award className="w-4 h-4 text-brand-strong shrink-0" aria-hidden />
            {artisan.craft} · {artisan.craftYears}
          </p>
          {(artisan.polo || artisan.region) && (
            <p className="inline-block text-[11px] font-semibold uppercase tracking-wide border rounded-full px-3 py-1 text-forest border-forest/50 bg-forest/10">
              {[artisan.polo, artisan.region].filter(Boolean).join(" · ")}
            </p>
          )}
          {artisan.quote && (
            <p className="text-sm text-muted-foreground italic max-w-2xl pt-1">
              &ldquo;{artisan.quote}&rdquo;
            </p>
          )}
        </div>
      </div>

      {canManage && (
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <Button
            render={<Link href="/dashboard" />}
            variant="outline"
            className="py-4 cursor-pointer"
          >
            Ver painel de vendas
          </Button>
          {canAddProduct && (
            <Button
              render={<Link href="/produtos/novo" />}
              className="py-4 cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Cadastrar nova peça
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
