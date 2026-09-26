/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Star } from "lucide-react";

import { Artisan } from "@/types/artisan";
import { Product } from "@/types/product";
import { artesiansService } from "@/services/artisansService";
import { productService } from "@/services/productService";

interface MatrizDefinition {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  categories: string[];
}

const MATRIZES: MatrizDefinition[] = [
  {
    slug: "ceramica-barro",
    title: "Cerâmica & Barro Queimado",
    subtitle: "Mestres de Caruaru & Tracunhaém",
    description:
      "Esculturas figurativas, vasos de queima a lenha e utilitários que guardam a temperatura e o aroma da terra molhada.",
    longDescription:
      "No Agreste e na Zona da Mata Norte de Pernambuco, o barro é moldado à mão desde o Mestre Vitalino. Do Alto do Moura aos caracóis de Tracunhaém, cada peça carrega retirantes, bandas de pífanos e leões que guardam a memória popular do sertão nordestino, queimados em fornos a lenha e vitrificados artesanalmente.",
    imageUrl: "/assets/barro.jpg",
    categories: ["Cerâmica & Barro"],
  },
  {
    slug: "tecidos-rendas-bordados",
    title: "Tecidos, Rendas & Bordados",
    subtitle: "Rendeiras de Passira & Poção",
    description:
      "A precisão milimétrica da Renda Renascença em almofada e o bordado manual que sustentam gerações de mulheres do Agreste.",
    longDescription:
      "Nas mãos das rendeiras do Agreste pernambucano, a Renda Renascença nasce ponto a ponto sobre a almofada, em uma tradição centenária transmitida entre gerações de mulheres. Toalhas, caminhos de mesa e acessórios de alta costura são trabalhados em linho e algodão puro, com precisão milimétrica.",
    imageUrl: "/assets/tecido.jpg",
    categories: ["Rendas & Bordados"],
  },
  {
    slug: "madeira-xilogravura",
    title: "Madeira & Xilogravura Popular",
    subtitle: "Entalhadores de Bezerros & Recife",
    description:
      "Matrizes originais entalhadas à mão, santos barrocos populares em cedro e a lírica gráfica do cordel pernambucano.",
    longDescription:
      "De Bezerros a Olinda, passando pelo Vale do São Francisco, mestres entalhadores esculpem na madeira a poesia do povo nordestino. Matrizes de xilogravura para capas de cordel, santos barrocos em cedro, máscaras de papangu e carrancas que protegem as águas do Velho Chico nascem do goivo e da faca de talha.",
    imageUrl: "/assets/xilogravura.jpg",
    categories: ["Xilogravura & Cordel", "Escultura em Madeira"],
  },
];

export default function MatrizesPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const [artisanData, productData] = await Promise.all([
          artesiansService.getAll(),
          productService.getAll(),
        ]);
        if (isMounted) {
          setArtisans(artisanData);
          setProducts(productData);
        }
      } catch (error) {
        console.error("Erro ao carregar matrizes:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const matrizesData = useMemo(() => {
    return MATRIZES.map((matriz) => {
      const matrizProducts = products.filter((p) =>
        matriz.categories.includes(p.category),
      );
      const matrizArtisans = artisans.filter((a) =>
        matriz.categories.includes(a.craft),
      );
      const totalWorks = matrizArtisans.reduce(
        (acc, a) => acc + (a.totalWorks || 0),
        0,
      );
      const avgStars =
        matrizProducts.length > 0
          ? matrizProducts.reduce((acc, p) => acc + (p.stars || 0), 0) /
            matrizProducts.length
          : null;

      return {
        ...matriz,
        products: matrizProducts,
        artisans: matrizArtisans,
        totalWorks,
        avgStars,
      };
    });
  }, [artisans, products]);

  const totalPecas = products.length;

  return (
    <main className="pb-14 sm:pb-20">
      {/* Hero */}
      <section className="bg-(--barro-claro) p-6 sm:p-10 lg:p-15 rounded-md border mx-4 sm:mx-10 lg:mx-20 mt-6 sm:mt-8 lg:mt-10">
        <p className="hidden sm:inline font-bold bg-(--mangue)/20 py-2 px-4 sm:px-6 border border-(--mangue) rounded-3xl text-(--mangue) text-xs">
          Linguagens Populares de Pernambuco
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-carvao my-5 sm:my-7">
          As três matrizes da alma pernambucana
        </h1>
        <p className="font-thin text-sm sm:text-base max-w-3xl">
          Saberes seculares lapidados pelo barro dos rios, a paciência dos
          teares manuais e a firmeza da goiva no cedro. Conheça a origem de
          cada linguagem que compõe o acervo da Manoa.
        </p>

        <div className="flex flex-wrap items-center gap-4 sm:gap-5 mt-8 sm:mt-10">
          <div className="bg-white/70 border border-(--barro)/20 rounded-md px-5 py-3 min-w-[140px]">
            <p className="text-2xl sm:text-3xl font-bold text-carvao">
              {isLoading ? "…" : MATRIZES.length}
            </p>
            <p className="text-xs text-stone-600 font-medium">
              Matrizes populares
            </p>
          </div>
          <div className="bg-white/70 border border-(--barro)/20 rounded-md px-5 py-3 min-w-[140px]">
            <p className="text-2xl sm:text-3xl font-bold text-carvao">
              {isLoading ? "…" : artisans.length}
            </p>
            <p className="text-xs text-stone-600 font-medium">
              Mestres & Mestras
            </p>
          </div>
          <div className="bg-white/70 border border-(--barro)/20 rounded-md px-5 py-3 min-w-[140px]">
            <p className="text-2xl sm:text-3xl font-bold text-carvao">
              {isLoading ? "…" : totalPecas}
            </p>
            <p className="text-xs text-stone-600 font-medium">
              Peças catalogadas
            </p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-(--barro) animate-spin" />
        </div>
      ) : (
        <div className="space-y-14 sm:space-y-20 mt-12 sm:mt-16">
          {matrizesData.map((matriz, index) => {
            const isReversed = index % 2 === 1;
            const visibleArtisans = matriz.artisans.slice(0, 4);
            const extraCount =
              matriz.artisans.length - visibleArtisans.length;

            return (
              <section
                key={matriz.slug}
                id={matriz.slug}
                className="px-4 sm:px-10 lg:px-20"
              >
                <div
                  className={`flex flex-col ${
                    isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                  } gap-8 lg:gap-14 items-start`}
                >
                  {/* Imagem */}
                  <div className="w-full lg:w-[45%] shrink-0">
                    <div className="relative rounded-lg overflow-hidden border border-stone-200 aspect-4/3">
                      <img
                        src={matriz.imageUrl}
                        alt={matriz.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="w-full lg:w-[55%] space-y-5">
                    <div>
                      <p className="text-xs font-bold text-(--barro) uppercase tracking-wider">
                        {matriz.subtitle}
                      </p>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-carvao mt-1">
                        {matriz.title}
                      </h2>
                    </div>

                    <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                      {matriz.longDescription}
                    </p>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
                      <div className="bg-[#FAF3EA] border border-amber-200/60 rounded-lg p-3 sm:p-4 text-center">
                        <p className="text-lg sm:text-2xl font-bold text-carvao">
                          {matriz.artisans.length}
                        </p>
                        <p className="text-[10px] sm:text-xs text-stone-500 font-medium">
                          Mestres
                        </p>
                      </div>
                      <div className="bg-[#FAF3EA] border border-amber-200/60 rounded-lg p-3 sm:p-4 text-center">
                        <p className="text-lg sm:text-2xl font-bold text-carvao">
                          {matriz.products.length}
                        </p>
                        <p className="text-[10px] sm:text-xs text-stone-500 font-medium">
                          Peças no acervo
                        </p>
                      </div>
                      <div className="bg-[#FAF3EA] border border-amber-200/60 rounded-lg p-3 sm:p-4 text-center">
                        <p className="text-lg sm:text-2xl font-bold text-carvao flex items-center justify-center gap-1">
                          {matriz.avgStars ? matriz.avgStars.toFixed(1) : "—"}
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
                        </p>
                        <p className="text-[10px] sm:text-xs text-stone-500 font-medium">
                          Avaliação média
                        </p>
                      </div>
                    </div>

                    {matriz.artisans.length > 0 && (
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center">
                          {visibleArtisans.map((artisan, i) => (
                            <img
                              key={artisan.id}
                              src={artisan.avatarUrl}
                              alt={artisan.name}
                              title={artisan.name}
                              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm -ml-2 first:ml-0"
                              style={{ zIndex: visibleArtisans.length - i }}
                            />
                          ))}
                          {extraCount > 0 && (
                            <span className="w-9 h-9 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-stone-600 -ml-2">
                              +{extraCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-stone-500">
                          {matriz.artisans
                            .slice(0, 2)
                            .map((a) => a.name)
                            .join(", ")}
                          {matriz.artisans.length > 2 &&
                            ` e mais ${matriz.artisans.length - 2}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Produtos da matriz */}
                {matriz.products.length > 0 && (
                  <div className="mt-8 sm:mt-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base sm:text-lg font-bold text-carvao">
                        Obras desta matriz
                      </h3>
                      <Link
                        href={`/produtos?categoria=${encodeURIComponent(
                          matriz.categories[0],
                        )}`}
                        className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-(--urucum) hover:underline shrink-0"
                      >
                        Ver acervo completo <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                      {matriz.products.slice(0, 4).map((product) => (
                        <Link
                          key={product.id}
                          href={`/produtos/${product.id}`}
                          className="group bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-square overflow-hidden bg-stone-100">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3 space-y-1">
                            <p className="text-xs sm:text-sm font-semibold text-carvao line-clamp-1">
                              {product.name}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-bold text-(--barro)">
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(product.price)}
                              </span>
                              <span className="flex items-center gap-0.5 text-[10px] sm:text-xs text-stone-500">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                {product.stars}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* CTA final */}
      <section className="px-4 sm:px-10 lg:px-20 mt-14 sm:mt-20">
        <div className="bg-(--barro) rounded-md p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-5 text-white">
          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold">
              Quer conhecer todos os mestres por trás dessas matrizes?
            </h3>
            <p className="text-sm text-white/80 mt-1 max-w-lg">
              Cada linguagem popular é sustentada por famílias e comunidades
              inteiras espalhadas pelos polos criativos de Pernambuco.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/artesaos"
              className="text-center px-6 py-3 bg-white text-(--barro) font-semibold rounded-md hover:scale-105 transition-transform duration-100"
            >
              Ver Mestres
            </Link>
            <Link
              href="/polos"
              className="text-center px-6 py-3 border border-white/40 text-white font-semibold rounded-md hover:bg-white/10 transition-colors duration-100"
            >
              Ver Polos Criativos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}