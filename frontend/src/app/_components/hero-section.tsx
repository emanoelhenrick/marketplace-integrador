"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import CardHomeInfos from "@/components/cards/card-home-infos";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

const SECONDARY_ACTIONS: Record<string, { href: string; label: string }> = {
  artisan: { href: "/dashboard", label: "Ver minhas vendas" },
  admin: { href: "/dashboard", label: "Abrir painel administrativo" },
};

const DEFAULT_SECONDARY_ACTION = {
  href: "/poles",
  label: "Conhecer os polos criativos",
};

const HERO_METRICS = [
  { value: "100%", label: "Origem Rastreável" },
  { value: "+450", label: "Mestres & Ateliês" },
  { value: "R$ 2.4", label: "Repasse aos Mestres" },
] as const;

export function HeroSection() {
  const { role } = useSession();

  const secondaryAction =
    (role ? SECONDARY_ACTIONS[role] : undefined) ?? DEFAULT_SECONDARY_ACTION;

  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-brand-soft p-6 shadow-xs sm:p-10 lg:p-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-forest/30 bg-forest/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-forest">
            Arte Popular &amp; Economia Criativa de Pernambuco
          </span>

          <h1
            id="hero-heading"
            className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]"
          >
            Onde cada peça carrega o sopro, a terra e a alma de quem fez.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            Conectamos os mestres do barro, dos teares e da xilogravura de
            Pernambuco aos lares de todo o Brasil. Sem intermediários, com
            remuneração justa e certificação de origem.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              nativeButton={false}
              render={<Link href="/products" />}
              className="group h-12 rounded-lg px-6 text-sm font-semibold shadow-xs transition-all"
            >
              <span>Explorar o Acervo Manoa</span>
              <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>

            <Button
              nativeButton={false}
              render={<Link href={secondaryAction.href} />}
              variant="outline"
              className="h-12 rounded-lg px-6 text-sm font-semibold text-foreground transition-colors"
            >
              {secondaryAction.label}
            </Button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 border-t border-border/50 pt-8 sm:grid-cols-3 sm:gap-6 lg:mt-12">
          {HERO_METRICS.map((metric) => (
            <CardHomeInfos
              key={metric.label}
              value={metric.value}
              label={metric.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
