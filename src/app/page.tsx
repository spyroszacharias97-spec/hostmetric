import Hero from "@/components/hero";
import Services from "@/components/services";
import Performance from "@/components/performance";
import HowItWorks from "@/components/how-it-works";
import PlatformOrbit from "@/components/platform-orbit";
import PropertyGrowth from "@/components/property-growth";
import FeaturedResults from "@/components/featured-results";

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <Services />
      <Performance />
      <HowItWorks />
      <PlatformOrbit />
      <PropertyGrowth />
      <FeaturedResults />
    </main>
  );
}