import { FeaturedArtisans } from "@/components/home/featured-artisans";
import { HeroSection } from "@/components/home/hero-section";
import { MatrizesSection } from "@/components/home/matrizes-section";

export default function Home() {
  return (
    <main className="flex flex-col gap-16 sm:gap-24 -mb-6 sm:-mb-10">
      <HeroSection />
      <MatrizesSection />
      <FeaturedArtisans />
    </main>
  );
}
