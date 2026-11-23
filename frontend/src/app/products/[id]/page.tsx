/* eslint-disable @next/next/no-img-element */
"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, EyeOff, ShieldCheck, Truck } from "lucide-react";

import { PageLoading, PageMessage } from "@/components/common/page-state";
import { ArtisanAbout } from "@/components/products/artisan-about";
import { ProductInfo } from "@/components/products/product-info";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { ProductStory } from "@/components/products/product-story";
import { RelatedProducts } from "@/components/products/related-products";
import { RecommendationsSection } from "@/components/recommendations/recommendations-section";
import { ProductReviews } from "@/components/reviews/product-reviews";
import { Button } from "@/components/ui/button";
import { useProductDetail } from "@/hooks/use-product-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { isLoading, product, notFound, isOwner, isUnpublished, artisan, related } = useProductDetail(id);

  if (isLoading) return <PageLoading />;

  if (notFound || !product) {
    return (
      <PageMessage title="Produto não encontrado." description="A peça pode ter sido removida, estar indisponível ou o endereço está incorreto.">
        <Button render={<Link href="/products" />} variant="outline" className="py-4 px-8">
          Voltar para o acervo
        </Button>
      </PageMessage>
    );
  }

  return (
    <main className="px-4 sm:px-8 lg:px-20 pb-14 sm:pb-20 space-y-10 sm:space-y-14">
      <div>
        <Link href="/products" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para o acervo
        </Link>

        {isUnpublished && (
          <p role="status" className="mt-4 flex items-center gap-2 rounded-md border bg-muted/60 p-3 text-sm text-muted-foreground">
            <EyeOff className="w-4 h-4 shrink-0" aria-hidden />
            Esta peça não está visível na vitrine (desativada ou aguardando curadoria).
            {isOwner && (
              <Link href={`/products/${product.id}/edit`} className="ml-auto text-brand font-semibold hover:underline">
                Editar
              </Link>
            )}
          </p>
        )}

        <section className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          <div className="relative rounded-lg overflow-hidden border aspect-square bg-muted">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="w-full space-y-5">
            <ProductInfo product={product} />
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
                  <p className="text-[11px] text-muted-foreground">Embalagem reforçada com selo de autenticidade</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductStory story={product.story} />
      {artisan && <ArtisanAbout artisan={artisan} />}
      <ProductReviews productId={product.id} />
      <RelatedProducts products={related} category={product.category} />
      <RecommendationsSection surface="product-reco" limit={4} excludeIds={[product.id]} />
    </main>
  );
}
