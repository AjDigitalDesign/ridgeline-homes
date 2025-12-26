"use client";

import { useTenant } from "@/components/providers/tenant-provider";
import FeaturedSectionClassic from "../featured-section";
import { FeaturedSectionBold } from "../featured-section-bold";
import type { Community, Home } from "@/lib/api";

interface FeaturedSectionProps {
  communities: Community[];
  homes: Home[];
  title?: string | null;
}

export function FeaturedSection({ communities, homes, title }: FeaturedSectionProps) {
  const { tenant } = useTenant();
  const template = tenant?.homepageTemplate || "MODERN";

  switch (template) {
    case "BOLD":
      return <FeaturedSectionBold communities={communities} homes={homes} title={title} />;
    case "MODERN":
    default:
      return <FeaturedSectionClassic communities={communities} homes={homes} title={title} />;
  }
}

export default FeaturedSection;
