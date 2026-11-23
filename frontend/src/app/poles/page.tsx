"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Artisan } from "@/types/artisan";
import { useArtisans } from "@/hooks/use-artisans";
import { PolosHeader } from "./_components/polos-header";
import { PoloCard } from "./_components/polo-card";
import { PolosCta } from "./_components/polos-cta";

export interface PoloGroup {
  name: string;
  region: string;
  artisans: Artisan[];
  crafts: string[];
  totalWorks: number;
  representative: Artisan;
}

export default function PolosPage() {
  const { artisans, isLoading } = useArtisans();

  const polos = useMemo<PoloGroup[]>(() => {
    const map = new Map<string, { region: string; artisans: Artisan[] }>();

    artisans.forEach((artisan) => {
      const poloName = artisan.polo;
      if (!poloName) return;

      if (!map.has(poloName)) {
        map.set(poloName, { region: artisan.region || "", artisans: [] });
      }
      map.get(poloName)!.artisans.push(artisan);
    });

    return Array.from(map.entries())
      .map(([name, data]) => {
        const crafts = Array.from(
          new Set(data.artisans.map((a) => a.craft).filter(Boolean)),
        ) as string[];
        
        const totalWorks = data.artisans.reduce(
          (acc, a) => acc + (a.totalWorks || 0),
          0,
        );

        return {
          name,
          region: data.region,
          artisans: data.artisans,
          crafts,
          totalWorks,
          representative: data.artisans[0], 
        };
      })
      .sort((a, b) => b.artisans.length - a.artisans.length);
  }, [artisans]);

  const totalRegions = new Set(polos.map((p) => p.region).filter(Boolean)).size;

  return (
    <main className="space-y-10 sm:space-y-14">
      <PolosHeader 
        isLoading={isLoading} 
        totalPolos={polos.length} 
        totalArtisans={artisans.length}
        totalRegions={totalRegions}
      />

      <section className="px-4 sm:px-8 lg:px-20">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-0 mb-6 sm:mb-10">
          <div>
            <p className="text-xs font-bold text-brand uppercase tracking-wider">
              Mapa da Cultura Popular
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Conheça cada território criativo
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        ) : polos.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            Nenhum polo criativo encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {polos.map((polo) => (
              <PoloCard key={polo.name} polo={polo} />
            ))}
          </div>
        )}
      </section>

      <PolosCta />
    </main>
  );
}