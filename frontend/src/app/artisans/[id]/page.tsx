"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ArtisanProfileHeader } from "@/app/artisans/[id]/_components/artisan-profile-header";
import { ArtisanPublicStory } from "@/app/artisans/[id]/_components/artisan-public-story";
import { ArtisanStudio } from "@/app/artisans/[id]/_components/artisan-studio";
import { CardImageProduct } from "@/components/cards/card-image-product";
import { EmptyBlock, PageLoading, PageMessage } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { useArtisanPage } from "@/hooks/use-artisan-page";

export default function ArtisanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading, artisan, products, orders, canManage, isOwner } = useArtisanPage(id);

  if (isLoading) return <PageLoading />;

  if (!artisan) {
    return (
      <PageMessage title="Artesão não encontrado.">
        <Button render={<Link href="/artisans" />} variant="outline" className="py-4 px-8">
          Voltar para a lista de artesãos
        </Button>
      </PageMessage>
    );
  }

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4 space-y-8 sm:space-y-10">
      <Link href="/artisans" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar para a lista
      </Link>

      <ArtisanProfileHeader artisan={artisan} canManage={canManage} canAddProduct={isOwner} />
      <ArtisanPublicStory artisan={artisan} />

      {canManage ? (
        <ArtisanStudio artisan={artisan} products={products} initialOrders={orders} isOwner={isOwner} />
      ) : (
        <section className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-heading font-bold">Obras de {artisan.name}</h2>
          {products.length === 0 ? (
            <EmptyBlock message="Este mestre ainda não tem peças disponíveis no acervo." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product, index) => (
                <CardImageProduct key={product.id} product={product} trackingSurface="artisan-page" position={index} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
