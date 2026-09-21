import CardArtisan from "@/components/cards/card-artisans";
import CardHomeInfos from "@/components/cards/card-home-infos";
import { CardImage } from "@/components/cards/card-image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-50">
      <section className="bg-(--barro-claro) p-15 rounded-md border">
        <div className="w-full">
          <p className="inline font-bold bg-(--mangue)/20 py-2 px-6 border border-(--mangue) rounded-3xl text-(--mangue) text-xs">
            Arte Popular & Economia Criativa de Pernambuco
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-carvao my-7">
            Onde cada peça carrega o sopro, aterra e a alma de quem fez.
          </h2>
          <p className="font-thin">
            Conectamos os mestres do barro, dos teares e da xilogravura de
            Pernambuco aos lares de todo o Brasil. Sem intermediários, com
            remuneração justa e certificação de origem
          </p>
          <div className="flex gap-5 mt-5 items-center">
            <Button className="py-4 px-6 font-semibold cursor-pointer bg-(--barro) hover:scale-105 transition-transform duration-100 ">
              <Link href="/products" className="flex items-center gap-2">
                Explorar o Acervo Manoa <ArrowRight></ArrowRight>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="py-4 px-6 font-semibold cursor-pointer text-(--mare)"
            >
              Conhecer o Selo de Autenticidade
            </Button>
          </div>

          <div className="flex items-center gap-5 mt-10">
            <CardHomeInfos value="100%" label="Origem Rastreável" />
            <CardHomeInfos value="+450" label="Mestres & Ateliês" />
            <CardHomeInfos value="R$ 2.4" label="Repasse aos Mestres" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between">
          <div className="w-[65%]">
            <p>LINGUAGENS POPULARES</p>
            <h2 className="block text-4xl font-bold">
              Três matrizes da alma pernambucana
            </h2>
          </div>
          <p className="w-[35%]">
            Saberes seculares lapidados pelo barro dos rios, a paciência dos
            teares manuais e a firmeza da goiva no cedro.
          </p>
        </div>

        <div className="flex gap-10 mt-15">
          <CardImage
            numPieces={142}
            title={"Cerâmica & Barro Queimado"}
            subtitle={"Mestres de Caruaru & Tracunhaém"}
            description={
              "Esculturas figurativas, vasos de queima a lenha e utilitários que guardam a temperatura e o aroma da terra molhada."
            }
            imageUrl={"/assets/barro.jpg"}
          />
          <CardImage
            numPieces={88}
            title={"Tecidos, Rendas & Bordados"}
            subtitle={"Rendeiras de Passira & Poção"}
            description={
              "A precisão milimétrica da Renda Renascença em almofada e o bordado manual que sustentam gerações de mulheres do Agreste."
            }
            imageUrl={"/assets/tecido.jpg"}
          />
          <CardImage
            numPieces={64}
            title={"Madeira & Xilogravura Popular"}
            subtitle={"Entalhadores de Bezerros & Recife"}
            description={
              "Matrizes originais entalhadas à mão, santos barrocos populares em cedro e a lírica gráfica do cordel pernambucano."
            }
            imageUrl={"/assets/xilogravura.jpg"}
          />
        </div>
      </section>

      <section className="flex p-10 bg-white px-15">
        <CardArtisan></CardArtisan>
      </section>
    </main>
  );
}
