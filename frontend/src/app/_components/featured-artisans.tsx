"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import CardArtisan from "@/components/cards/card-artisans";
import { PageLoading } from "@/components/common/page-state";

import { useArtisans } from "@/hooks/use-artisans";

export function FeaturedArtisans() {
  const { artisans, isLoading, error } = useArtisans(3);
  const failed = !!error;

  return (
    <section className="px-4 sm:px-8 lg:px-20 py-10 sm:py-14 bg-card space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div>
          <p className="text-xs font-bold tracking-wider text-brand uppercase">
            Mestres &amp; Mestras
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold ">
            Guardiões da nossa cultura
          </h2>
        </div>
        <Link
          href="/artisans"
          className="flex items-center gap-2 font-bold hover:text-brand transition-colors"
        >
          Ver todos os artesãos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <PageLoading label="Carregando mestres..." />
      ) : failed ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Não foi possível carregar os mestres agora. Tente novamente em
          instantes.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {artisans.map((artisan) => (
            <CardArtisan key={artisan.id} artisan={artisan} />
          ))}
        </div>
      )}
    </section>
  );
}
