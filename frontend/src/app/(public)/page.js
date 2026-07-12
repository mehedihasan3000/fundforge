import HeroSection from "@/components/HeroSection";
import TopCampaigns from "@/components/TopCampaigns";
import HowItWorks from "@/components/HowItWorks";
import CategorySection from "@/components/CategorySection";
import ImpactSection from "@/components/ImpactSection";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TopCampaigns />
      <HowItWorks />
      <CategorySection />
      <ImpactSection />
      <Testimonials />
    </>
  );
}
