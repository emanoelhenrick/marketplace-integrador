"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ArtisanProfileHeader } from "@/components/artisan/artisan-profile-header";
import { ArtisanStudio } from "@/components/artisan/artisan-studio";
import { CardImageProduct } from "@/components/cards/card-image-product";
import { EmptyBlock, PageLoading, PageMessage } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { canManageArtisan } from "@/lib/permissions";
import { artesiansService } from "@/services/artisansService";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import type { Artisan } from "@/types/artisan";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArtisanDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { ready, user, isArtisan } = useSession();

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pedidos (com dados de clientes e repasse) só são buscados para o dono ou a administração.
  const canManage = canManageArtisan(user, id);

  useEffect(() => {
    if (!ready) return;
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const [artisanData, artisanProducts, artisanOrders] = await Promise.all([
          artesiansService.getById(id),
          productService.getByArtisan(id).catch(() => [] as Product[]),
          canManage ? orderService.getByArtisan(id).catch(() => [] as Order[]) : Promise.resolve([] as Order[]),
        ]);
        if (!isMounted) return;
        setArtisan(artisanData);
        setProducts(artisanProducts);
        setOrders(artisanOrders);
      } catch (error) {
        console.error("Erro ao carregar ateliê:", error);
        if (isMounted) setArtisan(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id, ready, canManage]);

  if (!ready || isLoading) return <PageLoading />;

  if (!artisan) {
    return (
      <PageMessage title="Artesão não encontrado.">
        <Button render={<Link href="/artesaos" />} variant="outline" className="py-4 px-8">
          Voltar para a lista de artesãos
        </Button>
      </PageMessage>
    );
  }

  const isOwner = isArtisan && String(user?.id) === String(artisan.id);

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4 space-y-8 sm:space-y-10">
      <Link
        href="/artesaos"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm w-fit transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a lista
      </Link>

      <ArtisanProfileHeader artisan={artisan} canManage={canManage} canAddProduct={isOwner} />

      {canManage ? (
        <ArtisanStudio artisan={artisan} products={products} initialOrders={orders} isOwner={isOwner} />
      ) : (
        <section className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-heading font-bold">
            Obras de {artisan.name.split(" ").slice(0, 3).join(" ")}
          </h2>
          {products.length === 0 ? (
            <EmptyBlock message="Este mestre ainda não cadastrou peças no acervo." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product) => (
                <CardImageProduct key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
