import CardArtisan from "@/components/cards/card-artisans";
import { EmptyBlock, PageLoading } from "@/components/common/page-state";
import { Artisan } from "@/types/artisan";


export function ArtisansGrid({
  isLoading,
  error,
  artisans,
}: {
  isLoading: boolean;
  error: string | null;
  artisans: Artisan[];
}) {
  if (isLoading) {
    return <PageLoading label="Carregando mestres..." />;
  }

  if (error) {
    return (
      <p role="alert" className="p-6 bg-destructive/10 text-destructive rounded-md text-center">
        {error}
      </p>
    );
  }

  if (artisans.length === 0) {
    return <EmptyBlock message="Nenhum mestre encontrado para este filtro." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
      {artisans.map((artisan) => (
        <CardArtisan key={artisan.id} artisan={artisan} />
      ))}
    </div>
  );
}