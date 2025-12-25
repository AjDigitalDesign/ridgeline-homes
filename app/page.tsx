import { HeroSection } from "@/components/home/hero";
import PromoBanner from "@/components/home/promo-banner";
import { AboutSection } from "@/components/home/about";
import MarketAreasSection from "@/components/home/market-areas-section";
import { WhereToLiveBold } from "@/components/home/where-to-live-bold";
import { DesignCenterSection } from "@/components/home/design-center";
import { DesignCenterSectionBold } from "@/components/home/design-center-section-bold";
import { FlexContentBold } from "@/components/home/flex-content-bold";
import { FeaturedSection } from "@/components/home/featured";
import SmartHomeSection from "@/components/home/smart-home-section";
import { TestimonialsSection } from "@/components/home/testimonials";
import QuestionsSection from "@/components/home/questions-section";
import {
  fetchHomePage,
  fetchTenant,
  type HomePage,
  type Tenant,
  type MarketArea,
} from "@/lib/api";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Section config type from API
interface SectionConfig {
  type: string;
  enabled: boolean;
  order: number;
}

// Default section order for fallback
const DEFAULT_SECTIONS: SectionConfig[] = [
  { type: "HERO_SLIDER", enabled: true, order: 0 },
  { type: "MODERN_ABOUT", enabled: true, order: 1 },
  { type: "WHERE_TO_LIVE", enabled: true, order: 2 },
  { type: "BLOCK_CONTENT", enabled: true, order: 3 },
  { type: "FEATURED", enabled: true, order: 4 },
  { type: "FLEX_CONTENT", enabled: true, order: 5 },
  { type: "TESTIMONIALS", enabled: true, order: 6 },
  { type: "CTA", enabled: true, order: 7 },
];

// Section renderer component
function SectionRenderer({
  section,
  homePage,
  tenant,
}: {
  section: SectionConfig;
  homePage: HomePage | null;
  tenant: Tenant | null;
}) {
  switch (section.type) {
    case "HERO_SLIDER":
    case "HERO_VIDEO":
      return (
        <HeroSection
          key="hero"
          slides={homePage?.bannerSlides ?? []}
          socialLinks={{
            twitter: tenant?.twitterUrl ?? undefined,
            instagram: tenant?.instagramUrl ?? undefined,
            facebook: tenant?.facebookUrl ?? undefined,
          }}
          heroVideoUrl={homePage?.heroVideoUrl}
          heroVideoTitle={homePage?.heroVideoTitle}
          heroVideoSubtitle={homePage?.heroVideoSubtitle}
          heroVideoPosterImage={homePage?.heroVideoPosterImage}
          heroBackgroundImage={homePage?.heroBackgroundImage}
          heroShowSearch={homePage?.heroShowSearch}
        />
      );

    case "PROMO":
      if (!tenant?.promoBannerEnabled || !tenant?.promoBannerDescription) {
        return null;
      }
      return (
        <section key="promo" className="bg-[#C0CDD1] py-10 lg:py-16 xl:py-20">
          <div className="container mx-auto px-4 lg:px-10 xl:px-16 -mt-20 lg:-mt-28 relative z-10 lg:max-w-5xl xl:max-w-6xl">
            <PromoBanner
              description={tenant.promoBannerDescription}
              link={tenant.promoBannerLink}
            />
          </div>
        </section>
      );

    case "ABOUT":
      // BOLD template about section
      if ((homePage as unknown as { showAboutSection?: boolean })?.showAboutSection === false) return null;
      return (
        <AboutSection
          key="about-bold"
          title={(homePage as unknown as { aboutTitle?: string })?.aboutTitle}
          content={(homePage as unknown as { aboutDescription?: string })?.aboutDescription}
          linkTitle={(homePage as unknown as { aboutButtonText?: string })?.aboutButtonText}
          linkUrl={(homePage as unknown as { aboutButtonLink?: string })?.aboutButtonLink}
          image={homePage?.aboutImages?.[0]}
          image2={homePage?.aboutImages?.[1]}
          subheading={(homePage as unknown as { aboutSubtitle?: string })?.aboutSubtitle}
        />
      );

    case "MODERN_ABOUT":
      // Only hide if explicitly set to false
      if (homePage?.showModernAbout === false) return null;
      return (
        <AboutSection
          key="about"
          title={homePage?.modernAboutTitle}
          content={homePage?.modernAboutContent}
          linkTitle={homePage?.modernAboutLinkTitle}
          linkUrl={homePage?.modernAboutLinkUrl}
          image={homePage?.modernAboutImage}
        />
      );

    case "WHERE_TO_LIVE":
      return (
        <MarketAreasSection
          key="marketAreas"
          marketAreas={homePage?.whereToLiveMarketAreas ?? []}
        />
      );

    case "BOLD_WHERE_TO_LIVE":
      if ((homePage as unknown as { showBoldWhereToLive?: boolean })?.showBoldWhereToLive === false) return null;
      return (
        <WhereToLiveBold
          key="boldWhereToLive"
          subtitle={(homePage as unknown as { boldWhereToLiveSubtitle?: string })?.boldWhereToLiveSubtitle}
          title={(homePage as unknown as { boldWhereToLiveTitle?: string })?.boldWhereToLiveTitle}
          marketAreas={(homePage as unknown as { boldWhereToLiveMarketAreas?: MarketArea[] })?.boldWhereToLiveMarketAreas ?? homePage?.whereToLiveMarketAreas ?? []}
        />
      );

    case "BLOCK_CONTENT":
      if (homePage?.showBlockContent === false) return null;
      return (
        <DesignCenterSection
          key="designCenter"
          title={homePage?.blockContentTitle}
          subtitle={(homePage as unknown as { blockContentSubtitle?: string })?.blockContentSubtitle}
          description={homePage?.blockContentDescription}
          linkTitle={homePage?.blockContentLinkTitle}
          linkUrl={homePage?.blockContentLinkUrl}
          image={homePage?.blockContentImage}
        />
      );

    case "OUR_APPROACH":
      if ((homePage as unknown as { showOurApproach?: boolean })?.showOurApproach === false) return null;
      return (
        <DesignCenterSectionBold
          key="ourApproach"
          title={(homePage as unknown as { ourApproachTitle?: string })?.ourApproachTitle}
          subtitle={(homePage as unknown as { ourApproachSubtitle?: string })?.ourApproachSubtitle}
          description={(homePage as unknown as { ourApproachDescription?: string })?.ourApproachDescription}
          linkTitle={(homePage as unknown as { ourApproachLinkTitle?: string })?.ourApproachLinkTitle}
          linkUrl={(homePage as unknown as { ourApproachLinkUrl?: string })?.ourApproachLinkUrl}
          image={(homePage as unknown as { ourApproachImage?: string })?.ourApproachImage}
        />
      );

    case "FEATURED":
      return (
        <FeaturedSection
          key="featured"
          communities={homePage?.featuredCommunities ?? []}
          homes={homePage?.featuredHomes ?? []}
        />
      );

    case "FLEX_CONTENT":
      if (homePage?.showFlexContent === false) return null;
      return (
        <SmartHomeSection
          key="smartHome"
          title={homePage?.flexContentTitle}
          description={homePage?.flexContentDescription}
          linkTitle={homePage?.flexContentLinkTitle}
          linkUrl={homePage?.flexContentLinkUrl}
          image={homePage?.flexContentImage}
        />
      );

    case "BOLD_FLEX_CONTENT":
      if ((homePage as unknown as { showBoldFlexContent?: boolean })?.showBoldFlexContent === false) return null;
      return (
        <FlexContentBold
          key="boldFlexContent"
          subtitle={(homePage as unknown as { boldFlexContentSubtitle?: string })?.boldFlexContentSubtitle}
          title={(homePage as unknown as { boldFlexContentTitle?: string })?.boldFlexContentTitle}
          description={(homePage as unknown as { boldFlexContentDescription?: string })?.boldFlexContentDescription}
          linkTitle={(homePage as unknown as { boldFlexContentLinkTitle?: string })?.boldFlexContentLinkTitle}
          linkUrl={(homePage as unknown as { boldFlexContentLinkUrl?: string })?.boldFlexContentLinkUrl}
          image={(homePage as unknown as { boldFlexContentImage?: string })?.boldFlexContentImage}
        />
      );

    case "TESTIMONIALS":
      // Only hide if explicitly set to false
      if (homePage?.showTestimonials === false) return null;
      return (
        <TestimonialsSection
          key="testimonials"
          title={homePage?.testimonialsTitle}
          testimonials={homePage?.testimonials}
          image1={homePage?.testimonialImage1}
          image2={homePage?.testimonialImage2}
        />
      );

    case "CTA":
      return <QuestionsSection key="cta" />;

    default:
      console.warn(`Unknown section type: ${section.type}`);
      return null;
  }
}

export default async function Home() {
  // Fetch home page data and tenant config
  const [homePageRes, tenantRes] = await Promise.all([
    fetchHomePage().catch((e) => {
      console.error("Failed to fetch home page:", e);
      return { data: null };
    }),
    fetchTenant().catch((e) => {
      console.error("Failed to fetch tenant:", e);
      return { data: null };
    }),
  ]);

  const homePage = homePageRes.data;
  const tenant = tenantRes.data;

  // Get section configuration from templateConfig in homePage response
  // Handle both possible structures: templateConfig.sections (array) or templateConfig.sections.sections (nested)
  const templateConfig = (homePage as unknown as {
    templateConfig?: {
      sections?: SectionConfig[] | { sections?: SectionConfig[] }
    }
  })?.templateConfig;

  let sectionConfig: SectionConfig[] = DEFAULT_SECTIONS;
  if (templateConfig?.sections) {
    if (Array.isArray(templateConfig.sections)) {
      sectionConfig = templateConfig.sections;
    } else if (Array.isArray((templateConfig.sections as { sections?: SectionConfig[] }).sections)) {
      sectionConfig = (templateConfig.sections as { sections: SectionConfig[] }).sections;
    }
  }

  // Filter enabled sections (already sorted by backend)
  const orderedSections = sectionConfig.filter((s) => s.enabled);

  return (
    <main>
      {orderedSections.map((section) => (
        <SectionRenderer
          key={section.type}
          section={section}
          homePage={homePage}
          tenant={tenant}
        />
      ))}
    </main>
  );
}
