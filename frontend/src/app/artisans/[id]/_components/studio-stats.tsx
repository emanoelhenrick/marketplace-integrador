import { Package, Sparkles, Star, Truck } from "lucide-react";

import { formatBRL } from "@/lib/format";

interface StudioStatsProps {
  repasse: number;
  productCount: number;
  shippedCount: number;
  avgStars: number;
  quote?: string;
}

const cardClass = "bg-brand-soft border p-5 rounded-lg space-y-3";
const headClass =
  "flex justify-between items-center text-xs font-semibold uppercase text-muted-foreground tracking-wider";
const valueClass = "text-3xl font-heading font-bold";
const noteClass = "text-xs text-muted-foreground leading-relaxed";

export function StudioStats({ repasse, productCount, shippedCount, avgStars, quote }: StudioStatsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className={cardClass}>
        <div className={headClass}>
          <span>Repasse a Receber</span>
          <Sparkles className="w-4 h-4 text-gold" aria-hidden />
        </div>
        <div className={valueClass}>{formatBRL(repasse)}</div>
        <p className={noteClass}>
          85% das vendas pagas, com transferência via PIX programada para esta sexta-feira (18h) sem taxas.
        </p>
      </div>

      <div className={cardClass}>
        <div className={headClass}>
          <span>Obras no Acervo</span>
          <Package className="w-4 h-4 text-brand" aria-hidden />
        </div>
        <div className={valueClass}>
          {productCount} <span className="text-base font-normal text-muted-foreground">peças</span>
        </div>
        <p className={noteClass}>Disponíveis para colecionadores de todo o Brasil.</p>
      </div>

      <div className={cardClass}>
        <div className={headClass}>
          <span>Viajando pelo País</span>
          <Truck className="w-4 h-4 text-muted-foreground" aria-hidden />
        </div>
        <div className={valueClass}>
          {shippedCount} <span className="text-base font-normal text-muted-foreground">remessas</span>
        </div>
        <p className={noteClass}>Pedidos já enviados com livreto e selo de autenticidade.</p>
      </div>

      <div className={cardClass}>
        <div className={headClass}>
          <span>Avaliação Cultural</span>
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden />
        </div>
        <div className={valueClass}>{productCount ? avgStars.toFixed(1) : "—"}</div>
        {quote && <p className={`${noteClass} italic`}>&ldquo;{quote}&rdquo;</p>}
      </div>
    </section>
  );
}
