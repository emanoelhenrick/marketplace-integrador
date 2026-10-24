import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CardImage } from "@/components/cards/card-image";

const MATRIZES = [
  {
    href: "/matrizes#ceramica-barro",
    numPieces: 142,
    title: "Cerâmica & Barro Queimado",
    subtitle: "Mestres de Caruaru & Tracunhaém",
    description:
      "Esculturas figurativas, vasos de queima a lenha e utilitários que guardam a temperatura e o aroma da terra molhada.",
    imageUrl: "/assets/barro.jpg",
  },
  {
    href: "/matrizes#tecidos-rendas-bordados",
    numPieces: 88,
    title: "Tecidos, Rendas & Bordados",
    subtitle: "Rendeiras de Passira & Poção",
    description:
      "A precisão milimétrica da Renda Renascença em almofada e o bordado manual que sustentam gerações de mulheres do Agreste.",
    imageUrl: "/assets/tecido.jpg",
  },
  {
    href: "/matrizes#madeira-xilogravura",
    numPieces: 64,
    title: "Madeira & Xilogravura Popular",
    subtitle: "Entalhadores de Bezerros & Recife",
    description:
      "Matrizes originais entalhadas à mão, santos barrocos populares em cedro e a lírica gráfica do cordel pernambucano.",
    imageUrl: "/assets/xilogravura.jpg",
  },
];

export function MatrizesSection() {
  return (
    <section className="px-4 sm:px-8 lg:px-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div className="sm:w-[65%]">
          <p className="text-xs font-bold text-brand uppercase">Linguagens populares</p>
          <h2 className="block text-3xl sm:text-4xl font-bold">Três matrizes da alma pernambucana</h2>
          <p className="text-muted-foreground mt-2">
            Saberes seculares lapidados pelo barro dos rios, a paciência dos teares manuais e a firmeza da
            goiva no cedro.
          </p>
        </div>

        <Link
          href="/matrizes"
          className="flex items-center gap-2 font-bold hover:text-brand transition-colors pb-2 shrink-0"
        >
          Explorar todas as matrizes <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 mt-8 sm:mt-12">
        {MATRIZES.map(({ href, ...card }) => (
          <Link key={href} href={href} className="hover:scale-[1.02] transition-transform duration-300">
            <CardImage {...card} />
          </Link>
        ))}
      </div>
    </section>
  );
}
