"use client";

import { useArtisans } from "@/hooks/use-artisans";

import { ArtisansGrid } from "./_components/artisans-grid";
import { ArtisansHeader } from "./_components/artisans-header";

export default function ArtesaosListPage() {
  const { artisans, isLoading, error } = useArtisans();

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4 lg:py-6 space-y-6 sm:space-y-8">
      <ArtisansHeader />
      <ArtisansGrid isLoading={isLoading} error={error} artisans={artisans} />
    </main>
  );
}
