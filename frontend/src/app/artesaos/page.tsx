"use client";

import { useEffect, useState } from "react";
import CardArtisan from "@/components/cards/card-artisans";
import { Artisan } from "@/types/artisan";
import { Loader2 } from "lucide-react";
import { artesiansService } from "@/services/artisansService";

export default function ArtesaosListPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        setIsLoading(true);
        const data = await artesiansService.getAll();
        setArtisans(data);
      } catch (err) {
        console.error("Erro ao carregar artesãos:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAll();
  }, []);

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-carvao">
          Acervo de Mestres e Artesãos
        </h1>
        <p className="text-stone-600 mt-2 text-sm sm:text-base">
          Conheça as mãos e memórias por trás da arte popular brasileira.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-(--barro) animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {artisans.map((artisan) => (
            <CardArtisan key={artisan.id} artisan={artisan} />
          ))}
        </div>
      )}
    </main>
  );
}