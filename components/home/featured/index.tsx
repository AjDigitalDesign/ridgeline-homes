"use client";

import { useTenant } from "@/components/providers/tenant-provider";
import FeaturedSectionClassic from "../featured-section";
import { FeaturedSectionBold } from "../featured-section-bold";
import type { Community, Home } from "@/lib/api";

interface FeaturedSectionProps {
  communities: Community[];
  homes: Home[];
}

export function FeaturedSection({ communities, homes }: FeaturedSectionProps) {
  const { tenant } = useTenant();
  const template = tenant?.homepageTemplate || "MODERN";

  switch (template) {
    case "BOLD":
      return <FeaturedSectionBold communities={communities} homes={homes} />;
    case "MODERN":
    default:
      return <FeaturedSectionClassic communities={communities} homes={homes} />;
  }
}

export default FeaturedSection;
