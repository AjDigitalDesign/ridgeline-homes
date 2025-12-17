import HeroSlider from "@/components/home/hero-slider";
import PromoBanner from "@/components/home/promo-banner";
import AboutSection from "@/components/home/about-section";
import MarketAreasSection from "@/components/home/market-areas-section";
import DesignCenterSection from "@/components/home/design-center-section";
import FeaturedSection from "@/components/home/featured-section";
import SmartHomeSection from "@/components/home/smart-home-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import QuestionsSection from "@/components/home/questions-section";
import {
  fetchFrontPage,
  fetchTenant,
  fetchMarketAreas,
  fetchCommunities,
  fetchHomes,
} from "@/lib/api";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  // Fetch all data with error handling
  const [frontPageRes, tenantRes, marketAreasRes, communitiesRes, homesRes] =
    await Promise.all([
      fetchFrontPage().catch((e) => {
        console.error("Failed to fetch front page:", e);
        return { data: null };
      }),
      fetchTenant().catch((e) => {
        console.error("Failed to fetch tenant:", e);
        return { data: null };
      }),
      fetchMarketAreas().catch((e) => {
        console.error("Failed to fetch market areas:", e);
        return { data: [] };
      }),
      fetchCommunities({ limit: 4 }).catch((e) => {
        console.error("Failed to fetch communities:", e);
        return { data: [] };
      }),
      fetchHomes({ limit: 4 }).catch((e) => {
        console.error("Failed to fetch homes:", e);
        return { data: [] };
      }),
    ]);

  const frontPage = frontPageRes.data;
  const tenant = tenantRes.data;
  // Ensure arrays are actually arrays
  const marketAreas = Array.isArray(marketAreasRes.data) ? marketAreasRes.data : [];
  const communities = Array.isArray(communitiesRes.data) ? communitiesRes.data : [];
  const homes = Array.isArray(homesRes.data) ? homesRes.data : [];

  return (
    <main>
      <HeroSlider
        slides={frontPage?.bannerSlides ?? []}
        socialLinks={{
          twitter: tenant?.twitterUrl ?? undefined,
          instagram: tenant?.instagramUrl ?? undefined,
          facebook: tenant?.facebookUrl ?? undefined,
        }}
      />
      {tenant?.promoBannerEnabled && tenant?.promoBannerDescription && (
        <section className="bg-[#C0CDD1] py-10 lg:py-16 xl:py-20">
          <div className="container mx-auto px-4 lg:px-10 xl:px-16 -mt-20 lg:-mt-28 relative z-10 lg:max-w-5xl xl:max-w-6xl">
            <PromoBanner
              description={tenant.promoBannerDescription}
              link={tenant.promoBannerLink}
            />
          </div>
        </section>
      )}
      <AboutSection />
      <MarketAreasSection marketAreas={marketAreas} />
      <DesignCenterSection />
      <FeaturedSection communities={communities} homes={homes} />
      <SmartHomeSection />
      <TestimonialsSection />
      <QuestionsSection />
    </main>
  );
}
