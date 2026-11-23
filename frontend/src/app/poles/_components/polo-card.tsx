/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { PoloGroup } from "../page";

type RegionStyle = {
  badge: string;
  dot: string;
};

const REGION_STYLES: Record<string, RegionStyle> = {
  Agreste: {
    badge: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/40",
    dot: "bg-amber-500",
  },
  Metropolitana: {
    badge: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/40",
    dot: "bg-sky-500",
  },
  "Zona da Mata": {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40",
    dot: "bg-emerald-500",
  },
  Sertão: {
    badge: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/40",
    dot: "bg-orange-500",
  },
};

const DEFAULT_REGION_STYLE: RegionStyle = {
  badge: "bg-muted text-muted-foreground border-border",
  dot: "bg-muted",
};

interface PoloCardProps {
  polo: PoloGroup;
}

export function PoloCard({ polo }: PoloCardProps) {
  const regionStyle = REGION_STYLES[polo.region] || DEFAULT_REGION_STYLE;
  const visibleArtisans = polo.artisans.slice(0, 4);
  const extraCount = polo.artisans.length - visibleArtisans.length;

  return (
    <div className="bg-card border border-border rounded-lg p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide border rounded-full px-3 py-1 ${regionStyle.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${regionStyle.dot}`} />
            {polo.region || "Pernambuco"}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground shrink-0">
            <Users className="w-3.5 h-3.5" />
            {polo.artisans.length}
          </span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
            {polo.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {polo.representative.location || "Pernambuco"}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {polo.crafts.map((craft) => (
            <span
              key={craft}
              className="text-[11px] font-medium text-brand bg-brand-soft border border-brand/20 rounded-full px-2.5 py-1"
            >
              {craft}
            </span>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed line-clamp-3">
          &ldquo;{polo.representative.quote}&rdquo;
          <span className="not-italic text-muted-foreground">
            {" "}— {polo.representative.name}
          </span>
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center">
          {visibleArtisans.map((artisan, index) => (
            <img
              key={artisan.id}
              src={artisan.avatarUrl}
              alt={artisan.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-card shadow-sm -ml-2 first:ml-0"
              style={{ zIndex: visibleArtisans.length - index }}
            />
          ))}
          {extraCount > 0 && (
            <span className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted-foreground -ml-2">
              +{extraCount}
            </span>
          )}
        </div>

        <Link
          href={`/artisans?polo=${encodeURIComponent(polo.name)}`}
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-brand-strong hover:underline shrink-0"
        >
          Ver mestres <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}