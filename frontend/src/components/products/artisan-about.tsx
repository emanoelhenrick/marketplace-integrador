/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Award, CircleUserRound, MapPin } from "lucide-react";

import type { Artisan } from "@/types/artisan";

export function ArtisanAbout({ artisan }: { artisan: Artisan }) {
  return (
    <div className="bg-brand-soft border rounded-md p-5 sm:p-8">
      <p className="text-xs font-bold text-brand uppercase tracking-wider mb-4">Sobre o Mestre</p>

      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {artisan.avatarUrl ? (
          <img
            src={artisan.avatarUrl}
            alt={artisan.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-background shadow-sm shrink-0 mx-auto sm:mx-0"
          />
        ) : (
          <CircleUserRound className="w-16 h-16 sm:w-20 sm:h-20 text-brand-strong shrink-0 mx-auto sm:mx-0" />
        )}

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">{artisan.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <Award className="w-3.5 h-3.5 text-brand-strong shrink-0" />
            {artisan.craft} · {artisan.craftYears}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-strong shrink-0" />
            {artisan.location}
          </p>
          {artisan.quote && (
            <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed pt-1">
              &ldquo;{artisan.quote}&rdquo;
            </p>
          )}
        </div>

        <Link
          href={`/artesaos/${artisan.id}`}
          className="shrink-0 w-full sm:w-auto text-center px-5 py-2.5 bg-card border text-sm font-semibold rounded-md hover:bg-muted transition-colors"
        >
          Ver perfil do mestre
        </Link>
      </div>
    </div>
  );
}
