/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, ShieldCheck, Star, Truck } from "lucide-react";

import { ArtisanAbout } from "@/components/products/artisan-about";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { RelatedProducts } from "@/components/products/related-products";
import { PageLoading, PageMessage } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
import { productService } from "@/services/productService";
import { artesiansService } from "@/services/artisansService";
import type { Artisan } from "@/types/artisan";
import type { Product } from "@/types/product";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const found = await productService.getById(id);
        if (!isMounted) return;
        setProduct(found);

        const [sameCategory, artisanData] = await Promise.all([
          productService.getByCategory(found.category).catch(() => []),
          artesiansService.getById(found.artisanId).catch(() => null),
        ]);
        if (!isMounted) return;
        setRelatedProducts(sameCategory.filter((p) => String(p.id) !== String(found.id)).slice(0, 4));
        setArtisan(artisanData);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        if (isMounted) setProduct(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) return <PageLoading />;

  if (!product) {
    return (
      <PageMessage title="Produto não encontrado." description="A peça pode ter sido removida ou o endereço está incorreto.">
        <Button render={<Link href="/produtos" />} variant="outline" className="py-4 px-8">
          Voltar para o acervo
        </Button>
      </PageMessage>
    );
  }

  return (
    <main className="px-4 sm:px-8 lg:px-20 pb-14 sm:pb-20 space-y-10 sm:space-y-14">
      <div>
        <Link
          href="/produtos"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm w-fit transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o acervo
        </Link>

        <section className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          <div className="relative rounded-lg overflow-hidden border aspect-square bg-muted">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="w-full space-y-5">
            <div className="space-y-2">
              <span className="inline-block text-xs font-bold bg-forest/15 border border-forest/50 text-forest rounded-3xl px-4 py-1.5 uppercase tracking-wide">
                {product.category}
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug">{product.name}</h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <strong className="text-foreground">{product.stars}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-brand-strong" />
                  {product.location}
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="pt-2">
              <p className="text-3xl sm:text-4xl font-bold">{formatBRL(product.price)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Peça única · sujeita a pequenas variações naturais do artesanato
              </p>
            </div>

            <ProductPurchasePanel product={product} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold">Origem Certificada</p>
                  <p className="text-[11px] text-muted-foreground">Rastreabilidade completa até o ateliê</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold">Envio Cuidadoso</p>
                  <p className="text-[11px] text-muted-foreground">
                    Embalagem reforçada com selo de autenticidade
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {artisan && <ArtisanAbout artisan={artisan} />}
      <RelatedProducts products={relatedProducts} category={product.category} />
    </main>
  );
}
