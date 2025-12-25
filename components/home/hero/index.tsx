"use client";

import { useTenant } from "@/components/providers/tenant-provider";
import { HeroClassic, type BannerSlide } from "./hero-classic";
import { HeroBold } from "./hero-bold";

export type { BannerSlide };

interface HeroSectionProps {
  slides: BannerSlide[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  // Hero Video fields for BOLD template
  heroVideoUrl?: string | null;
  heroVideoTitle?: string | null;
  heroVideoSubtitle?: string | null;
  heroVideoPosterImage?: string | null;
  heroBackgroundImage?: string | null;
  heroShowSearch?: boolean;
}

export function HeroSection({
  slides,
  socialLinks,
  heroVideoUrl,
  heroVideoTitle,
  heroVideoSubtitle,
  heroVideoPosterImage,
  heroBackgroundImage,
  heroShowSearch,
}: HeroSectionProps) {
  const { tenant } = useTenant();
  const template = tenant?.homepageTemplate || "MODERN";

  switch (template) {
    case "BOLD":
      return (
        <HeroBold
          slides={slides}
          socialLinks={socialLinks}
          heroVideoUrl={heroVideoUrl}
          heroVideoTitle={heroVideoTitle}
          heroVideoSubtitle={heroVideoSubtitle}
          heroVideoPosterImage={heroVideoPosterImage}
          heroBackgroundImage={heroBackgroundImage}
          heroShowSearch={heroShowSearch}
        />
      );
    case "MODERN":
    default:
      return <HeroClassic slides={slides} socialLinks={socialLinks} />;
  }
}

// Default export for backward compatibility
export default HeroSection;
