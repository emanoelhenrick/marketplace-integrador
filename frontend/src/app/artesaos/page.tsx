"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import CardArtisan from "@/components/cards/card-artisans";
import { EmptyBlock, PageLoading } from "@/components/common/page-state";
import { artesiansService } from "@/services/artisansService";
import type { Artisan } from "@/types/artisan";

function ArtisansList() {
  const polo = useSearchParams().get("polo");

  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    artesiansService
      .getAll()
      .then((data) => isMounted && setArtisans(data))
      .catch((err) => {
        console.error("Erro ao carregar artesãos:", err);
        if (isMounted) setError("Não foi possível carregar os mestres agora.");
      })
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  const visible = useMemo(
    () => (polo ? artisans.filter((a) => a.polo === polo) : artisans),
    [artisans, polo],
  );

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4 lg:py-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Acervo de Mestres e Artesãos</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Conheça as mãos e memórias por trás da arte popular brasileira.
        </p>
        {polo && (
          <Link
            href="/artesaos"
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold border border-forest/60 bg-forest/15 text-forest rounded-full px-3 py-1.5 hover:bg-forest/25 transition-colors"
          >
            {polo} <X className="w-3.5 h-3.5" aria-label="Remover filtro" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <PageLoading label="Carregando mestres..." />
      ) : error ? (
        <p role="alert" className="p-6 bg-destructive/10 text-destructive rounded-md text-center">
          {error}
        </p>
      ) : visible.length === 0 ? (
        <EmptyBlock message="Nenhum mestre encontrado para este polo." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {visible.map((artisan) => (
            <CardArtisan key={artisan.id} artisan={artisan} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function ArtesaosListPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ArtisansList />
    </Suspense>
  );
}
