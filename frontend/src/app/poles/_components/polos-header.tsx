
interface PolosHeaderProps {
  isLoading: boolean;
  totalPolos: number;
  totalArtisans: number;
  totalRegions: number;
}

export function PolosHeader({ isLoading, totalPolos, totalArtisans, totalRegions }: PolosHeaderProps) {
  return (
    <section className="bg-brand-soft p-6 sm:p-10 lg:p-15 rounded-md border mx-4 sm:mx-10 lg:mx-20 mt-6 sm:mt-8 lg:mt-10">
      <p className="hidden sm:inline font-bold bg-forest/20 py-2 px-4 sm:px-6 border border-forest/60 rounded-3xl text-forest text-xs">
        Territórios & Economia Criativa de Pernambuco
      </p>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground my-5 sm:my-7">
        Polos Criativos: onde cada território guarda uma tradição viva.
      </h1>
      <p className="font-light text-sm sm:text-base max-w-3xl">
        Do Agreste ao Sertão, mapeamos as comunidades onde mestres e mestras
        concentram séculos de saber popular. Cada polo é um convite para
        conhecer a origem exata de cada peça.
      </p>

      <div className="flex flex-wrap items-center gap-4 sm:gap-5 mt-8 sm:mt-10">
        <div className="bg-card/70 border border-brand/20 rounded-md px-5 py-3 min-w-35">
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {isLoading ? "…" : totalPolos}
          </p>
          <p className="text-xs text-muted-foreground font-medium">Polos mapeados</p>
        </div>
        <div className="bg-card/70 border border-brand/20 rounded-md px-5 py-3 min-w-35">
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {isLoading ? "…" : totalArtisans}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            Mestres & Mestras
          </p>
        </div>
        <div className="bg-card/70 border border-brand/20 rounded-md px-5 py-3 min-w-35">
          <p className="text-2xl sm:text-3xl font-bold text-foreground">
            {isLoading ? "…" : totalRegions}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            Regiões de Pernambuco
          </p>
        </div>
      </div>
    </section>
  );
}