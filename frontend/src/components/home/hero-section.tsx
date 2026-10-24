"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import CardHomeInfos from "@/components/cards/card-home-infos";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

export function HeroSection() {
  const { role } = useSession();

  const secondary =
    role === "artisan"
      ? { href: "/dashboard", label: "Ver minhas vendas" }
      : role === "admin"
        ? { href: "/dashboard", label: "Abrir painel administrativo" }
        : { href: "/polos", label: "Conhecer os polos criativos" };

  return (
    <section className="bg-brand-soft p-6 sm:p-10 lg:p-14 rounded-md border mx-4 sm:mx-8 lg:mx-20">
      <p className="inline-block font-bold bg-forest/15 py-2 px-4 sm:px-6 border border-forest/60 rounded-3xl text-forest text-xs">
        Arte Popular &amp; Economia Criativa de Pernambuco
      </p>
      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold my-5 sm:my-7">
        Onde cada peça carrega o sopro, a terra e a alma de quem fez.
      </h2>
      <p className="font-light text-base sm:text-lg max-w-3xl text-foreground/90">
        Conectamos os mestres do barro, dos teares e da xilogravura de Pernambuco aos lares de todo o
        Brasil. Sem intermediários, com remuneração justa e certificação de origem.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-6 sm:items-center">
        <Button
          render={<Link href="/produtos" />}
          className="py-5 px-6 font-semibold cursor-pointer hover:scale-105 transition-transform duration-100 flex items-center justify-center gap-2"
        >
          Explorar o Acervo Manoa <ArrowRight />
        </Button>
        <Button
          render={<Link href={secondary.href} />}
          variant="outline"
          className="py-5 px-6 font-semibold cursor-pointer text-foreground flex items-center justify-center"
        >
          {secondary.label}
        </Button>
      </div>

      <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3 sm:gap-5 mt-8 sm:mt-10">
        <CardHomeInfos value="100%" label="Origem Rastreável" />
        <CardHomeInfos value="+450" label="Mestres & Ateliês" />
        <CardHomeInfos value="R$ 2.4" label="Repasse aos Mestres" />
      </div>
    </section>
  );
}
