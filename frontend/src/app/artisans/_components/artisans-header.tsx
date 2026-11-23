import { Link, X } from "lucide-react";

export function ArtisansHeader({ polo = null }: { polo?: string | null }) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
        Acervo de Mestres e Artesãos
      </h1>
      <p className="text-muted-foreground mt-2 text-sm sm:text-base">
        Conheça as mãos e memórias por trás da arte popular brasileira.
      </p>
      
      {polo && (
        <Link
          href="/artisans"
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold border border-forest/60 bg-forest/15 text-forest rounded-full px-3 py-1.5 hover:bg-forest/25 transition-colors"
        >
          {polo} <X className="w-3.5 h-3.5" aria-label="Remover filtro" />
        </Link>
      )}
    </div>
  );
}