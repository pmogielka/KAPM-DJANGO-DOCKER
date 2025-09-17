import { HeroSection } from "@/components/sections/hero/hero-section";
import { SpecializationsSection } from "@/components/sections/specializations-section";
import { NewsSection } from "@/components/sections/news-section";
import { ExpertHouseSection } from "@/components/sections/expert-house-section";
import { RankingsSection } from "@/components/sections/rankings-section";
import { BlogsSection } from "@/components/sections/blogs-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SpecializationsSection />
      <NewsSection />
      <ExpertHouseSection />
      <RankingsSection />
      <BlogsSection />
    </>
  );
}