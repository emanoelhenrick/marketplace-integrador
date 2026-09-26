/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Star,
  MapPin,
  ShieldCheck,
  Truck,
  Minus,
  Plus,
  ShoppingBag,
  Award,
} from "lucide-react";

import { Product } from "@/types/product";
import { Artisan } from "@/types/artisan";
import { productService } from "@/services/productService";
import { artesiansService } from "@/services/artisansService";
import { useCartStore } from "@/store/cardStore";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const numericId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    let isMounted = true;

    async function loadProductData() {
      try {
        setIsLoading(true);

        const allProducts = await productService.getAll();
        const foundProduct = allProducts.find((p) => p.id === numericId);

        if (!isMounted) return;

        setProduct(foundProduct || null);

        if (foundProduct) {
          const related = allProducts
            .filter(
              (p) =>
                p.category === foundProduct.category &&
                p.id !== foundProduct.id,
            )
            .slice(0, 4);
          setRelatedProducts(related);

          try {
            const artisanData = await artesiansService.getById(
              foundProduct.artisanId,
            );
            if (isMounted) setArtisan(artisanData);
          } catch (err) {
            console.error("Erro ao carregar dados do mestre:", err);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (id) loadProductData();
    return () => {
      isMounted = false;
    };
  }, [id, numericId]);

  const handleAddToCart = () => {
    if (!product) return;

    // addItem só aceita o produto (adiciona 1 unidade por chamada),
    // então repetimos a chamada de acordo com a quantidade selecionada.
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 text-(--barro) animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-4 sm:px-8 lg:px-20 py-20 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-carvao">
          Produto não encontrado.
        </h2>
        <Link
          href="/produtos"
          className="text-(--barro) underline inline-block"
        >
          Voltar para o acervo
        </Link>
      </div>
    );
  }

  return (
    <main className="pb-14 sm:pb-20">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-8 lg:px-20 pt-6 sm:pt-8">
        <Link
          href="/produtos"
          className="flex items-center gap-2 text-stone-600 hover:text-carvao text-sm w-fit transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o acervo
        </Link>
      </div>

      {/* Produto principal */}
      <section className="px-4 sm:px-8 lg:px-20 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Imagem */}
          <div className="w-full">
            <div className="relative rounded-lg overflow-hidden border border-stone-200 aspect-square bg-stone-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Informações */}
          <div className="w-full space-y-5">
            <div className="space-y-2">
              <span className="inline-block text-xs font-bold bg-(--mangue)/20 border border-(--mangue) text-(--mangue) rounded-3xl px-4 py-1.5 uppercase tracking-wide">
                {product.category}
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-carvao leading-snug">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-600">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <strong className="text-carvao">{product.stars}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-(--urucum)" />
                  {product.location}
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {product.description}
            </p>

            <div className="pt-2">
              <p className="text-3xl sm:text-4xl font-bold text-carvao">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.price)}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Peça única · sujeita a pequenas variações naturais do
                artesanato
              </p>
            </div>

            {/* Seletor de quantidade + Adicionar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex items-center border border-stone-300 rounded-md w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-stone-50 transition-colors cursor-pointer"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 hover:bg-stone-50 transition-colors cursor-pointer"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1 py-6 sm:py-3 font-semibold cursor-pointer bg-(--barro) hover:scale-[1.02] transition-transform duration-100 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                {justAdded ? "Adicionado ao carrinho!" : "Adicionar ao Carrinho"}
              </Button>
            </div>

            {/* Selos de confiança */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-200">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-carvao">
                    Origem Certificada
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Rastreabilidade completa até o ateliê
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-carvao">
                    Envio Cuidadoso
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Embalagem reforçada com selo de autenticidade
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre o mestre */}
      {artisan && (
        <section className="px-4 sm:px-8 lg:px-20 mt-10 sm:mt-14">
          <div className="bg-(--barro-claro) border rounded-md p-5 sm:p-8">
            <p className="text-xs font-bold text-(--barro) uppercase tracking-wider mb-4">
              Sobre o Mestre
            </p>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img
                src={artisan.avatarUrl}
                alt={artisan.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-sm shrink-0 mx-auto sm:mx-0"
              />

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-carvao">
                  {artisan.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 flex items-center justify-center sm:justify-start gap-1.5">
                  <Award className="w-3.5 h-3.5 text-(--urucum) shrink-0" />
                  {artisan.craft} · {artisan.craftYears}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 flex items-center justify-center sm:justify-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-(--urucum) shrink-0" />
                  {artisan.location}
                </p>
                {artisan.quote && (
                  <p className="text-xs sm:text-sm text-stone-500 italic leading-relaxed pt-1">
                    &ldquo;{artisan.quote}&rdquo;
                  </p>
                )}
              </div>

              <Link
                href={`/artesaos/${artisan.id}`}
                className="shrink-0 w-full sm:w-auto text-center px-5 py-2.5 bg-white border border-stone-300 text-carvao text-sm font-semibold rounded-md hover:bg-stone-50 transition-colors"
              >
                Ver perfil do mestre
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Produtos relacionados */}
      {relatedProducts.length > 0 && (
        <section className="px-4 sm:px-8 lg:px-20 mt-10 sm:mt-14">
          <h2 className="text-xl sm:text-2xl font-bold text-carvao mb-6">
            Outras peças de {product.category}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={`/produtos/${related.id}`}
                className="group bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={related.image}
                    alt={related.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs sm:text-sm font-semibold text-carvao line-clamp-1">
                    {related.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-(--barro)">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(related.price)}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] sm:text-xs text-stone-500">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {related.stars}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}