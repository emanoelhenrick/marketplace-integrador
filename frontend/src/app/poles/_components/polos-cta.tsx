import Link from "next/link";
import { Sparkles } from "lucide-react";

export function PolosCta() {
  return (
    <section className="px-4 sm:px-8 lg:px-20 pb-10 sm:pb-14">
      <div className="bg-brand-soft border rounded-lg p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-gold shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Seu ateliê também é um polo criativo?
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Cadastre seu ofício na Manoa e ajude a mapear mais um território
              da cultura popular pernambucana.
            </p>
          </div>
        </div>
        <Link
          href="/artisans"
          className="shrink-0 w-full md:w-auto text-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:scale-105 transition-transform duration-100"
        >
          Conhecer os Mestres
        </Link>
      </div>
    </section>
  );
}