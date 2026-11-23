import { FeaturedArtisans } from "@/app/_components/featured-artisans";
import { HeroSection } from "@/app/_components/hero-section";
import { MatrizesSection } from "@/app/_components/matrizes-section";

export default function Home() {
  return (
    <main className="flex flex-col gap-16 sm:gap-24 -mb-6 sm:-mb-10">
      <HeroSection />
      <MatrizesSection />
      <FeaturedArtisans />
    </main>
  );
}
