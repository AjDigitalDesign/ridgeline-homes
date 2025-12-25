"use client";

import { useTenant } from "@/components/providers/tenant-provider";
import { AboutClassic } from "./about-classic";
import { AboutBold } from "./about-bold";

interface AboutSectionProps {
  title?: string | null;
  content?: string | null;
  linkTitle?: string | null;
  linkUrl?: string | null;
  image?: string | null;
  // Additional props for BOLD template
  image2?: string | null;
  subheading?: string | null;
}

export function AboutSection({
  title,
  content,
  linkTitle,
  linkUrl,
  image,
  image2,
  subheading,
}: AboutSectionProps) {
  const { tenant } = useTenant();
  const template = tenant?.homepageTemplate || "MODERN";

  const props = { title, content, linkTitle, linkUrl, image, image2, subheading };

  switch (template) {
    case "BOLD":
      return <AboutBold {...props} />;
    case "MODERN":
    default:
      return <AboutClassic {...props} />;
  }
}

// Default export for backward compatibility
export default AboutSection;
