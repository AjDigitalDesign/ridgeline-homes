"use client";

import { useTenant } from "@/components/providers/tenant-provider";
import DesignCenterSectionClassic from "../design-center-section";
import { DesignCenterSectionBold } from "../design-center-section-bold";

interface DesignCenterSectionProps {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  linkTitle?: string | null;
  linkUrl?: string | null;
  image?: string | null;
}

export function DesignCenterSection({
  title,
  subtitle,
  description,
  linkTitle,
  linkUrl,
  image,
}: DesignCenterSectionProps) {
  const { tenant } = useTenant();
  const template = tenant?.homepageTemplate || "MODERN";

  switch (template) {
    case "BOLD":
      return (
        <DesignCenterSectionBold
          title={title}
          subtitle={subtitle}
          description={description}
          linkTitle={linkTitle}
          linkUrl={linkUrl}
          image={image}
        />
      );
    case "MODERN":
    default:
      return (
        <DesignCenterSectionClassic
          title={title}
          description={description}
          linkTitle={linkTitle}
          linkUrl={linkUrl}
          image={image}
        />
      );
  }
}

export default DesignCenterSection;
