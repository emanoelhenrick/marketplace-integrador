/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, MapPin, Sparkles, Users } from "lucide-react";

import { Artisan } from "@/types/artisan";
import { artesiansService } from "@/services/artisansService";

type RegionStyle = {
  badge: string;
  dot: string;
};

const REGION_STYLES: Record<string, RegionStyle> = {
  Agreste: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  Metropolitana: {
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
  },
  "Zona da Mata": {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  Sertão: {
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
};

const DEFAULT_REGION_STYLE: RegionStyle = {
  badge: "bg-stone-50 text-stone-700 border-stone-200",
  dot: "bg-stone-500",
};

interface PoloGroup {
  name: string;
  region: string;
  artisans: Artisan[];
  crafts: string[];
  totalWorks: number;
  representative: Artisan;
}

export default function PolosPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadArtisans() {
      try {
        setIsLoading(true);
        const data = await artesiansService.getAll();
        if (isMounted) setArtisans(data);
      } catch (err) {
        console.error("Erro ao carregar polos criativos:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadArtisans();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const totalRegions = new Set(polos.map((p) => p.region).filter(Boolean))
    .size;

  return (
    <main className="space-y-10 sm:space-y-14">
      {/* Hero */}
      <section className="bg-(--barro-claro) p-6 sm:p-10 lg:p-15 rounded-md border mx-4 sm:mx-10 lg:mx-20 mt-6 sm:mt-8 lg:mt-10">
        <p className="hidden sm:inline font-bold bg-(--mangue)/20 py-2 px-4 sm:px-6 border border-(--mangue) rounded-3xl text-(--mangue) text-xs ">
          Territórios & Economia Criativa de Pernambuco
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-carvao my-5 sm:my-7">
          Polos Criativos: onde cada território guarda uma tradição viva.
        </h1>
        <p className="font-thin text-sm sm:text-base max-w-3xl">
          Do Agreste ao Sertão, mapeamos as comunidades onde mestres e
          mestras concentram séculos de saber popular. Cada polo é um
          convite para conhecer a origem exata de cada peça.
        </p>

        <div className="flex flex-wrap items-center gap-4 sm:gap-5 mt-8 sm:mt-10">
          <div className="bg-white/70 border border-(--barro)/20 rounded-md px-5 py-3 min-w-[140px]">
            <p className="text-2xl sm:text-3xl font-bold text-carvao">
              {isLoading ? "…" : polos.length}
            </p>
            <p className="text-xs text-stone-600 font-medium">
              Polos mapeados
            </p>
          </div>
          <div className="bg-white/70 border border-(--barro)/20 rounded-md px-5 py-3 min-w-[140px]">
            <p className="text-2xl sm:text-3xl font-bold text-carvao">
              {isLoading ? "…" : artisans.length}
            </p>
            <p className="text-xs text-stone-600 font-medium">
              Mestres & Mestras
            </p>
          </div>
          <div className="bg-white/70 border border-(--barro)/20 rounded-md px-5 py-3 min-w-[140px]">
            <p className="text-2xl sm:text-3xl font-bold text-carvao">
              {isLoading ? "…" : totalRegions}
            </p>
            <p className="text-xs text-stone-600 font-medium">
              Regiões de Pernambuco
            </p>
          </div>
        </div>
      </section>

      {/* Lista de polos */}
      <section className="px-4 sm:px-8 lg:px-20">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-0 mb-6 sm:mb-10">
          <div>
            <p className="text-xs font-bold text-(--barro) uppercase tracking-wider">
              Mapa da Cultura Popular
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-carvao">
              Conheça cada território criativo
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-(--barro) animate-spin" />
          </div>
        ) : polos.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            Nenhum polo criativo encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {polos.map((polo) => {
              const regionStyle =
                REGION_STYLES[polo.region] || DEFAULT_REGION_STYLE;
              const visibleArtisans = polo.artisans.slice(0, 4);
              const extraCount = polo.artisans.length - visibleArtisans.length;

              return (
                <div
                  key={polo.name}
                  className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide border rounded-full px-3 py-1 ${regionStyle.badge}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${regionStyle.dot}`}
                        />
                        {polo.region || "Pernambuco"}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-stone-500 shrink-0">
                        <Users className="w-3.5 h-3.5" />
                        {polo.artisans.length}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-carvao leading-snug">
                        {polo.name}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        {polo.representative.location || "Pernambuco"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {polo.crafts.map((craft) => (
                        <span
                          key={craft}
                          className="text-[11px] font-medium text-(--barro) bg-(--barro-claro) border border-(--barro)/20 rounded-full px-2.5 py-1"
                        >
                          {craft}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 italic leading-relaxed line-clamp-3">
                      &ldquo;{polo.representative.quote}&rdquo;
                      <span className="not-italic text-stone-400">
                        {" "}
                        — {polo.representative.name}
                      </span>
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center">
                      {visibleArtisans.map((artisan, index) => (
                        <img
                          key={artisan.id}
                          src={artisan.avatarUrl}
                          alt={artisan.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm -ml-2 first:ml-0"
                          style={{ zIndex: visibleArtisans.length - index }}
                        />
                      ))}
                      {extraCount > 0 && (
                        <span className="w-8 h-8 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-stone-600 -ml-2">
                          +{extraCount}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/artesaos?polo=${encodeURIComponent(polo.name)}`}
                      className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-(--urucum) hover:underline shrink-0"
                    >
                      Ver mestres <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA final */}
      <section className="px-4 sm:px-8 lg:px-20 pb-10 sm:pb-14">
        <div className="bg-[#FAF3EA] border border-amber-200/60 rounded-lg p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-carvao">
                Seu ateliê também é um polo criativo?
              </h3>
              <p className="text-sm text-stone-600 mt-1 max-w-xl">
                Cadastre seu ofício na Manoa e ajude a mapear mais um
                território da cultura popular pernambucana.
              </p>
            </div>
          </div>
          <Link
            href="/artesaos"
            className="shrink-0 w-full md:w-auto text-center px-6 py-3 bg-(--barro) text-white font-semibold rounded-md hover:scale-105 transition-transform duration-100"
          >
            Conhecer os Mestres
          </Link>
        </div>
      </section>
    </main>
  );
}